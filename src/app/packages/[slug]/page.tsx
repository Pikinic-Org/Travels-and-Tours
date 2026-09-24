import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { BookPackageButton } from "@/components/packages/book-package-button";
import { getPackageBySlug, getPackages } from "@/server/modules/content/content.service";
import { formatNaira } from "@/lib/utils";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata(props: PageProps<"/packages/[slug]">) {
  const { slug } = await props.params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};
  return { title: pkg.name, description: pkg.headline };
}

export default async function PackageDetailPage(props: PageProps<"/packages/[slug]">) {
  const { slug } = await props.params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Link
          href="/packages"
          className="text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
        >
          ← All Packages
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-8 border-b border-border-primary pb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-text-tertiary">
              {pkg.destination}, {pkg.country}
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              {pkg.name}
            </h1>
            <p className="mt-4 text-lg text-text-secondary">{pkg.headline}</p>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-border-primary bg-surface-primary p-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-6">
                <span className="text-text-tertiary">Duration</span>
                <span className="font-semibold text-text-primary">{pkg.duration}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-text-tertiary">Price from</span>
                <span className="text-lg font-bold text-green-700">
                  {formatNaira(pkg.priceFrom)} <span className="text-sm font-semibold text-text-secondary">/ person</span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-text-tertiary">Availability</span>
                <span className="font-semibold text-text-primary">{pkg.availability}</span>
              </div>
            </div>
            <BookPackageButton pkg={pkg} className="mt-6 w-full justify-center" />
          </div>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="space-y-4">
              {pkg.description.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>

            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                  Itinerary
                </h2>
                <div className="mt-4 divide-y divide-border-primary border-y border-border-primary">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="flex gap-5 py-4">
                      <span className="w-14 shrink-0 text-sm font-bold text-green-700">
                        Day {day.day}
                      </span>
                      <div>
                        <p className="font-semibold text-text-primary">{day.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-text-tertiary">
                What&rsquo;s Included
              </h2>
              <ul className="mt-3 space-y-2">
                {pkg.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-text-tertiary">
                What&rsquo;s Not Included
              </h2>
              <ul className="mt-3 space-y-2">
                {pkg.excluded.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <MinusIcon className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
