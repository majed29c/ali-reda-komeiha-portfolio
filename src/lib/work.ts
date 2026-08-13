export type WorkVideo = {
  title: string;
  description: string;
  thumb: string;
  duration: string;
};

export type WorkSection = {
  name: string;
  videos: WorkVideo[];
};

/** Used until `WORK_SHEET_CSV_URL` is set, and whenever the sheet fails to load. */
const FALLBACK_SECTIONS: WorkSection[] = [
  {
    name: "Montage & Cinematic",
    videos: [
      {
        title: "Brand Film — Coastline",
        description: "Cinematic montage cut from a two-day shoot, graded in Resolve.",
        thumb: "",
        duration: "1:40",
      },
      {
        title: "Event Recap",
        description: "Fast montage of a launch night, edited to a single music bed.",
        thumb: "",
        duration: "1:05",
      },
      {
        title: "Photo & Motion Set",
        description: "Stills and moving frames delivered as one campaign package.",
        thumb: "",
        duration: "0:50",
      },
      {
        title: "Restaurant Opening",
        description: "Food and atmosphere montage for a launch campaign.",
        thumb: "",
        duration: "1:12",
      },
      {
        title: "Travel Reel",
        description: "Handheld footage cut into a rhythm-led travel piece.",
        thumb: "",
        duration: "0:58",
      },
      {
        title: "Studio Session",
        description: "Behind-the-scenes cinematic edit with natural sound.",
        thumb: "",
        duration: "2:05",
      },
    ],
  },
  {
    name: "UGC & Ads",
    videos: [
      {
        title: "Skincare UGC Ad",
        description: "Creator-style ad with captions, hooks and platform-native pacing.",
        thumb: "",
        duration: "0:32",
      },
      {
        title: "VSL — Coaching Offer",
        description: "Long-form sales letter structured to hold attention to the CTA.",
        thumb: "",
        duration: "6:20",
      },
      {
        title: "Talking-Head Promo",
        description: "To-camera edit with b-roll inserts and clean dialogue mix.",
        thumb: "",
        duration: "1:15",
      },
      {
        title: "Supplement Meta Ad",
        description: "Three hook variants cut from one shoot for A/B testing.",
        thumb: "",
        duration: "0:28",
      },
      {
        title: "App Walkthrough",
        description: "Screen recording edit with captions and motion callouts.",
        thumb: "",
        duration: "0:46",
      },
      {
        title: "Founder Story",
        description: "Interview-led brand ad with archive footage inserts.",
        thumb: "",
        duration: "1:38",
      },
    ],
  },
  {
    name: "3D & Advanced Edits",
    videos: [
      {
        title: "3D Product Reveal",
        description: "Animated 3D sequence built for a paid social campaign.",
        thumb: "",
        duration: "0:25",
      },
      {
        title: "VFX Concept Spot",
        description: "Composited multi-layer edit with tracked graphics and effects.",
        thumb: "",
        duration: "0:45",
      },
      {
        title: "Kinetic Type Intro",
        description: "Typography-driven opener animated in After Effects.",
        thumb: "",
        duration: "0:18",
      },
    ],
  },
];

/** Minimal RFC 4180-ish parser: handles quoted fields and escaped quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [[]];
  let cur = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        cur += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      rows[rows.length - 1].push(cur);
      cur = "";
    } else if (c === "\n") {
      rows[rows.length - 1].push(cur);
      cur = "";
      rows.push([]);
    } else if (c !== "\r") {
      cur += c;
    }
  }
  rows[rows.length - 1].push(cur);
  return rows;
}

/** Only http(s) thumbnails are kept — anything else is dropped for a placeholder. */
function safeThumb(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

export function sectionsFromCsv(csv: string): WorkSection[] | null {
  const rows = parseCsv(csv).filter((r) => r.some((c) => c.trim()));
  if (rows.length < 2) return null;

  const head = rows[0].map((h) => h.trim().toLowerCase());
  const iSection = head.indexOf("section");
  const iTitle = head.indexOf("title");
  const iDescription = head.indexOf("description");
  const iThumb = head.indexOf("thumbnail");
  const iDuration = head.indexOf("duration");

  if (iTitle === -1) return null;

  const grouped = new Map<string, WorkVideo[]>();
  for (const row of rows.slice(1)) {
    const title = (row[iTitle] ?? "").trim();
    if (!title) continue;

    const name = (iSection > -1 ? row[iSection] ?? "" : "").trim() || "Work";
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name)!.push({
      title,
      description: (iDescription > -1 ? row[iDescription] ?? "" : "").trim(),
      thumb: safeThumb((iThumb > -1 ? row[iThumb] ?? "" : "").trim()),
      duration: (iDuration > -1 ? row[iDuration] ?? "" : "").trim(),
    });
  }

  const sections = [...grouped.entries()].map(([name, videos]) => ({ name, videos }));
  return sections.length ? sections : null;
}

/**
 * Work data comes from a published Google Sheet CSV
 * (`Section, Title, Description, Thumbnail, Duration` headers, case-insensitive).
 * Fetched on the server and revalidated hourly; falls back to the example data
 * when `WORK_SHEET_CSV_URL` is unset or the sheet can't be read.
 */
export async function getWorkSections(): Promise<WorkSection[]> {
  const url = process.env.WORK_SHEET_CSV_URL;
  if (!url) return FALLBACK_SECTIONS;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Sheet responded ${res.status}`);
    return sectionsFromCsv(await res.text()) ?? FALLBACK_SECTIONS;
  } catch (error) {
    console.warn("Work sheet load failed, using fallback data.", error);
    return FALLBACK_SECTIONS;
  }
}
