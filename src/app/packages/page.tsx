"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { Button } from "@/components/ui/button";
import { PillFilterBar } from "@/components/ui/pill-filter-bar";
import { PackageCard } from "@/components/cards/package-card";
import { CustomPackageCta } from "@/components/packages/custom-package-cta";
import { getPackages } from "@/lib/pikinic-api";
import type { Package, PackageCategory } from "@/lib/data/packages";

const ALL_CATEGORIES = "All";
const CATEGORY_FILTERS = [
  ALL_CATEGORIES,
  "Domestic",
  "International",
  "Beach",
  "City Break",
  "Family",
  "Business",
] as const;

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[] | null>(null);
  const [category, setCategory] = useState<PackageCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  const results = useMemo(() => {
    const list = packages ?? [];
    if (category === ALL_CATEGORIES) return list;
    return list.filter((pkg) => pkg.categories.includes(category));
  }, [category, packages]);

  return (
    <>
      <section className="relative isolate overflow-hidden text-text-primary">
        <Container className="relative flex flex-col items-center pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <PathwayMark className="float-slow pointer-events-none absolute left-1/2 top-0 z-0 h-[520px] w-[520px] -translate-x-1/2 text-green-600/[0.08]" />
          <h1 className="relative z-10 w-full max-w-none text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
            Trips Built <span className="text-green-700">Around You.</span>
          </h1>
          <p className="relative z-10 mt-6 max-w-2xl text-base text-text-secondary sm:text-lg">
            Browse our curated travel packages — from weekend getaways to full international
            holidays. Every package is priced transparently and can be customised.
          </p>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <PillFilterBar options={CATEGORY_FILTERS} value={category} onChange={setCategory} />

          {packages === null ? (
            <div className="mt-10 rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center text-text-secondary">
              Loading…
            </div>
          ) : results.length === 0 ? (
            <div className="mt-10 rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center">
              <p className="text-text-secondary">
                We don&rsquo;t have a matching package right now, but we can build one for you.
                Tell us where you want to go and we&rsquo;ll put something together.
              </p>
              <Button
                href="#request-custom-package"
                variant="secondary"
                size="md"
                className="mt-6"
              >
                Request a Custom Package
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <div id="request-custom-package">
        <CustomPackageCta />
      </div>
    </>
  );
}
