/**
 * Hand-drawn 24×24 stroke icons from the design hand-off.
 * `currentColor` throughout, so colour is controlled by the parent.
 */
type IconProps = {
  size?: number;
  strokeWidth?: number;
};

function Svg({
  size = 20,
  strokeWidth = 1.7,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function ChevronRight({ size = 14, strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  );
}

export function ChevronLeft({ size = 16, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth}>
      <path d="m15 6-6 6 6 6" />
    </Svg>
  );
}

export function Lock(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="10" width="16" height="10" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v2" />
    </Svg>
  );
}

export function Menu({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function Close({ size = 18, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  );
}

export function Montage(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 6h9v12H4z" />
      <path d="m20 8-5 4 5 4z" />
    </Svg>
  );
}

export function Convert(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 12a9 9 0 1 0 9-9" />
      <path d="M12 12l5-3" />
    </Svg>
  );
}

export function Cube(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12v9M12 12 4 7.5" />
    </Svg>
  );
}

export function Clapperboard(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7h18v12H3z" />
      <path d="M7 7 5 3M12 7l-2-4M17 7l-2-4" />
    </Svg>
  );
}

export function Camera(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M8 6l1.2-2h5.6L16 6" />
    </Svg>
  );
}

export function Person(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Svg>
  );
}

export function Monitor(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 5h16v11H4z" />
      <path d="M9 20h6M12 16v4" />
      <path d="m11 9 3 1.5-3 1.5z" />
    </Svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="6" y="3" width="12" height="18" rx="3" />
      <path d="M10.5 18h3" />
    </Svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3 1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
      <path d="M17.5 16.5 18.5 19l2.5 1-2.5 1-1 2.5" />
    </Svg>
  );
}

export function Cut(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6v12M18 6v12" />
      <path d="M6 12h12" />
    </Svg>
  );
}

export function Speaker(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10v4h3l5 4V6L7 10z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
    </Svg>
  );
}

export function WhatsApp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21.5a9.5 9.5 0 1 0-8.28-4.86L2.5 21.5l4.9-1.19A9.46 9.46 0 0 0 12 21.5Z" />
      <path d="M9 8.6c.2-.05.4.02.5.2l.9 1.6c.1.2.07.44-.08.6l-.5.55c-.13.15-.16.36-.06.53.5.86 1.27 1.6 2.2 2.06.19.09.41.04.55-.11l.5-.55c.15-.16.38-.21.58-.12l1.7.76c.2.09.31.3.28.51-.12.9-.9 1.57-1.81 1.57-3.2 0-5.8-2.6-5.8-5.8 0-.9.63-1.68 1.52-1.83Z" />
    </Svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.5" />
      <path d="m3.5 7.5 7.35 5.2a2 2 0 0 0 2.3 0L20.5 7.5" />
    </Svg>
  );
}

export function Instagram(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}
