"use server";

// Relays the contact form to pikinic-site's /api/contact, which files it as a
// lead in Zoho CRM. It runs on the server so the proxy secret never reaches
// the browser, and forwards the visitor's IP so pikinic-site can rate-limit
// per visitor rather than per this server.

import { headers } from "next/headers";
import { postJson } from "@/server/lib/pikinic-client";
import type { ContactEnquiry } from "@/types";

export const sendContactEnquiry = async (
  enquiry: ContactEnquiry
): Promise<{ ok: true } | { ok: false; error: string }> => {
  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() ?? requestHeaders.get("x-real-ip") ?? "unknown";

  try {
    await postJson("/api/contact", enquiry, { "x-pikinic-client-ip": clientIp });
    return { ok: true };
  } catch (error) {
    // Thrown errors are masked in production server actions, so hand the
    // message back instead.
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
};
