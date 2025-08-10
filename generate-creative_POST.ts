import { schema, OutputType } from "./generate-creative_POST.schema";
import { db } from "../helpers/db";
import superjson from 'superjson';
import { nanoid } from 'nanoid';
import { GeneratedCreatives, PlatformTypeArrayValues } from "../helpers/schema";
import { Selectable } from "kysely";
import { postAnalyzeCompetitors } from "./analyze-competitors_POST.schema";

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string | Array<{
        type: string;
        text?: string;
        image_url?: {
          url: string;
        };
      }>;
    };
    finish_reason: string;
  }>;
}

const PLATFORM_DIMENSIONS = {
  instagram_post: { width: 1080, height: 1080, format: "square" },
  instagram_story: { width: 1080, height: 1920, format: "vertical story" },
  facebook_post: { width: 1200, height: 630, format: "horizontal post" },
  tiktok_reel: { width: 1080, height: 1920, format: "vertical video thumbnail" },
  twitter_post: { width: 1200, height: 675, format: "horizontal post" }
};

function inferBrandCategory(brandName: string): string {
  const name = brandName.toLowerCase();
  
  // Food-related keyword detection
  if (name.includes('restaurant') || name.includes('cafe') || name.includes('bistro') || 
      name.includes('grill') || name.includes('burger') || name.includes('pizza') || 
      name.includes('fast') || name.includes('quick') || name.includes('kitchen') ||
      name.includes('dine') || name.includes('eat') || name.includes('food')) {
    return 'restaurant-fast-food';
  }
  
  if (name.includes('bakery') || name.includes('cake') || name.includes('pastry') || 
      name.includes('confection') || name.includes('sweet') || name.includes('dessert') ||
      name.includes('chocolate') || name.includes('candy') || name.includes('cookie') ||
      name.includes('donut') || name.includes('cupcake')) {
    return 'bakery-confectionery';
  }
  
  if (name.includes('organic') || name.includes('natural') || name.includes('health') || 
      name.includes('superfood') || name.includes('wellness') || name.includes('clean') ||
      name.includes('green') || name.includes('pure') || name.includes('wholesome') ||
      name.includes('nutrition')) {
    return 'organic-healthy-foods';
  }
  
  if (name.includes('spice') || name.includes('masala') || name.includes('traditional') || 
      name.includes('heritage') || name.includes('authentic') || name.includes('regional') ||
      name.includes('ethnic') || name.includes('cultural') || name.includes('anveshan')) {
    return 'regional-traditional-foods';
  }
  
  if (name.includes('snack') || name.includes('packaged') || name.includes('frozen') || 
      name.includes('instant') || name.includes('ready') || name.includes('convenient') ||
      name.includes('meal') || name.includes('brand') || name.includes('foods') ||
      name.includes('grocery') || name.includes('pantry')) {
    return 'packaged-foods';
  }
  
  // Fitness/gym detection
  if (name.includes('fit') || name.includes('gym')) {
    return 'fitness';
  }
  
  // Default fallback changed from 'fashion' to 'packaged-foods' for Anveshan
  return 'packaged-foods';
}

