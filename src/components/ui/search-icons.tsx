// Small line icons for the flight search bar. All inherit color and size from
// the classes they're given (stroke="currentColor").

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

type IconProps = { className?: string };

// Points up and to the right (departing). Rotate it for arrivals.
export const PlaneIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);

// Two opposite arrows — trip direction (round trip / one way / multi-city).
export const TripTypeIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <path d="M7 8h13M17 4l3 4-3 4" />
    <path d="M17 16H4M7 20l-3-4 3-4" />
  </svg>
);

export const SeatIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" />
    <path d="M3 13a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3z" />
    <path d="M6 16v3M18 16v3" />
  </svg>
);

export const CalendarIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

export const UsersIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
