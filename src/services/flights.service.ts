import { postJson } from "@/services/http";
import type {
  FlightPricingParams,
  FlightPricingResult,
  FlightSearchParams,
  FlightSearchResponse,
} from "@/types";

export const searchFlights = (params: FlightSearchParams) =>
  postJson<FlightSearchResponse>("/api/skylink/search", params);

export const priceFlight = (params: FlightPricingParams) =>
  postJson<FlightPricingResult>("/api/skylink/price", params);
