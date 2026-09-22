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

// Horizontal-scroll nav — the "swipe for more" arrows on the price grid.
export const ChevronLeftIcon = ({ className }: IconProps) => (
  <svg {...iconProps} strokeWidth={2} className={className}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ className }: IconProps) => (
  <svg {...iconProps} strokeWidth={2} className={className}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const SearchGlassIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const CalendarIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

// A single person — traveller card headers ("Lead Traveller", "Adult 2" …).
export const UserIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
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

// Checked-bag icon — also used as the filter sidebar's "Baggage & fare" header.
export const BagIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <rect x="5" y="8" width="14" height="13" rx="2" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const CabinBagIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <rect x="7" y="9" width="10" height="11" rx="2" />
    <path d="M10 9V7a2 2 0 0 1 4 0v2" />
  </svg>
);

export const RefundIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
  </svg>
);

// A route with one stop along it — the filter sidebar's "Stops" header.
export const RouteIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <circle cx="5" cy="6" r="2" />
    <circle cx="19" cy="18" r="2" />
    <path d="M5 8v3a3 3 0 0 0 3 3h3a3 3 0 0 1 3 3v1" />
  </svg>
);

// A clock — "Departure time" section.
export const ClockIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

// A price tag — "Price" section.
export const TagIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <path d="M12.6 2.6 21 11l-9 9-8.4-8.4A2 2 0 0 1 3 10.2V4a1 1 0 0 1 1-1h6.2a2 2 0 0 1 1.4.6Z" />
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

// A ticket/flight-number lookup — "Flight number" section.
export const TicketIcon = ({ className }: IconProps) => (
  <svg {...iconProps} className={className}>
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
    <path d="M10 6v12" strokeDasharray="2 2" />
  </svg>
);
