import { Container } from "@/components/ui/container";
import { Cta } from "@/components/sections/cta";
import { BlogsResults } from "@/components/blog/blogs-results";
import { getBlogPosts } from "@/server/modules/content/content.service";

export default async function BlogsPage() {
  const blogPosts = await getBlogPosts();

  return (
    <>
      <section className="relative isolate overflow-hidden text-text-primary">
        <Container className="relative flex flex-col items-center pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <h1 className="relative z-10 w-full max-w-none text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
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
          <BlogsResults posts={blogPosts} />
        </Container>
      </section>

      <Cta />
    </>
  );
}