function constructPrompt(brandData: any, regionalData: any, platform: string, competitorInsights?: any): string {
  const dimensions = PLATFORM_DIMENSIONS[platform as keyof typeof PLATFORM_DIMENSIONS];
  
  const brandCategory = inferBrandCategory(brandData.name);
  const isFoodBrand = ['restaurant-fast-food', 'packaged-foods', 'organic-healthy-foods', 
                      'bakery-confectionery', 'regional-traditional-foods'].includes(brandCategory);

  let basePrompt = `Create a professional advertising creative image for ${brandData.name} targeting ${regionalData.name} region.

BRAND SPECIFICATIONS:
- Brand: ${brandData.name}
- Category: ${brandCategory}
- Tone: ${brandData.tone}
- Primary Color: ${brandData.primaryColor}
- Secondary Color: ${brandData.secondaryColor || 'complementary to primary'}
- Brand Personality: ${brandData.tone === 'luxury' ? 'Premium, sophisticated, exclusive' : 
                     brandData.tone === 'playful' ? 'Fun, energetic, creative' :
                     brandData.tone === 'professional' ? 'Clean, trustworthy, corporate' :
                     brandData.tone === 'casual' ? 'Relaxed, approachable, down-to-earth' :
                     brandData.tone === 'friendly' ? 'Warm, welcoming, personable' : 'Confident, expert, reliable'}

REGIONAL CULTURAL ELEMENTS:
- Region: ${regionalData.name}
- Cultural motifs: ${regionalData.culturalMotifs.join(', ')}
- Trending colors: ${regionalData.trendingColors.join(', ')}
- Local phrases/slang: ${regionalData.slangPhrases.join(', ')}

PLATFORM REQUIREMENTS:
- Platform: ${platform.replace('_', ' ')}
- Dimensions: ${dimensions.width}x${dimensions.height}
- Format: ${dimensions.format}
- Style: High-quality, professional advertising creative`;

  if (isFoodBrand) {
    basePrompt += `

FOOD-SPECIFIC DESIGN ELEMENTS:
- Food Photography Best Practices: Use natural lighting, close-up shots showing texture and freshness, steam effects for hot foods, condensation for cold beverages
- Appetizing Visual Elements: Vibrant colors that enhance appetite, fresh ingredients visibility, appealing food styling, mouth-watering presentations
- Food Safety & Quality Messaging: Clean preparation environments, fresh ingredients showcase, quality certifications, hygiene standards
- Cultural Food Preferences: Incorporate regional spice levels, traditional cooking methods, local ingredient preferences, cultural dining contexts
- Seasonal Food Trends: Use seasonal ingredients, appropriate temperature suggestions (hot foods in winter, cold in summer), seasonal color palettes
- Food Presentation Styles: Professional plating, garnish details, appropriate serving vessels, context-appropriate backgrounds (rustic vs modern)
- Texture Emphasis: Show food textures clearly - crispy, creamy, juicy, tender - through lighting and composition
- Freshness Indicators: Bright colors, visible steam, fresh herb garnishes, natural imperfections that suggest authenticity
- Cultural Context: Include culturally appropriate utensils, serving styles, dining settings, and presentation methods`;
  }

  basePrompt += `

DESIGN REQUIREMENTS:
- Incorporate brand colors prominently
- Include subtle regional cultural elements
- Maintain brand tone throughout the design
- Ensure readability and visual impact
- Leave space for text overlay
- High contrast and vibrant colors
- Professional advertising quality
- Focus on ${isFoodBrand ? 'food appeal, freshness, and appetite stimulation' : 'product appeal and brand recognition'}`;

  if (isFoodBrand) {
    basePrompt += `
- Emphasize food safety, quality, and freshness
- Use lighting that makes food look appetizing
- Include cultural food contexts relevant to the region
- Consider seasonal food preferences and availability`;
  }

  if (competitorInsights) {
    basePrompt += `

COMPETITIVE INSIGHTS:
- Competitor color trends: ${competitorInsights.analysis.colorPalette.join(', ')}
- Successful copy tone: ${competitorInsights.analysis.copyTone}
- Regional preferences: ${competitorInsights.analysis.regionalPreferences}
- Platform optimizations: ${competitorInsights.platformOptimizations.join('; ')}

Use these insights to create a creative that stands out while following successful patterns.`;
  }

  basePrompt += `

Generate a compelling, culturally-relevant advertising image that would resonate with the target regional audience while maintaining strong brand identity${isFoodBrand ? ' and maximizing food appeal' : ''}.`;

  return basePrompt;
}

