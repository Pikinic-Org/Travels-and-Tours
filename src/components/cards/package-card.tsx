import Image from "next/image";
import { type Package } from "@/lib/data/packages";
import { packageEnquiryHref, packagePhotos } from "@/lib/constants";
import { cn, formatNaira } from "@/lib/utils";
import { DeepGreenBackdrop } from "@/components/ui/brand-pattern";

// Route-agnostic: used on the homepage packages rail and the /packages listing page.
//
// The whole card opens a WhatsApp enquiry about the package on 0806 579 4790, in a new tab so the
// visitor keeps the site (user, 2026-11-06; it used to add the package to the cart).
//
// Photo: the first one uploaded for the package in the admin (pkg.imageUrls), otherwise a photo
// of the destination from packagePhotos, otherwise the brand pattern on deep green.
type PackageWithImages = Package & { imageUrls?: string[] };

export function PackageCard({ pkg, className }: { pkg: PackageWithImages; className?: string }) {
  const uploaded = pkg.imageUrls?.find(Boolean);
  const photo = uploaded
    ? { src: uploaded, alt: `${pkg.name}, ${pkg.destination}` }
    : packagePhotos[pkg.destination.trim().toLowerCase()];

  return (
    <a
      href={packageEnquiryHref(pkg)}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Make an enquiry on WhatsApp about ${pkg.name}, ${pkg.duration}, from ${formatNaira(pkg.priceFrom)}`}
      className={cn(
        "group relative isolate flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-2xl",
        className
      )}
    >
      {photo ? (
        <>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 80vw"
            className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Dark gradient rising from the bottom, as on the deep-green cards, so the text stays legible. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/90 via-neutral-900/25 to-transparent" />
        </>
      ) : (
        <DeepGreenBackdrop className="transition-transform duration-700 ease-out group-hover:scale-105" />
      )}

      <span className="absolute left-4 top-4 rounded-md border border-neutral-0/20 bg-neutral-0/15 px-2 py-1 text-[10px] font-semibold text-neutral-0 backdrop-blur-sm">
        {pkg.duration}
      </span>

      <div className="relative p-5">
        <p className="text-sm font-semibold text-neutral-0/70">{pkg.country}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-neutral-0">{pkg.name}</h3>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] text-neutral-0/70">From</p>
            <p className="text-xl font-bold text-neutral-0">{formatNaira(pkg.priceFrom)}</p>
          </div>
          <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-neutral-0/40 px-3 text-sm font-medium text-neutral-0 transition-colors group-hover:bg-neutral-0/10">
            Make an enquiry
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              fill="none"
              className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:scale-125"
            >
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
