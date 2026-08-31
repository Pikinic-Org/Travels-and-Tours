"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { PillFilterBar } from "@/components/ui/pill-filter-bar";
import { BlogPostCard } from "@/components/cards/blog-post-card";
import { Cta } from "@/components/sections/cta";
import { blogPosts, type BlogCategory } from "@/lib/data/blog";

const ALL_CATEGORIES = "All";
const CATEGORY_FILTERS = [
  ALL_CATEGORIES,
  "Travel Tips",
  "Visa & Documentation",
  "Money & Fares",
  "Destination Guides",
] as const;

export default function BlogsPage() {
  const [category, setCategory] = useState<BlogCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);

  const results = useMemo(() => {
    if (category === ALL_CATEGORIES) return blogPosts;
    return blogPosts.filter((post) => post.category === category);
  }, [category]);

  return (
    <>
      <section className="relative isolate overflow-hidden text-text-primary">
        <Container className="relative flex flex-col items-center pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <PathwayMark className="float-slow pointer-events-none absolute left-1/2 top-0 z-0 h-[520px] w-[520px] -translate-x-1/2 text-green-600/[0.08]" />
          <h1 className="relative z-10 w-full max-w-none text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
            Travel Tips, <span className="text-green-700">Sorted.</span>
          </h1>
          <p className="relative z-10 mt-6 max-w-2xl text-base text-text-secondary sm:text-lg">
            Practical advice on documents, fares, and getting the most out of every trip — written
            by the Pikinic team.
          </p>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <PillFilterBar options={CATEGORY_FILTERS} value={category} onChange={setCategory} />

          {results.length === 0 ? (
            <div className="mt-10 rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center text-text-secondary">
              No posts in this category yet — check back soon.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <Cta />
    </>
  );
}
