import type {
  ContactFormState,
  PassengerBreakdown,
  PassengerSlot,
  SelectedFlight,
  FlightPricingResult,
  StartCheckoutParams,
  TravellerDetails,
  TravellerFormState,
  TravellerTitle,
} from "@/types";

export const travellerTitles: TravellerTitle[] = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"];

// Stored as digits only (no "+") — that's the shape the booking API receives.
export const countryCodes = [
  { code: "234", label: "Nigeria (+234)" },
  { code: "233", label: "Ghana (+233)" },
  { code: "44", label: "United Kingdom (+44)" },
  { code: "1", label: "United States / Canada (+1)" },
  { code: "971", label: "United Arab Emirates (+971)" },
  { code: "27", label: "South Africa (+27)" },
  { code: "254", label: "Kenya (+254)" },
  { code: "91", label: "India (+91)" },
  { code: "49", label: "Germany (+49)" },
  { code: "33", label: "France (+33)" },
];

export const emptyTraveller: TravellerFormState = {
  title: "Mr",
  first_name: "",
  last_name: "",
  other_name: "",
  country_code: "234",
  dob: "",
  gender: "male",
  passport_number: "",
  passport_expiry: "",
  passport_issue_date: "",
  nationality: "NG",
};

export const digitsOnly = (input: string): string => input.replace(/\D/g, "");

// Passport numbers are letters + digits only (max 9 characters on the
// machine-readable line), always written in capitals.
export const alphanumericUpper = (input: string): string => input.replace(/[^a-z0-9]/gi, "").toUpperCase();

// Same field set for every passenger type — SkyLink requires full passport
// details regardless of whether the traveller is an adult, child, or
// infant (confirmed against skylink.schema.ts's travellerFields, and
// matches how Wakanow's own checkout treats every passenger the same way).
export const buildPassengerSlots = (passengers: PassengerBreakdown): PassengerSlot[] => {
  const slots: PassengerSlot[] = [];
  for (let i = 0; i < passengers.adults; i++) {
    slots.push({ key: `adult_${i}`, label: i === 0 ? "Lead Traveller" : `Adult ${i + 1}` });
  }
  for (let i = 0; i < passengers.children; i++) {
    slots.push({ key: `child_${i}`, label: `Child ${i + 1}` });
  }
  for (let i = 0; i < passengers.infants; i++) {
    slots.push({ key: `infant_${i}`, label: `Infant ${i + 1}` });
  }
  return slots;
};

export const describePassengers = ({ adults, children, infants }: PassengerBreakdown): string => {
  const parts = [`${adults} Adult${adults !== 1 ? "s" : ""}`];
  if (children > 0) parts.push(`${children} Child${children !== 1 ? "ren" : ""}`);
  if (infants > 0) parts.push(`${infants} Infant${infants !== 1 ? "s" : ""}`);
  return parts.join(", ");
};

export const toTravellerData = (traveller: TravellerFormState): TravellerDetails => ({
  title: traveller.title as TravellerTitle,
  first_name: traveller.first_name,
  last_name: traveller.last_name,
  other_name: traveller.other_name || undefined,
  country_code: traveller.country_code,
  dob: traveller.dob,
  gender: traveller.gender as "male" | "female",
  passport_number: traveller.passport_number,
  passport_expiry: traveller.passport_expiry,
  passport_issue_date: traveller.passport_issue_date,
  nationality: traveller.nationality,
});

// Turns the filled-in form plus the confirmed price into the request the
// booking API expects. The lead traveller doubles as the booking contact.
export const buildCheckoutParams = ({
  selected,
  pricing,
  contact,
  slots,
  travellers,
  redirectUrl,
}: {
  selected: SelectedFlight;
  pricing: FlightPricingResult;
  contact: ContactFormState;
  slots: PassengerSlot[];
  travellers: Record<string, TravellerFormState>;
  redirectUrl: string;
}): StartCheckoutParams => {
  const leadKey = slots[0]?.key ?? "adult_0";

  const travelers: StartCheckoutParams["travellers"]["travelers"] = {};
  for (const slot of slots) {
    travelers[slot.key] = toTravellerData(travellers[slot.key] ?? emptyTraveller);
  }

  return {
    tripType: selected.tripType,
    fromCode: selected.fromCode,
    toCode: selected.toCode,
    departureDate: selected.departureDate,
    returnDate: selected.returnDate,
    bookingToken: pricing.booking_token,
    verifiedPrice: pricing.verified_price,
    customerPrice: pricing.customer_price,
    currency: pricing.currency,
    passengers: selected.passengers,
    travellers: {
      primary_guest: {
        ...toTravellerData(travellers[leadKey] ?? emptyTraveller),
        email: contact.email,
        phone: contact.phone,
      },
      travelers,
    },
    redirectUrl,
  };
};

// SkyLink sends the price expiry as "2026-09-21 10:44:46".
export const secondsUntil = (expiresAt: string, now = Date.now()): number => {
  const target = new Date(expiresAt.replace(" ", "T")).getTime();
  return Math.max(0, Math.floor((target - now) / 1000));
};
