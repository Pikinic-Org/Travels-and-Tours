export type TripType = "oneway" | "roundtrip" | "multicity";
export type CabinClass = "economy" | "premium_economy" | "business" | "first";

// What the search API accepts: only adults is required.
export type PassengerCounts = { adults: number; children?: number; infants?: number };

// What the UI and checkout carry around once a search is done: every count present.
export type PassengerBreakdown = { adults: number; children: number; infants: number };

export type FlightSearchParams =
  | {
      search_mode: "local" | "external";
      flight_type: "oneway";
      from: string;
      to: string;
      flights_departure_date: string;
      class?: CabinClass;
      currency?: string;
    } & PassengerCounts
  | {
      search_mode: "local" | "external";
      flight_type: "roundtrip";
      from: string;
      to: string;
      flights_departure_date: string;
      flights_return_date: string;
      class?: CabinClass;
      currency?: string;
    } & PassengerCounts
  | {
      search_mode: "local" | "external";
      flight_type: "multicity";
      routes: { from: string; to: string; date: string }[];
      class?: CabinClass;
      currency?: string;
    } & PassengerCounts;

export type FlightAmenity = {
  type: string;
  description: string;
  chargeable: boolean;
};

export type FlightBaggageAllowance = {
  checked?: string;
  cabin?: string;
  varies_by_segment?: boolean;
};

// Each flight's `segments` is an array of legs (relevant for multi-city),
// each leg an array of segments (a leg with more than one segment is a
// connection, not a separate flight — e.g. LOS→QUO→ABV is one leg, two
// segments, one stop).
export type FlightSegment = {
  img: string; // 2-letter carrier code, e.g. "QI" — used to look up a logo, not a logo itself
  flight_no: string;
  airline: string;
  class: string;
  departure_code: string;
  arrival_code: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  duration_time: string;
  seats_left: number;
  // Optional detail SkyLink returns for most fares; every field is treated
  // as possibly missing because suppliers don't all supply everything.
  departure_airport?: string;
  arrival_airport?: string;
  departure_date?: string; // dd-mm-yyyy
  arrival_date?: string; // dd-mm-yyyy
  departure_terminal?: string;
  arrival_terminal?: string;
  seg_duration?: string; // this segment only, e.g. "2h 15m"
  total_duration?: string; // the whole leg, connections included
  baggage?: string; // checked bags, e.g. "1 PC" or "23 KG"
  cabin_baggage?: string;
  branded_fare?: string;
  equipment?: string; // aircraft code, e.g. "73H"
  refundable?: number | boolean;
  amenities?: FlightAmenity[];
};

export type FlightDealInfo = {
  discountPercent: number;
  label?: string | null;
};

export type FlightSearchResult = {
  segments: FlightSegment[][];
  price: number;
  currency: string;
  seats_left: number;
  route_type: string;
  booking_token: string;
  deal?: FlightDealInfo;
  baggage_allowance?: FlightBaggageAllowance;
  amenities?: FlightAmenity[];
  fare_types?: string[];
};

export type FlightSearchResponse = {
  meta: Record<string, unknown>;
  flights: FlightSearchResult[];
};

export type FlightPricingParams = {
  booking_token: string;
  passengers: PassengerCounts;
  class?: CabinClass;
  currency?: string;
};

export type FlightPricingResult = {
  booking_token: string;
  original_price: number;
  verified_price: number;
  customer_price: number;
  currency: string;
  expires_at: string;
  deal?: FlightDealInfo | null;
};

// The single flight a visitor picked on /flights, carried through to checkout.
export type SelectedFlight = {
  flight: FlightSearchResult;
  tripType: TripType;
  fromCode: string;
  toCode: string;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerBreakdown;
};
