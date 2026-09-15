"use client";

import { useMemo, useState } from "react";
import { PillFilterBar } from "@/components/ui/pill-filter-bar";
import { BlogPostCard } from "@/components/cards/blog-post-card";
import type { BlogCategory, BlogPost } from "@/lib/data/blog";

const ALL_CATEGORIES = "All";
const CATEGORY_FILTERS = [
  ALL_CATEGORIES,
  "Travel Tips",
  "Visa & Documentation",
  "Money & Fares",
  "Destination Guides",
] as const;

export function BlogsResults({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<BlogCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);

  const results = useMemo(() => {
    if (category === ALL_CATEGORIES) return posts;
    return posts.filter((post) => post.category === category);
  }, [category, posts]);

  return (
    <>
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
    </>
  );
}
