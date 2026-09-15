"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PillFilterBar } from "@/components/ui/pill-filter-bar";
import { PackageCard } from "@/components/cards/package-card";
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

export function PackagesResults({ packages }: { packages: Package[] }) {
  const [category, setCategory] = useState<PackageCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);

  const results = useMemo(() => {
    if (category === ALL_CATEGORIES) return packages;
    return packages.filter((pkg) => pkg.categories.includes(category));
  }, [category, packages]);

  return (
    <>
      <PillFilterBar options={CATEGORY_FILTERS} value={category} onChange={setCategory} />

      {results.length === 0 ? (
        <div className="mt-10 rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center">
          <p className="text-text-secondary">
            We don&rsquo;t have a matching package right now, but we can build one for you. Tell us
            where you want to go and we&rsquo;ll put something together.
          </p>
          <Button href="#request-custom-package" variant="secondary" size="md" className="mt-6">
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
    </>
  );
}
