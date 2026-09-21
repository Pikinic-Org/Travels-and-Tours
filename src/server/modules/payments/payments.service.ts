import { postJson } from "@/server/lib/pikinic-client";
import type { InitiatePaymentParams, InitiatePaymentResult } from "@/types";

export const initiatePayment = (params: InitiatePaymentParams) =>
  postJson<InitiatePaymentResult>("/api/monnify/initiate", params);
