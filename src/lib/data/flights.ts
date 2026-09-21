// Flight offer data now comes from pikinic-site's admin-managed API —
// see @/services/content.service. This file only keeps the shared type and the pure
// cart-item mapper, since those are used regardless of data source.
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

export function flightOfferToCartItem(offer: FlightOffer) {
  return {
    id: `flight-${offer.id}`,
    type: "flight" as const,
    title: `${offer.fromCode} → ${offer.toCode}`,
    subtitle: `${offer.from} to ${offer.to} · ${offer.tripType}`,
    price: offer.price,
  };
}
