// Checkout form state — kept as plain strings because that's what the inputs
// hold; it's converted to the API's TravellerDetails when the form is submitted.
export type TravellerFormState = {
  title: string;
  first_name: string;
  last_name: string;
  other_name: string;
  country_code: string;
  dob: string;
  gender: string;
  passport_number: string;
  passport_expiry: string;
  passport_issue_date: string;
  nationality: string;
};

export type ContactFormState = {
  email: string;
  phone: string;
};

export type PassengerSlot = {
  key: string; // adult_0, child_1, infant_0 … — the key SkyLink expects
  label: string;
};
