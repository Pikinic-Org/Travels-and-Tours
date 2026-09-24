import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { CommentsSection } from "@/components/blog/comments-section";
import { formatBlogDate } from "@/lib/data/blog";
import { getBlogPostBySlug, getBlogPosts } from "@/server/modules/content/content.service";
import { BrandPattern } from "@/components/ui/brand-pattern";

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blogs/[slug]">) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage(props: PageProps<"/blogs/[slug]">) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <section className="py-16 md:py-24">
      <Container className="mx-auto max-w-4xl">
        <Link
          href="/blogs"
          className="text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
        >
          ← All Posts
        </Link>

        <div className="mt-6 border-b border-border-primary pb-8">
          <span className="text-sm font-semibold text-green-700">
            {post.category}
          </span>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-text-tertiary">
            {post.author} · {formatBlogDate(post.publishedAt)} · {post.readTime}
          </p>
        </div>

        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          {post.imageUrl ? (
            <Image src={post.imageUrl} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-green-900">
            <BrandPattern />
          </div>
          )}
        </div>

        <div className="mt-10 space-y-5">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-text-secondary">
              {paragraph}
            </p>
          ))}
        </div>

        <CommentsSection slug={post.slug} />
      </Container>
    </section>
  );
}
