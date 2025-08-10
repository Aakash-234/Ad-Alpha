import { z } from "zod";
import superjson from 'superjson';
import { BrandToneArrayValues, Brands } from "../helpers/schema";
import { Selectable } from "kysely";

export const schema = z.object({
  name: z.string().min(1, "Brand name is required."),
  primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i, "Invalid hex color format."),
  secondaryColor: z.string().regex(/^#[0-9a-f]{6}$/i, "Invalid hex color format.").nullable().optional(),
  tone: z.enum(BrandToneArrayValues),
  websiteUrl: z.string().url("Invalid URL format.").nullable().optional(),
  // Assuming file uploads are handled separately and we receive URLs
  logoUrl: z.string().url("Invalid URL format.").nullable().optional(),
  productImages: z.array(z.string().url("Invalid URL format.")).max(3).optional().default([]),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = Selectable<Brands>;

export const postBrands = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const response = await fetch(`/_api/brands`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const responseText = await response.text();
  if (!response.ok) {
    const errorObject = superjson.parse(responseText);
    throw new Error((errorObject as any)?.error || "Failed to create brand");
  }
  
  return superjson.parse<OutputType>(responseText);
};