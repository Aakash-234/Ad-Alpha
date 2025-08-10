import { z } from "zod";
import superjson from 'superjson';
import { GeneratedCreatives, PlatformTypeArrayValues } from "../helpers/schema";
import { Selectable } from "kysely";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// This schema is for client-side and server-side validation.
export const schema = z.object({
  brandId: z.string().min(1, "Brand ID is required."),
  regionalProfileId: z.string().min(1, "Regional Profile ID is required."),
  platform: z.enum(PlatformTypeArrayValues),
  copyText: z.string().optional(),
  files: z
    .array(
      z
        .instanceof(File, { message: "A file must be provided." })
        .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
    )
    .min(1, "At least one image is required.")
    .max(3, "You can upload a maximum of 3 images at a time."),
});

// The input to the fetch helper is FormData, not a plain object.
export type InputType = FormData;

// The output is an array of creatives, matching the structure of the generate-creative endpoint for consistency.
export type OutputType = Array<Selectable<GeneratedCreatives> & {
  competitorInsights: null;
}>;

export const postUploadManualCreative = async (formData: InputType, init?: RequestInit): Promise<OutputType> => {
  // We don't parse the input here as it's FormData
  const result = await fetch(`/_api/upload-manual-creative`, {
    method: "POST",
    body: formData,
    ...init,
    // Content-Type is set automatically by the browser for FormData
  });

  const responseText = await result.text();
  if (!result.ok) {
    const errorObject = superjson.parse(responseText);
    throw new Error((errorObject as any)?.error || 'Manual creative upload failed');
  }
  return superjson.parse<OutputType>(responseText);
};