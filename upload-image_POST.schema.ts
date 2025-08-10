import { z } from "zod";
import superjson from 'superjson';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// This schema is for client-side validation. Server-side re-validates.
export const schema = z.object({
  file: z
    .instanceof(File, { message: "Image is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

// The input to the fetch helper is FormData, not a plain object.
export type InputType = FormData;

export type OutputType = {
  dataUrl: string;
};

export const postUploadImage = async (formData: InputType, init?: RequestInit): Promise<OutputType> => {
  // We don't parse the input here as it's FormData
  const result = await fetch(`/_api/upload-image`, {
    method: "POST",
    body: formData,
    ...init,
    // Content-Type is set automatically by the browser for FormData
  });

  if (!result.ok) {
    const errorObject = superjson.parse(await result.text());
    throw new Error((errorObject as any)?.error || 'Image upload failed');
  }
  return superjson.parse<OutputType>(await result.text());
};