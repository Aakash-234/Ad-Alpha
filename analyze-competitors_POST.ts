import { schema, OutputType } from "./analyze-competitors_POST.schema";
import { mockCompetitorData, CompetitorData } from "../helpers/competitorData";
import superjson from 'superjson';

type Category = keyof typeof mockCompetitorData;
type Region = keyof typeof mockCompetitorData[Category];

export async function handle(request: Request): Promise<Response> {
  try {
    const json = superjson.parse(await request.text());
    const { brandCategory, region, platform } = schema.parse(json);

    console.log(`Analyzing competitors for category: ${brandCategory}, region: ${region}${platform ? `, platform: ${platform}` : ''}`);

    const categoryData = mockCompetitorData[brandCategory as Category];
    if (!categoryData) {
      return new Response(superjson.stringify({ 
        error: `No competitor data available for category: ${brandCategory}. Available categories: ${Object.keys(mockCompetitorData).join(', ')}` 
      }), { status: 404 });
    }

    const regionalData = categoryData[region as Region];
    if (!regionalData) {
      return new Response(superjson.stringify({ 
        error: `No competitor data available for region: ${region} in category: ${brandCategory}. Available regions: ${Object.keys(categoryData).join(', ')}` 
      }), { status: 404 });
    }

    // Filter ads by platform if specified
    let filteredAds = regionalData.sampleAds;
    if (platform) {
      filteredAds = regionalData.sampleAds.filter(ad => 
        ad.platform.toLowerCase() === platform.toLowerCase()
      );
      if (filteredAds.length === 0) {
        filteredAds = regionalData.sampleAds; // Fallback to all ads
      }
    }

    const analysisResult: OutputType = {
      analysis: {
        sampleAds: filteredAds,
        colorPalette: regionalData.colorPalette,
        copyTone: regionalData.copyTone,
        regionalPreferences: regionalData.regionalPreferences,
        successMetrics: `Engagement patterns for ${brandCategory} in ${region} show average CTR of ${filteredAds.reduce((sum, ad) => sum + (ad.ctr || 0), 0) / filteredAds.length}% and engagement rate of ${filteredAds.reduce((sum, ad) => sum + (ad.engagementRate || 0), 0) / filteredAds.length}%`,
        visualTrends: regionalData.visualTrends,
        copyPerformance: regionalData.copyPerformance,
        seasonalTrends: regionalData.seasonalTrends,
        pricingStrategy: regionalData.pricingStrategy
      },
      competitiveIntelligence: {
        adFrequency: {
          averagePostsPerWeek: brandCategory === 'fashion' ? 12 : brandCategory === 'beauty' ? 15 : 8,
          peakPostingTimes: region === 'usa' ? ['12-2 PM EST', '7-9 PM EST'] : ['11 AM-1 PM', '6-8 PM local'],
          contentRefreshRate: brandCategory === 'tech' ? 'Every 2-3 weeks' : 'Weekly'
        },
        budgetEstimates: {
          estimatedSpend: brandCategory === 'beauty' ? '$50K-200K/month' : brandCategory === 'fashion' ? '$30K-150K/month' : '$20K-100K/month',
          competitionLevel: region === 'usa' ? 'High' : region === 'europe' ? 'Medium-High' : 'Medium',
          costPerEngagement: brandCategory === 'beauty' ? '$0.15-0.35' : '$0.20-0.45'
        },
        audienceInsights: {
          targetDemographics: brandCategory === 'fitness' ? ['18-35 health enthusiasts', 'Professionals seeking work-life balance'] : 
                              brandCategory === 'fashion' ? ['16-35 fashion-forward consumers', 'Trend-conscious millennials'] :
                              brandCategory === 'beauty' ? ['16-45 beauty enthusiasts', 'Self-expression focused'] :
                              ['25-45 professionals', 'Small business owners'],
          audienceOverlap: region === 'usa' ? 65 : 45,
          uniqueAudienceGaps: ['Eco-conscious segment underserved', 'Mid-tier price point opportunity', 'Senior demographics untapped']
        },
        brandDifferentiation: {
          uniquePositioning: [`${brandCategory} for the conscious consumer`, 'Community-first approach', 'Sustainable practices focus'],
          competitiveAdvantages: ['Authentic storytelling opportunity', 'Underserved demographics', 'Quality-price sweet spot'],
          marketGaps: ['Personalized experiences lacking', 'Educational content underutilized', 'Social responsibility messaging weak']
        }
      },
      actionableRecommendations: {
        copyStrategies: {
          suggestedHeadlines: regionalData.copyPerformance.topPerformingHeadlines.map(headline => 
            `${headline} - Try: "${headline.replace('Your', 'My').replace('The', 'Your Perfect')}"`
          ),
          toneAdjustments: [
            `Adopt ${regionalData.copyTone.split('.')[0].toLowerCase()} tone`,
            'Incorporate local cultural references',
            'Use platform-specific language patterns'
          ],
          cta_recommendations: [
            brandCategory === 'fitness' ? 'Start Your Transformation' : 
            brandCategory === 'fashion' ? 'Shop The Look' :
            brandCategory === 'beauty' ? 'Discover Your Glow' : 'Try It Free'
          ]
        },
        visualStrategy: {
          recommendedColors: regionalData.colorPalette.slice(0, 3),
          designDirection: regionalData.visualTrends.designPatterns,
          contentFormatMix: `Focus on ${Object.entries(regionalData.visualTrends.contentFormats).sort((a, b) => b[1] - a[1])[0][0]} content (${Object.entries(regionalData.visualTrends.contentFormats).sort((a, b) => b[1] - a[1])[0][1]}% of strategy)`
        },
        platformOptimizations: {
          instagram: [
            'Use Stories for behind-the-scenes content',
            'Leverage Reels for trending audio',
            'Optimize for mobile-first viewing'
          ],
          facebook: [
            'Focus on detailed captions with clear CTAs',
            'Use carousel format for product showcases',
            'Target lookalike audiences of competitors'
          ],
          tiktok: [
            'Participate in trending challenges',
            'Use vertical video format exclusively',
            'Post during peak evening hours'
          ],
          general: [
            'A/B test different creative formats weekly',
            'Maintain consistent brand voice across platforms',
            'Monitor competitor posting schedules'
          ]
        },
        contentGaps: [
          'Educational content opportunity',
          'User-generated content underutilized',
          'Seasonal trending moments missed',
          'Cross-platform storytelling potential'
        ],
        positioningAdvice: [
          `Position as premium alternative in ${brandCategory} space`,
          'Emphasize unique value proposition around sustainability',
          'Leverage local market insights for authentic messaging',
          'Create content series around lifestyle transformation'
        ]
      }
    };

    return new Response(superjson.stringify(analysisResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error analyzing competitors:", error);
    if (error instanceof Error) {
        return new Response(superjson.stringify({ error: error.message }), { status: 400 });
    }
    return new Response(superjson.stringify({ error: "An unknown error occurred" }), { status: 500 });
  }
}