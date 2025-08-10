import { z } from "zod";
import superjson from 'superjson';
import { Brands } from "../helpers/schema";
import { Selectable } from "kysely";

// No input schema needed for a simple GET all request.
export const schema = z.object({});

export type InputType = z.infer<typeof schema>;
export type OutputType = Selectable<Brands>[];

export const getBrands = async (init?: RequestInit): Promise<OutputType> => {
  const response = await fetch(`/_api/brands`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const responseText = await response.text();
  if (!response.ok) {
    const errorObject = superjson.parse(responseText);
    throw new Error((errorObject as any)?.error || "Failed to fetch brands");
  }
  
  return superjson.parse<OutputType>(responseText);
};