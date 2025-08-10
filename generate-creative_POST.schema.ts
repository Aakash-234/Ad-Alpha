import { z } from "zod";
import superjson from 'superjson';
import { GeneratedCreatives, PlatformTypeArrayValues } from "../helpers/schema";
import { Selectable } from "kysely";
import { OutputType as CompetitorAnalysisOutput } from "./analyze-competitors_POST.schema";

export const schema = z.object({
  brandId: z.string().min(1, "Brand ID is required."),
  regionalProfileId: z.string().min(1, "Regional Profile ID is required."),
  platform: z.enum(PlatformTypeArrayValues),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = Selectable<GeneratedCreatives> & {
  competitorInsights: CompetitorAnalysisOutput | null;
};

export const postGenerateCreative = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const response = await fetch(`/_api/generate-creative`, {
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
    throw new Error((errorObject as any)?.error || "Failed to generate creative");
  }
  
  return superjson.parse<OutputType>(responseText);
};