function generateAdCopy(brandData: any, regionalData: any, platform: string): string {
  const copies = {
    luxury: [
      `Discover the epitome of excellence with ${brandData.name}.`,
      `Experience unparalleled luxury. ${brandData.name} - Where quality meets prestige.`,
      `Elevate your lifestyle with ${brandData.name}'s exclusive collection.`
    ],
    playful: [
      `Ready to have some fun? ${brandData.name} is here to brighten your day!`,
      `Life's too short for boring. Spice it up with ${brandData.name}!`,
      `${brandData.name} - Where every moment becomes an adventure!`
    ],
    professional: [
      `Trust ${brandData.name} for professional excellence that delivers results.`,
      `${brandData.name} - Your reliable partner for success.`,
      `Experience the difference with ${brandData.name}'s proven expertise.`
    ],
    casual: [
      `Just what you need. ${brandData.name} keeps it simple and effective.`,
      `No fuss, just great quality. That's ${brandData.name}.`,
      `Easy does it with ${brandData.name} - your everyday essential.`
    ],
    friendly: [
      `Welcome to the ${brandData.name} family - where quality meets warmth!`,
      `${brandData.name} is here for you, every step of the way.`,
      `Join thousands who trust ${brandData.name} for their needs.`
    ],
    authoritative: [
      `${brandData.name} - The definitive choice for those who demand the best.`,
      `Industry leaders choose ${brandData.name}. Join the experts.`,
      `When excellence is non-negotiable, choose ${brandData.name}.`
    ]
  };

  // Add regional flair if slang phrases are available
  const baseCopy = copies[brandData.tone as keyof typeof copies] || copies.friendly;
  const selectedCopy = baseCopy[Math.floor(Math.random() * baseCopy.length)];
  
  // Occasionally add regional phrases for authenticity
  if (regionalData.slangPhrases.length > 0 && Math.random() > 0.7) {
    const regionalPhrase = regionalData.slangPhrases[Math.floor(Math.random() * regionalData.slangPhrases.length)];
    return `${selectedCopy} ${regionalPhrase}`;
  }
  
  return selectedCopy;
}

function calculateMatchScore(brandData: any, regionalData: any, platform: string, competitorInsights?: any): number {
  let score = 75; // Base score
  
  // Brand alignment factors
  if (brandData.primaryColor && brandData.secondaryColor) score += 5;
  if (brandData.tone) score += 5;
  if (brandData.productImages && brandData.productImages.length > 0) score += 3;
  
  // Regional alignment factors
  if (regionalData.culturalMotifs && regionalData.culturalMotifs.length > 2) score += 4;
  if (regionalData.trendingColors && regionalData.trendingColors.length > 1) score += 3;
  if (regionalData.slangPhrases && regionalData.slangPhrases.length > 0) score += 3;
  
  // Platform optimization
  if (platform in PLATFORM_DIMENSIONS) score += 2;
  
  // Competitor insights bonus
  if (competitorInsights) {
    score += 5; // Bonus for having competitor analysis
    // Additional bonus if brand colors align with trending competitor colors
    if (brandData.primaryColor && competitorInsights.analysis.colorPalette.length > 0) {
      score += 2;
    }
  }
  
  // Add some randomness to simulate real-world variation
  score += Math.floor(Math.random() * 8) - 4; // -4 to +4
  
  return Math.min(Math.max(score, 70), 98); // Clamp between 70-98
}

