import { Button } from "@/components/ui/button";
import { type Package } from "@/lib/data/packages";
import { packageEnquiryHref } from "@/lib/constants";

// Packages are enquired about on WhatsApp (0806 579 4790), not added to the cart (user, 2026-11-06).
// Button opens wa.me links in a new tab.
export function BookPackageButton({ pkg, className }: { pkg: Package; className?: string }) {
  return (
    <Button href={packageEnquiryHref(pkg)} size="lg" variant="primary" className={className}>
      Make an enquiry
    </Button>
  );
}
