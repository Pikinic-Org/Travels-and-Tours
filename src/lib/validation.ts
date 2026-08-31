import { z } from "zod";

export const bookingFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  notes: z.string().trim().optional(),
});
export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const customPackageSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
  destination: z
    .string()
    .trim()
    .min(5, "Tell us a little more about where you want to go"),
});
export type CustomPackageValues = z.infer<typeof customPackageSchema>;

export const commentSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  body: z.string().trim().min(3, "Comment is too short"),
});
export type CommentValues = z.infer<typeof commentSchema>;

// Runs a schema against form values and returns field-level error messages
// keyed by field name, so callers can render them next to each input.
export function getFieldErrors<T extends z.ZodTypeAny>(
  schema: T,
  values: unknown
): Partial<Record<string, string>> | null {
  const result = schema.safeParse(values);
  if (result.success) return null;

  const errors: Partial<Record<string, string>> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
