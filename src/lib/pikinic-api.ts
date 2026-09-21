import type { FlightOffer } from "@/lib/data/flights";
import type { Package } from "@/lib/data/packages";
import type { BlogPost } from "@/lib/data/blog";

const BASE_URL = process.env.PIKINIC_API_URL ?? "http://localhost:3000";

// pikinic-site's blog posts store rich content blocks (headings, paragraphs,
// images) for the admin editor. This site's blog pages only render flat
// paragraphs today, so text blocks are flattened to strings and image
// blocks are dropped — richer rendering can be added later if needed.
type RemoteBlogContentBlock =
  | { id: string; type: "h1" | "h2" | "h3" | "paragraph"; text: string }
  | { id: string; type: "image"; url: string; caption?: string };

type RemoteBlogPost = Omit<BlogPost, "content"> & { content: RemoteBlogContentBlock[] };

function flattenBlogContent(blocks: RemoteBlogContentBlock[]): string[] {
  return blocks.filter((block) => block.type !== "image").map((block) => (block as { text: string }).text);
}

function toBlogPost(post: RemoteBlogPost): BlogPost {
  return { ...post, content: flattenBlogContent(post.content) };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Request to ${path} failed with status ${res.status}`);
  return res.json();
}

// Flights/payment data is never cached — prices and availability are only
// ever valid for a few minutes, unlike blog/package content above.
async function post<T>(path: string, body: unknown): Promise<T> {
  const proxySecret = process.env.FLIGHTS_PROXY_SECRET;
  if (!proxySecret) throw new Error("Missing environment variable: FLIGHTS_PROXY_SECRET");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-flights-proxy-secret": proxySecret,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request to ${path} failed with status ${res.status}`);
  return data;
}

export async function getFlightOffers(): Promise<FlightOffer[]> {
  return get<FlightOffer[]>("/api/flights");
}

export async function getPackages(): Promise<Package[]> {
  return get<Package[]>("/api/packages");
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  try {
    return await get<Package>(`/api/packages/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await get<RemoteBlogPost[]>("/api/blog");
  return posts.map(toBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await get<RemoteBlogPost>(`/api/blog/${encodeURIComponent(slug)}`);
    return toBlogPost(post);
  } catch {
    return null;
  }
}

type PassengerCounts = { adults: number; children?: number; infants?: number };
type CabinClass = "economy" | "premium_economy" | "business" | "first";

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
};

export async function searchFlights(params: FlightSearchParams) {
  return post<{ meta: Record<string, unknown>; flights: FlightSearchResult[] }>("/api/skylink/search", params);
}

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

export async function priceFlight(params: FlightPricingParams) {
  return post<FlightPricingResult>("/api/skylink/price", params);
}

export type InitiatePaymentParams = {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentReference: string;
  redirectUrl: string;
  currencyCode?: string;
};

export type InitiatePaymentResult = {
  transactionReference: string;
  paymentReference: string;
  checkoutUrl: string;
};

export async function initiatePayment(params: InitiatePaymentParams) {
  return post<InitiatePaymentResult>("/api/monnify/initiate", params);
}

type TravellerDetails = {
  title: "Mr" | "Mrs" | "Ms" | "Miss" | "Dr" | "Prof";
  first_name: string;
  last_name: string;
  other_name?: string;
  country_code: string;
  dob: string;
  gender: "male" | "female";
  passport_number: string;
  passport_expiry: string;
  passport_issue_date: string;
  nationality: string;
};

export type StartCheckoutParams = {
  tripType: "oneway" | "roundtrip" | "multicity";
  fromCode: string;
  toCode: string;
  departureDate: string;
  returnDate?: string;
  bookingToken: string;
  verifiedPrice: number;
  customerPrice: number;
  currency: string;
  passengers: PassengerCounts;
  travellers: {
    primary_guest: TravellerDetails & { email: string; phone: string };
    travelers: Record<string, TravellerDetails & { email?: string; phone?: string }>;
  };
  redirectUrl: string;
};

export type StartCheckoutResult = {
  bookingId: string;
  checkoutUrl: string;
};

export async function startCheckout(params: StartCheckoutParams) {
  return post<StartCheckoutResult>("/api/bookings", params);
}

export type FlightBooking = {
  id: string;
  status: "pending_payment" | "paid" | "reserved" | "failed";
  tripType: string;
  fromCode: string;
  toCode: string;
  departureDate: string;
  returnDate: string | null;
  bookingToken: string;
  verifiedPrice: number;
  customerPrice: number;
  currency: string;
  pnr: string | null;
  bookingReference: string | null;
  carrier: string | null;
  ticketDeadline: string | null;
  refundStatus: string | null;
};

async function getAuthenticated<T>(path: string): Promise<T> {
  const proxySecret = process.env.FLIGHTS_PROXY_SECRET;
  if (!proxySecret) throw new Error("Missing environment variable: FLIGHTS_PROXY_SECRET");

  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    headers: { "x-flights-proxy-secret": proxySecret },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request to ${path} failed with status ${res.status}`);
  return data;
}

export async function getBooking(bookingId: string) {
  return getAuthenticated<FlightBooking>(`/api/bookings/${encodeURIComponent(bookingId)}`);
}

// Manually triggers the payment-check-then-reserve step — used as a
// belt-and-braces call when the customer's browser returns from Monnify's
// checkout, in case the webhook hasn't landed yet (or can't reach us, e.g.
// local dev without a public tunnel).
export async function confirmBooking(bookingId: string) {
  return post<FlightBooking>(`/api/bookings/${encodeURIComponent(bookingId)}/confirm`, {});
}
