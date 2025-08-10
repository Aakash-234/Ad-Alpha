import { z } from "zod";
import superjson from 'superjson';
import { BrandTone } from "../helpers/schema";

export const schema = z.object({
  url: z.string().url("Please provide a valid website URL."),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  // Basic Brand Identity
  name: string;
  description: string | null;
  
  // Enhanced Brand Identity
  logos: {
    primary: string | null;
    favicon: string | null;
    variations: string[];
  };
  colors: {
    primary: string;
    secondary: string | null;
    palette: string[];
    gradients: string[];
  };
  fonts: {
    primary: string | null;
    headings: string | null;
    body: string | null;
    detected: string[];
  };
  tone: BrandTone | null;
  
  // Product Information
  products: {
    images: string[];
    categories: string[];
    descriptions: string[];
    pricing: string[];
  };
  
  // Content Analysis
  content: {
    keyMessages: string[];
    valuePropositions: string[];
    taglines: string[];
    keywords: string[];
    headings: string[];
  };
  
  // Technical Assets
  social: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    tiktok: string | null;
    other: string[];
  };
  contact: {
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  
  // SEO and Meta Information
  seo: {
    title: string | null;
    metaDescription: string | null;
    keywords: string | null;
    ogTags: Record<string, string>;
    twitterTags: Record<string, string>;
    structuredData: Record<string, any>[];
  };
  
  // Visual Assets
  visuals: {
    heroImages: string[];
    bannerImages: string[];
    backgroundImages: string[];
    productPhotos: string[];
    iconography: string[];
  };
  
  // Technical Information
  technical: {
    websiteUrl: string;
    lastScraped: string;
    technologies: string[];
    performance: {
      loadTime: number | null;
      imageCount: number;
      linkCount: number;
    };
  };
};

export const postScrapeBrandInfo = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const response = await fetch(`/_api/scrape-brand-info`, {
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
    throw new Error((errorObject as any)?.error || "Failed to scrape brand information.");
  }
  
  return superjson.parse<OutputType>(responseText);
};