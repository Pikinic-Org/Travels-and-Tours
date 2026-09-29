// A contact form submission, in the shape pikinic-site's /api/contact expects.
export type ContactEnquiry = {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  message: string;
};
