import type { PassengerCounts, TripType } from "@/types/flights";

export type TravellerTitle = "Mr" | "Mrs" | "Ms" | "Miss" | "Dr" | "Prof";

export type TravellerDetails = {
  title: TravellerTitle;
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

export type PrimaryGuestDetails = TravellerDetails & { email: string; phone: string };

export type StartCheckoutParams = {
  tripType: TripType;
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
    primary_guest: PrimaryGuestDetails;
    travelers: Record<string, TravellerDetails & { email?: string; phone?: string }>;
  };
  redirectUrl: string;
};

export type StartCheckoutResult = {
  bookingId: string;
  checkoutUrl: string;
};

export type FlightBookingStatus = "pending_payment" | "paid" | "reserved" | "failed";

export type FlightBooking = {
  id: string;
  status: FlightBookingStatus;
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
