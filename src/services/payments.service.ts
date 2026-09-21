import { postJson } from "@/services/http";
import type { InitiatePaymentParams, InitiatePaymentResult } from "@/types";

export const initiatePayment = (params: InitiatePaymentParams) =>
  postJson<InitiatePaymentResult>("/api/monnify/initiate", params);
