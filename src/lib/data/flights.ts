// Sample content — see packages.ts for the same disclaimer. `id` is stable
// now so a future /flights listing can key off it without reshaping this.
export type FlightOffer = {
  id: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  price: number;
  tripType: string;
  stops: number;
};

export const flightOffers: FlightOffer[] = [
  { id: "los-dxb", from: "Lagos", fromCode: "LOS", to: "Dubai", toCode: "DXB", price: 780000, tripType: "Round trip", stops: 0 },
  { id: "los-lhr", from: "Lagos", fromCode: "LOS", to: "London", toCode: "LHR", price: 1250000, tripType: "Round trip", stops: 1 },
  { id: "abv-acc", from: "Abuja", fromCode: "ABV", to: "Accra", toCode: "ACC", price: 310000, tripType: "Round trip", stops: 0 },
  { id: "los-jnb", from: "Lagos", fromCode: "LOS", to: "Johannesburg", toCode: "JNB", price: 640000, tripType: "Round trip", stops: 1 },
  { id: "los-acc", from: "Lagos", fromCode: "LOS", to: "Accra", toCode: "ACC", price: 290000, tripType: "Round trip", stops: 0 },
  { id: "abv-dxb", from: "Abuja", fromCode: "ABV", to: "Dubai", toCode: "DXB", price: 810000, tripType: "Round trip", stops: 1 },
];

export function flightOfferToCartItem(offer: FlightOffer) {
  return {
    id: `flight-${offer.id}`,
    type: "flight" as const,
    title: `${offer.fromCode} → ${offer.toCode}`,
    subtitle: `${offer.from} to ${offer.to} · ${offer.tripType}`,
    price: offer.price,
  };
}
