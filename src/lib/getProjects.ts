/**
 * Projects are read from a public Google Sheet; each video is hosted in Google Drive.
 *
 * SHARING — both of these must be set to "Anyone with the link → Viewer", or the
 * site renders nothing:
 *   • the Sheet itself, otherwise the Sheets API replies 403 and this returns []
 *   • every Drive video, otherwise its embed and poster show "no access" to visitors
 *
 * SHEET LAYOUT — tab `Sheet1`, headers in row 1, data from row 2:
 *   A Section | B Title | C Description | D VideoLink
 * VideoLink is a Drive share link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *
 * If the tab is ever renamed, change SHEET_TAB below — it is the only place the
 * name appears.
 */

const SHEET_TAB = "Sheet1";
const RANGE = `${SHEET_TAB}!A2:D`;

/** Cache tag the /api/revalidate webhook invalidates when the sheet changes. */
export const PROJECTS_TAG = "projects";

export type Project = {
  section: string;
  title: string;
  description: string;
  /** null when the Drive link is missing or malformed. */
  fileId: string | null;
};

export type ProjectSection = {
  name: string;
  projects: Project[];
};

/** Pulls FILE_ID out of a Drive share link. */
export function driveFileId(link: string): string | null {
  const match = /\/d\/([^/]+)/.exec(link);
  return match ? match[1] : null;
}

export async function getProjects(): Promise<Project[]> {
  const sheetId = process.env.SHEET_ID;
  const apiKey = process.env.SHEETS_API_KEY;

  // Missing config returns empty rather than throwing, so a fresh clone without
  // an .env still builds and renders. Only *runtime* failures throw (see below).
  if (!sheetId || !apiKey) {
    console.warn("SHEET_ID or SHEETS_API_KEY is missing — no projects loaded.");
    return [];
  }

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}` +
    `/values/${encodeURIComponent(RANGE)}?key=${apiKey}`;

  // Tagged so the Apps Script webhook (/api/revalidate) can invalidate this on
  // demand the moment the sheet is edited. The 60s window is the fallback for
  // when the webhook does not arrive.
  const res = await fetch(url, {
    next: { revalidate: 60, tags: [PROJECTS_TAG] },
  });

  /*
   * Failures throw rather than returning [] — deliberately.
   *
   * This runs during ISR regeneration. If it throws, Next keeps serving the last
   * successfully rendered page and retries on the next pass, so a transient
   * Google hiccup is invisible to visitors. Returning [] instead would render an
   * empty Work section *successfully*, and that emptiness would then be cached
   * for the whole revalidate window.
   *
   * A 403 here almost always means the Sheet is not shared publicly.
   */
  if (!res.ok) {
    throw new Error(`Sheets API responded ${res.status}`);
  }

  const data = (await res.json()) as { values?: string[][] };

  // No rows is a real answer, not a failure: an empty sheet should render the
  // empty state rather than hold the previous contents forever.
  return (data.values ?? [])
    .map((row) => ({
      section: (row[0] ?? "").trim() || "Other",
      title: (row[1] ?? "").trim(),
      description: (row[2] ?? "").trim(),
      fileId: driveFileId((row[3] ?? "").trim()),
    }))
    .filter((project) => project.title || project.fileId);
}

/*
 * Numeric-aware and case-insensitive, so "2" sorts before "10" instead of after
 * it, and "ugc" sits with "UGC". Digits sort ahead of letters, so numbered
 * sections always lead.
 */
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

/**
 * An ordering prefix: "1." / "2)" / "10 - ". Stripped from the heading so the
 * sheet can control order without the number showing on the site.
 *
 * The separator is required, which is what keeps "3D Animation" intact — there
 * is no `.`, `)` or `-` after its 3.
 */
const ORDER_PREFIX = /^\s*\d+\s*[.)\-–]\s*/;

/**
 * Builds the Work carousels from column A: one section per distinct Section
 * value, sorted numerically then alphabetically.
 *
 * To force a specific order, prefix the section in the sheet — "1. Video
 * Editing", "2. UGC & Ads". The prefix drives the sort and is hidden in the
 * heading. Sections without a prefix fall alphabetically after the numbered
 * ones.
 *
 * Grouping ignores case; the spelling used the first time a section appears
 * becomes its heading.
 */
export function groupBySection(projects: Project[]): ProjectSection[] {
  const grouped = new Map<string, ProjectSection & { sortKey: string }>();

  for (const project of projects) {
    const key = project.section.toLowerCase();
    const existing = grouped.get(key);
    if (existing) {
      existing.projects.push(project);
    } else {
      grouped.set(key, {
        name: project.section.replace(ORDER_PREFIX, "").trim() || project.section,
        sortKey: project.section,
        projects: [project],
      });
    }
  }

  return [...grouped.values()]
    .sort((a, b) => collator.compare(a.sortKey, b.sortKey))
    .map(({ name, projects: sectionProjects }) => ({
      name,
      projects: sectionProjects,
    }));
}
