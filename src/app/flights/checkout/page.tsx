import { CheckoutView } from "@/components/checkout/checkout-view";

// Route only — the form state lives in the useCheckoutForm controller and the
// UI in components/checkout.
export default function CheckoutPage() {
  return <CheckoutView />;
}
