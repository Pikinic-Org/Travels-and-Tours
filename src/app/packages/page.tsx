import { Container } from "@/components/ui/container";
import { PathwayMark } from "@/components/ui/pathway-mark";
import { CustomPackageCta } from "@/components/packages/custom-package-cta";
import { PackagesResults } from "@/components/packages/packages-results";
import { getPackages } from "@/lib/pikinic-api";

export default async function PackagesPage() {
  const packages = await getPackages();

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
          <PackagesResults packages={packages} />
        </Container>
      </section>

      <div id="request-custom-package">
        <CustomPackageCta />
      </div>
    </>
  );
}