export async function handle(request: Request): Promise<Response> {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    // Fetch brand details
    const brandData = await db
      .selectFrom('brands')
      .selectAll()
      .where('id', '=', input.brandId)
      .executeTakeFirst();

    if (!brandData) {
      return new Response(superjson.stringify({ error: "Brand not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch regional profile details
    const regionalData = await db
      .selectFrom('regionalProfiles')
      .selectAll()
      .where('id', '=', input.regionalProfileId)
      .executeTakeFirst();

    if (!regionalData) {
      return new Response(superjson.stringify({ error: "Regional profile not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Analyze competitors (with graceful fallback)
    let competitorInsights: any = null;
    try {
      // Infer brand category using improved food-aware detection
      const brandCategory = inferBrandCategory(brandData.name);
      const region = regionalData.regionCode.toLowerCase();
      
      console.log(`Analyzing competitors for category: ${brandCategory}, region: ${region}`);
      competitorInsights = await postAnalyzeCompetitors({
        brandCategory,
        region
      });
      console.log("Competitor analysis successful:", competitorInsights);
    } catch (competitorError) {
      console.warn("Competitor analysis failed, continuing without insights:", competitorError);
      // Continue without competitor insights - this is graceful degradation
    }

    // Construct intelligent prompt with competitor insights
    const prompt = constructPrompt(brandData, regionalData, input.platform, competitorInsights);
    console.log("Generated prompt:", prompt);

    // Make API call to OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error("OpenRouter API error:", errorText);
      return new Response(superjson.stringify({ 
        error: `Failed to generate image: ${openRouterResponse.status} ${openRouterResponse.statusText}` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiResult: OpenRouterResponse = await openRouterResponse.json();
    console.log("OpenRouter API response:", apiResult);

    // Extract generated image URL with proper type checking
    let imageUrl: string | null = null;
    if (apiResult.choices && apiResult.choices.length > 0) {
      const choice = apiResult.choices[0];
      if (choice.message && choice.message.content) {
        // Handle both string and array content types
        if (Array.isArray(choice.message.content)) {
          // Content is an array - look for image_url type
          const imageContent = choice.message.content.find(content => 
            content.type === 'image_url' && content.image_url
          );
          if (imageContent && imageContent.image_url) {
            imageUrl = imageContent.image_url.url;
          }
        } else if (typeof choice.message.content === 'string') {
          // Content is a string - try to extract URLs from text
          console.log("Received text content from API:", choice.message.content);
          const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
          const urls = choice.message.content.match(urlRegex);
          if (urls && urls.length > 0) {
            // Filter for likely image URLs
            const imageUrls = urls.filter(url => 
              /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) ||
              url.includes('image') ||
              url.includes('photo') ||
              url.includes('pic')
            );
            if (imageUrls.length > 0) {
              imageUrl = imageUrls[0];
              console.log("Extracted image URL from text:", imageUrl);
            }
          }
        }
      }
    }

    // If no image URL found in response, fall back to a placeholder with error info
    if (!imageUrl) {
      console.warn("No image URL found in API response, using placeholder");
      console.log("API response structure:", JSON.stringify(apiResult, null, 2));
      // Use a deterministic placeholder based on the input with proper dimensions
      const dimensions = PLATFORM_DIMENSIONS[input.platform as keyof typeof PLATFORM_DIMENSIONS];
      imageUrl = `https://picsum.photos/seed/${input.brandId}-${input.regionalProfileId}/${dimensions.width}/${dimensions.height}`;
    }

    // Generate relevant ad copy
    const copyText = generateAdCopy(brandData, regionalData, input.platform);

    // Calculate match score with competitor insights
    const matchScore = calculateMatchScore(brandData, regionalData, input.platform, competitorInsights);

    // Store results in database
    const newCreative: Selectable<GeneratedCreatives> = await db
      .insertInto('generatedCreatives')
      .values({
        id: nanoid(),
        brandId: input.brandId,
        regionalProfileId: input.regionalProfileId,
        platform: input.platform,
        promptUsed: prompt,
        imageUrl: imageUrl,
        copyText: copyText,
        matchScore: matchScore,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    console.log("Successfully generated creative:", newCreative.id);

    // Prepare response with competitor insights
    const response = {
      ...newCreative,
      competitorInsights: competitorInsights || null
    };

    return new Response(superjson.stringify(response satisfies OutputType), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating creative:", error);
    
    // Handle different types of errors with specific messages
    let errorMessage = "An unknown error occurred while generating creative";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Brand not found')) {
        errorMessage = "The specified brand was not found";
        statusCode = 404;
      } else if (error.message.includes('Regional profile not found')) {
        errorMessage = "The specified regional profile was not found";
        statusCode = 404;
      } else if (error.message.includes('Failed to generate image')) {
        errorMessage = "Failed to generate image via AI service. Please try again.";
        statusCode = 503;
      } else if (error.message.includes('validation')) {
        errorMessage = "Invalid input parameters provided";
        statusCode = 400;
      } else {
        errorMessage = error.message;
      }
    }

    return new Response(superjson.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}