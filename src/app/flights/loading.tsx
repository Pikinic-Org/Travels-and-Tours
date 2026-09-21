import { Container } from "@/components/ui/container";

export default function FlightsLoading() {
  return (
    <section className="py-32 md:py-40">
      <Container className="flex flex-col items-center gap-4 text-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-border-primary border-t-green-700" />
        <div>
          <p className="text-lg font-bold uppercase tracking-tight text-text-primary">Searching Flights…</p>
          <p className="mt-1 text-sm text-text-secondary">Checking fares across our partner airlines.</p>
        </div>
      </Container>
    </section>
  );
}
