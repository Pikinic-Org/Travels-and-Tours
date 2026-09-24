import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog";
import { formatBlogDate } from "@/lib/data/blog";
import { cn } from "@/lib/utils";
import { BrandPattern } from "@/components/ui/brand-pattern";

// Route-agnostic: used on the /blogs listing today, reusable wherever else
// a post teaser is needed (e.g. a future "related posts" block).
export function BlogPostCard({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border-primary bg-surface-primary transition-colors hover:bg-neutral-900/[0.02]",
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border-primary">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 bg-green-900">
            <BrandPattern />
          </div>
        )}
        <span className="absolute bottom-3 left-4 rounded-md bg-neutral-0/90 px-2 py-1 text-[10px] font-semibold text-green-800">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-text-primary">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{post.excerpt}</p>
        <p className="mt-4 text-sm text-text-tertiary">
          {post.author} · {formatBlogDate(post.publishedAt)} · {post.readTime}
        </p>
      </div>
    </Link>
  );
}
