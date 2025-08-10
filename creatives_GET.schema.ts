import { z } from "zod";
import superjson from 'superjson';
import { PlatformType, PlatformTypeArrayValues } from "../helpers/schema";

// Schema for validating query parameters
export const schema = z.object({
  brandId: z.string().optional(),
  platform: z.enum(PlatformTypeArrayValues).optional(),
  limit: z.coerce.number().int().positive().optional().default(50),
});

export type InputType = z.infer<typeof schema>;

// The output type for a single creative, including the derived `isManualUpload` field.
export type CreativeOutputType = {
  id: string;
  brandId: string;
  regionalProfileId: string;
  platform: PlatformType;
  imageUrl: string | null;
  copyText: string | null;
  matchScore: number | null;
  createdAt: Date | null;
  isManualUpload: boolean;
};

// The endpoint returns an array of creatives.
export type OutputType = CreativeOutputType[];

export const getCreatives = async (params: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedParams = schema.parse(params);
  const searchParams = new URLSearchParams();

  if (validatedParams.brandId) {
    searchParams.append('brandId', validatedParams.brandId);
  }
  if (validatedParams.platform) {
    searchParams.append('platform', validatedParams.platform);
  }
  if (validatedParams.limit) {
    searchParams.append('limit', String(validatedParams.limit));
  }

  const queryString = searchParams.toString();
  const url = `/_api/creatives${queryString ? `?${queryString}` : ''}`;

  const result = await fetch(url, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const responseText = await result.text();
  if (!result.ok) {
    const errorObject = superjson.parse(responseText);
    throw new Error((errorObject as any)?.error || 'Failed to fetch creatives');
  }
  return superjson.parse<OutputType>(responseText);
};