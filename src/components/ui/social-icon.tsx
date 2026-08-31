import type { ReactNode } from "react";

type IconKey = "instagram" | "x" | "tiktok" | "linkedin";

const paths: Record<IconKey, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  x: (
    <>
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
    </>
  ),
  tiktok: <path d="M14 3v10.5a3.5 3.5 0 1 1-3-3.46M14 3a5 5 0 0 0 5 5" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7" r="0.2" fill="currentColor" stroke="currentColor" />
      <path d="M11.5 16.5V12a2.5 2.5 0 0 1 5 0v4.5" />
      <line x1="11.5" y1="10" x2="11.5" y2="16.5" />
    </>
  ),
};

export function SocialIcon({ icon, className }: { icon: IconKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[icon]}
    </svg>
  );
}
