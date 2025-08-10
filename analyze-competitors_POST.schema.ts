import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({
  brandCategory: z.string().min(1, "Brand category is required."),
  region: z.string().min(1, "Region is required."),
  platform: z.string().optional(), // For platform-specific analysis
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  analysis: {
    sampleAds: {
      imageUrl: string;
      engagement: string;
      platform: string;
      contentFormat: string;
      ctr?: number;
      engagementRate?: number;
    }[];
    colorPalette: string[];
    copyTone: string;
    regionalPreferences: string;
    successMetrics: string;
    visualTrends: {
      designPatterns: string[];
      layoutStyles: string[];
      contentFormats: {
        video: number;
        static: number;
        carousel: number;
        ugc: number;
      };
    };
    copyPerformance: {
      topPerformingHeadlines: string[];
      ctrPatterns: string[];
      engagementDrivers: string[];
    };
    seasonalTrends: {
      peakSeasons: string[];
      timingRecommendations: string;
      culturalInsights: string[];
    };
    pricingStrategy: {
      commonOffers: string[];
      pricePositioning: string;
      promotionalTactics: string[];
    };
  };
  competitiveIntelligence: {
    adFrequency: {
      averagePostsPerWeek: number;
      peakPostingTimes: string[];
      contentRefreshRate: string;
    };
    budgetEstimates: {
      estimatedSpend: string;
      competitionLevel: string;
      costPerEngagement: string;
    };
    audienceInsights: {
      targetDemographics: string[];
      audienceOverlap: number;
      uniqueAudienceGaps: string[];
    };
    brandDifferentiation: {
      uniquePositioning: string[];
      competitiveAdvantages: string[];
      marketGaps: string[];
    };
  };
  actionableRecommendations: {
    copyStrategies: {
      suggestedHeadlines: string[];
      toneAdjustments: string[];
      cta_recommendations: string[];
    };
    visualStrategy: {
      recommendedColors: string[];
      designDirection: string[];
      contentFormatMix: string;
    };
    platformOptimizations: {
      instagram: string[];
      facebook: string[];
      tiktok: string[];
      general: string[];
    };
    contentGaps: string[];
    positioningAdvice: string[];
  };
};

export const postAnalyzeCompetitors = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const response = await fetch(`/_api/analyze-competitors`, {
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
    throw new Error((errorObject as any)?.error || "Failed to analyze competitors");
  }
  
  return superjson.parse<OutputType>(responseText);
};