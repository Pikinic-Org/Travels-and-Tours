import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { InlinePhoto } from "@/components/ui/inline-photo";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SocialIcon } from "@/components/ui/social-icon";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig, socialLinks } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about a flight, a booking or a package? Get in touch with the Pikinic Travel & Tours team.",
};

const instagram = socialLinks.find((s) => s.label === "Instagram");

// "+2348055308558" -> "+234 805 530 8558"
const formatPhone = (phone: string) => phone.replace(/^\+234(\d{3})(\d{3})(\d{4})$/, "+234 $1 $2 $3");

const linkIconClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-primary text-text-secondary transition-colors group-hover:border-green-600 group-hover:text-green-700";
const linkTextClass = "text-base font-medium text-text-primary transition-colors group-hover:text-green-700";

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <Container className="relative">
        <ScrollReveal className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-text-primary sm:text-5xl md:text-6xl">
              Got a <span className="text-green-700">trip</span>{" "}
              <InlinePhoto src="/images/travel-tours.jpg" alt="Travellers on holiday" /> in mind? Let&rsquo;s talk.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-text-secondary">
              Questions about a fare, a booking you&rsquo;ve made or one of our packages? Send us a message and our
              travel team will come back to you with a clear answer.
            </p>

            <dl className="mt-12 space-y-6 border-t border-border-primary pt-8 text-sm">
              <div>
                <dt className="text-sm text-text-secondary">Office</dt>
                <dd className="mt-1 text-base text-text-primary">{siteConfig.address}</dd>
              </div>
            </dl>

            <div className="mt-10 border-t border-border-primary pt-8">
              <p className="text-sm text-text-secondary">Other ways to reach us</p>
              <div className="mt-4 space-y-3">
                {siteConfig.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="group flex items-center gap-3">
                    <span className={linkIconClass}>
                      <SocialIcon icon="phone" className="h-4 w-4" />
                    </span>
                    <span className={linkTextClass}>{formatPhone(phone)}</span>
                  </a>
                ))}
                <a href={`mailto:${siteConfig.email}`} className="group flex items-center gap-3">
                  <span className={linkIconClass}>
                    <SocialIcon icon="mail" className="h-4 w-4" />
                  </span>
                  <span className={linkTextClass}>{siteConfig.email}</span>
                </a>
                {instagram && (
                  <a href={instagram.href} target="_blank" rel="noreferrer noopener" className="group flex items-center gap-3">
                    <span className={linkIconClass}>
                      <SocialIcon icon="instagram" className="h-4 w-4" />
                    </span>
                    <span className={linkTextClass}>@pikinic</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <ContactForm />
        </ScrollReveal>
      </Container>
    </section>
  );
}
