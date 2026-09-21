import { LiveFlightResults } from "@/components/flights/live-flight-results";
import { searchFlights } from "@/server/modules/flights/flights.service";
import type { FlightSearchParams, FlightSearchResult } from "@/types";

// Runs the flight search on the server. The /flights page renders this inside
// a Suspense boundary, so the search bar shows straight away and the results
// stream in when SkyLink answers.
export const FlightResultsSection = async ({ params }: { params: FlightSearchParams }) => {
  let flights: FlightSearchResult[] | null = null;

  try {
    flights = (await searchFlights(params)).flights;
  } catch (error) {
    console.error("[flights] live search failed:", error);
  }

  if (flights === null) {
    return (
      <div className="rounded-[2px] border border-border-primary bg-surface-primary p-10 text-center text-text-secondary">
        Something went wrong searching those flights. Try again in a moment.
      </div>
    );
  }

  return <LiveFlightResults results={flights} searchParams={params} />;
};
