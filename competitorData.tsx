export type CompetitorAdSample = {
  imageUrl: string;
  engagement: string;
  platform: string;
  contentFormat: string;
  ctr: number;
  engagementRate: number;
};

export type RegionalCompetitorData = {
  sampleAds: CompetitorAdSample[];
  colorPalette: string[];
  copyTone: string;
  regionalPreferences: string;
  visualTrends: {
    designPatterns: string[];
    layoutStyles: string[];
    contentFormats: { video: number; static: number; carousel: number; ugc: number };
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

export type CompetitorData = {
  [category: string]: {
    [region: string]: RegionalCompetitorData;
  };
};

export const mockCompetitorData: CompetitorData = {
  "restaurant-fast-food": {
    usa: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-restaurant-usa-1.png', engagement: 'Very High', platform: 'TikTok', contentFormat: 'video', ctr: 5.8, engagementRate: 9.4 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-restaurant-usa-2.png', engagement: 'High', platform: 'Instagram', contentFormat: 'video', ctr: 4.2, engagementRate: 7.1 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-restaurant-usa-3.png', engagement: 'High', platform: 'Facebook', contentFormat: 'static', ctr: 3.6, engagementRate: 5.9 },
      ],
      colorPalette: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#1B1464'],
      copyTone: 'Bold, craving-inducing, and urgency-driven. Uses words like "crave", "fresh", "limited-time", "irresistible".',
      regionalPreferences: 'High-energy food shots with steam, melted cheese, and vibrant colors. Speed and convenience messaging resonates.',
      visualTrends: {
        designPatterns: ['Close-up food shots', 'Steam and sizzle effects', 'Bold typography overlays', 'Time-limited offers'],
        layoutStyles: ['High contrast backgrounds', 'Dynamic food angles', 'Mobile-first vertical formats'],
        contentFormats: { video: 70, static: 20, carousel: 8, ugc: 2 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Fresh Made Daily', 'Limited Time Only', 'Taste the Difference', 'Order Now, Delivered Hot'],
        ctrPatterns: ['Time-sensitive offers increase CTR by 45%', 'Fresh/hot messaging drives 38% higher engagement'],
        engagementDrivers: ['Food close-ups', 'Limited-time promotions', 'Delivery speed emphasis']
      },
      seasonalTrends: {
        peakSeasons: ['Summer (BBQ season)', 'Football season (Sep-Feb)', 'Holiday parties (Nov-Dec)'],
        timingRecommendations: 'Peak meal times: 11AM-2PM, 5PM-8PM, late night 9PM-11PM',
        culturalInsights: ['Fast-paced lifestyle drives convenience', 'Social media food trends adoption', 'Game day and event catering popular']
      },
      pricingStrategy: {
        commonOffers: ['2 for $5', 'Free delivery over $25', 'Combo deals', 'Happy hour specials'],
        pricePositioning: 'Value-focused with premium options available',
        promotionalTactics: ['Flash sales', 'App-exclusive deals', 'Loyalty program rewards']
      }
    },
    europe: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-restaurant-eu-1.png', engagement: 'High', platform: 'Instagram', contentFormat: 'static', ctr: 3.4, engagementRate: 6.2 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-restaurant-eu-2.png', engagement: 'Medium', platform: 'Facebook', contentFormat: 'carousel', ctr: 2.8, engagementRate: 4.8 },
      ],
      colorPalette: ['#8FBC8F', '#DEB887', '#CD853F', '#F5DEB3', '#2F4F4F'],
      copyTone: 'Quality-focused, authentic, and tradition-oriented. Words like "authentic", "traditional", "locally-sourced", "artisanal".',
      regionalPreferences: 'Natural lighting, rustic presentations, emphasis on ingredients and origin. Sustainability messaging important.',
      visualTrends: {
        designPatterns: ['Natural food photography', 'Ingredient showcases', 'Chef preparation shots', 'Sustainable packaging'],
        layoutStyles: ['Earth-tone palettes', 'Clean, minimal design', 'Heritage typography'],
        contentFormats: { video: 45, static: 40, carousel: 12, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Locally Sourced', 'Traditional Recipe', 'Authentic Flavors', 'Farm to Table'],
        ctrPatterns: ['Origin stories increase engagement by 32%', 'Sustainability messaging drives 28% higher CTR'],
        engagementDrivers: ['Ingredient provenance', 'Chef stories', 'Traditional methods']
      },
      seasonalTrends: {
        peakSeasons: ['Spring (fresh ingredients)', 'Summer (outdoor dining)', 'Christmas markets (Dec)'],
        timingRecommendations: 'Lunch: 12PM-2PM, Dinner: 7PM-9PM, Weekend brunch popular',
        culturalInsights: ['Slow food movement influence', 'Local sourcing preference', 'Seasonal menu expectations']
      },
      pricingStrategy: {
        commonOffers: ['Prix fixe menus', 'Wine pairings', 'Seasonal specials', 'Group bookings'],
        pricePositioning: 'Quality-justified pricing with transparency',
        promotionalTactics: ['Seasonal menu launches', 'Chef collaborations', 'Local partnerships']
      }
    },
    asia: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-restaurant-asia-1.png', engagement: 'Very High', platform: 'TikTok', contentFormat: 'video', ctr: 6.2, engagementRate: 10.8 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-restaurant-asia-2.png', engagement: 'High', platform: 'Instagram', contentFormat: 'ugc', ctr: 4.8, engagementRate: 8.3 },
      ],
      colorPalette: ['#FF4500', '#FFD700', '#DC143C', '#00FF7F', '#4169E1'],
      copyTone: 'Social-first, trend-driven, and experience-focused. Uses "viral", "trending", "must-try", "Insta-worthy".',
      regionalPreferences: 'Colorful, photogenic dishes optimized for social sharing. Group dining and experience emphasis.',
      visualTrends: {
        designPatterns: ['Social media optimized plating', 'Colorful presentations', 'Group dining scenarios', 'Trending challenges'],
        layoutStyles: ['Bright, saturated colors', 'Vertical mobile formats', 'Shareable moments'],
        contentFormats: { video: 80, static: 10, carousel: 7, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Viral Sensation', 'Must-Try Trend', 'Photo-Worthy Dishes', 'Share with Friends'],
        ctrPatterns: ['Social sharing incentives boost CTR by 52%', 'Trend-based messaging increases engagement'],
        engagementDrivers: ['Viral food challenges', 'Photo opportunities', 'Group experiences']
      },
      seasonalTrends: {
        peakSeasons: ['Chinese New Year', 'Summer festivals', 'Mid-Autumn Festival', 'Cherry blossom season'],
        timingRecommendations: 'Peak social hours: 7PM-10PM weekdays, 1PM-3PM and 7PM-11PM weekends',
        culturalInsights: ['Social media culture drives dining choices', 'Group dining traditions', 'Festival food significance']
      },
      pricingStrategy: {
        commonOffers: ['Group discounts', 'Social sharing rewards', 'Festival specials', 'Student promotions'],
        pricePositioning: 'Accessible with premium experiences',
        promotionalTactics: ['Social media contests', 'Influencer partnerships', 'Limited edition items']
      }
    }
  },
  "packaged-foods": {
    usa: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-packaged-usa-1.png', engagement: 'High', platform: 'Facebook', contentFormat: 'video', ctr: 4.1, engagementRate: 6.8 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-packaged-usa-2.png', engagement: 'Very High', platform: 'Instagram', contentFormat: 'carousel', ctr: 5.2, engagementRate: 8.4 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-packaged-usa-3.png', engagement: 'High', platform: 'TikTok', contentFormat: 'video', ctr: 4.7, engagementRate: 7.9 },
      ],
      colorPalette: ['#FF6347', '#32CD32', '#1E90FF', '#FFD700', '#8A2BE2'],
      copyTone: 'Convenience-focused, family-oriented, and benefit-driven. "Quick", "easy", "nutritious", "family-favorite".',
      regionalPreferences: 'Lifestyle integration shots, family moments, convenience emphasis. Clear nutrition and benefit callouts.',
      visualTrends: {
        designPatterns: ['Lifestyle integration', 'Family consumption', 'Nutrition highlights', 'Recipe suggestions'],
        layoutStyles: ['Clean product shots', 'Lifestyle backgrounds', 'Benefit callouts'],
        contentFormats: { video: 55, static: 30, carousel: 12, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Family Approved', 'Ready in Minutes', 'Real Ingredients', 'Tastes Like Homemade'],
        ctrPatterns: ['Convenience messaging increases CTR by 34%', 'Family appeal drives 29% higher engagement'],
        engagementDrivers: ['Recipe ideas', 'Convenience benefits', 'Family testimonials']
      },
      seasonalTrends: {
        peakSeasons: ['Back-to-school (Aug-Sep)', 'Holiday baking (Nov-Dec)', 'New Year health goals (Jan)'],
        timingRecommendations: 'Peak shopping times: 10AM-12PM, 3PM-6PM weekdays',
        culturalInsights: ['Busy lifestyle solutions valued', 'Family meal importance', 'Health-conscious convenience']
      },
      pricingStrategy: {
        commonOffers: ['Buy 2 get 1 free', 'Coupon promotions', 'Bulk discounts', 'Subscribe and save'],
        pricePositioning: 'Value-oriented with premium variants',
        promotionalTactics: ['Grocery store partnerships', 'Recipe collaborations', 'Seasonal promotions']
      }
    },
    europe: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-packaged-eu-1.png', engagement: 'High', platform: 'Instagram', contentFormat: 'static', ctr: 3.2, engagementRate: 5.6 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-packaged-eu-2.png', engagement: 'Medium', platform: 'Facebook', contentFormat: 'carousel', ctr: 2.9, engagementRate: 4.3 },
      ],
      colorPalette: ['#228B22', '#D2B48C', '#A0522D', '#F5F5DC', '#696969'],
      copyTone: 'Quality and sustainability-focused, transparent, and health-conscious. "Natural", "sustainable", "transparent", "responsible".',
      regionalPreferences: 'Natural ingredients emphasis, eco-friendly packaging, transparent sourcing. Clean, minimal aesthetics.',
      visualTrends: {
        designPatterns: ['Natural ingredients display', 'Eco-packaging highlights', 'Transparent sourcing', 'Minimal design'],
        layoutStyles: ['Earth-tone palettes', 'Clean typography', 'Sustainable messaging'],
        contentFormats: { video: 40, static: 45, carousel: 12, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Naturally Made', 'Sustainable Choice', 'Pure Ingredients', 'Ethically Sourced'],
        ctrPatterns: ['Sustainability claims boost CTR by 28%', 'Transparency messaging increases trust'],
        engagementDrivers: ['Ingredient transparency', 'Environmental impact', 'Health benefits']
      },
      seasonalTrends: {
        peakSeasons: ['Spring (fresh start)', 'Summer (outdoor eating)', 'Autumn (comfort foods)'],
        timingRecommendations: 'Shopping peak: 9AM-11AM, 4PM-7PM',
        culturalInsights: ['Environmental consciousness priority', 'Quality over convenience', 'Local preference when possible']
      },
      pricingStrategy: {
        commonOffers: ['Eco-friendly bundles', 'Loyalty programs', 'Seasonal varieties', 'Ethical premium'],
        pricePositioning: 'Quality-justified with sustainability premium',
        promotionalTactics: ['Environmental campaigns', 'Health education', 'Quality certifications']
      }
    },
    asia: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-packaged-asia-1.png', engagement: 'Very High', platform: 'TikTok', contentFormat: 'video', ctr: 5.8, engagementRate: 9.7 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-packaged-asia-2.png', engagement: 'High', platform: 'Instagram', contentFormat: 'ugc', ctr: 4.3, engagementRate: 7.2 },
      ],
      colorPalette: ['#FF1493', '#00CED1', '#FF8C00', '#9ACD32', '#8B008B'],
      copyTone: 'Innovation and flavor-focused, exciting, and variety-driven. "New flavor", "limited edition", "unique taste", "exciting".',
      regionalPreferences: 'Bold flavors, innovative combinations, limited editions. Colorful packaging and exciting presentations.',
      visualTrends: {
        designPatterns: ['Bold flavor presentations', 'Limited edition highlights', 'Color-rich packaging', 'Taste experience'],
        layoutStyles: ['Vibrant color schemes', 'Dynamic presentations', 'Flavor-focused'],
        contentFormats: { video: 75, static: 15, carousel: 8, ugc: 2 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['New Flavor Drop', 'Limited Edition', 'Unique Taste Experience', 'Must-Try Sensation'],
        ctrPatterns: ['Limited edition messaging increases urgency by 41%', 'Flavor innovation drives high engagement'],
        engagementDrivers: ['Flavor innovations', 'Limited availability', 'Taste experiments']
      },
      seasonalTrends: {
        peakSeasons: ['New Year launches', 'Summer festival flavors', 'Autumn harvest varieties', 'Holiday editions'],
        timingRecommendations: 'Peak engagement: 8PM-11PM weekdays, all day weekends',
        culturalInsights: ['Flavor adventure appetite', 'Seasonal variety expectations', 'Social sharing of new products']
      },
      pricingStrategy: {
        commonOffers: ['New product trials', 'Variety packs', 'Seasonal specials', 'Collector editions'],
        pricePositioning: 'Innovation-justified premium with accessible options',
        promotionalTactics: ['Launch campaigns', 'Taste challenges', 'Collector strategies']
      }
    }
  },
  "organic-healthy-foods": {
    usa: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-organic-usa-1.png', engagement: 'High', platform: 'Instagram', contentFormat: 'static', ctr: 4.4, engagementRate: 7.8 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-organic-usa-2.png', engagement: 'Very High', platform: 'Facebook', contentFormat: 'video', ctr: 5.1, engagementRate: 8.9 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-organic-usa-3.png', engagement: 'High', platform: 'TikTok', contentFormat: 'video', ctr: 4.6, engagementRate: 7.4 },
      ],
      colorPalette: ['#9ACD32', '#98FB98', '#F5DEB3', '#DEB887', '#556B2F'],
      copyTone: 'Health-focused, empowering, and science-backed. "Superfood", "clean", "nourish", "wellness", "natural".',
      regionalPreferences: 'Clean, natural aesthetics with wellness lifestyle integration. Scientific benefits and certifications important.',
      visualTrends: {
        designPatterns: ['Clean ingredient displays', 'Wellness lifestyle shots', 'Scientific backing', 'Natural environments'],
        layoutStyles: ['Clean, minimal design', 'Natural color palettes', 'Health-focused messaging'],
        contentFormats: { video: 50, static: 35, carousel: 12, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Superfood Power', 'Clean Nutrition', 'Wellness Made Simple', 'Naturally Nourishing'],
        ctrPatterns: ['Health benefit claims increase CTR by 38%', 'Clean/natural messaging drives engagement'],
        engagementDrivers: ['Health transformations', 'Scientific studies', 'Lifestyle integration']
      },
      seasonalTrends: {
        peakSeasons: ['New Year wellness (Jan)', 'Spring detox (Mar-Apr)', 'Summer body prep (May-Jun)'],
        timingRecommendations: 'Health-conscious hours: 6AM-9AM, 12PM-2PM, 6PM-8PM',
        culturalInsights: ['Wellness lifestyle growing', 'Scientific validation valued', 'Preventive health focus']
      },
      pricingStrategy: {
        commonOffers: ['Wellness bundles', 'Subscription discounts', 'First-time buyer deals', 'Health coach partnerships'],
        pricePositioning: 'Premium health investment positioning',
        promotionalTactics: ['Education-first marketing', 'Health professional endorsements', 'Transformation stories']
      }
    },
    europe: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-organic-eu-1.png', engagement: 'High', platform: 'Instagram', contentFormat: 'carousel', ctr: 3.8, engagementRate: 6.4 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-organic-eu-2.png', engagement: 'Medium', platform: 'Facebook', contentFormat: 'static', ctr: 3.1, engagementRate: 5.2 },
      ],
      colorPalette: ['#6B8E23', '#F0E68C', '#DDA0DD', '#F5F5F5', '#2F4F4F'],
      copyTone: 'Sustainability and ethics-focused, holistic, and community-oriented. "Sustainable", "ethical", "holistic", "community".',
      regionalPreferences: 'Strong environmental and ethical messaging. Farm-to-table aesthetics and community impact focus.',
      visualTrends: {
        designPatterns: ['Farm origins', 'Community impact', 'Environmental benefits', 'Holistic wellness'],
        layoutStyles: ['Natural, earthy aesthetics', 'Community-focused imagery', 'Sustainable messaging'],
        contentFormats: { video: 45, static: 40, carousel: 12, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Sustainably Grown', 'Ethical Choice', 'Community Supported', 'Planet-Friendly'],
        ctrPatterns: ['Environmental impact messaging increases CTR by 31%', 'Ethical sourcing drives loyalty'],
        engagementDrivers: ['Sustainability stories', 'Farmer partnerships', 'Environmental impact']
      },
      seasonalTrends: {
        peakSeasons: ['Spring growing season', 'Summer harvest', 'Autumn preservation', 'Winter wellness'],
        timingRecommendations: 'Conscious consumption hours: 8AM-10AM, 2PM-4PM',
        culturalInsights: ['Environmental activism strong', 'Local sourcing preferred', 'Holistic health approach']
      },
      pricingStrategy: {
        commonOffers: ['Seasonal harvest boxes', 'Community supported agriculture', 'Ethical premiums', 'Local partnerships'],
        pricePositioning: 'Values-based premium with community benefits',
        promotionalTactics: ['Impact storytelling', 'Farmer partnerships', 'Environmental campaigns']
      }
    },
    asia: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-organic-asia-1.png', engagement: 'High', platform: 'Instagram', contentFormat: 'video', ctr: 4.2, engagementRate: 7.1 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-organic-asia-2.png', engagement: 'High', platform: 'TikTok', contentFormat: 'ugc', ctr: 4.8, engagementRate: 8.3 },
      ],
      colorPalette: ['#00FA9A', '#FFE4B5', '#D8BFD8', '#F0FFFF', '#4682B4'],
      copyTone: 'Traditional wisdom meets modern science, balance-focused, and ancestral. "Ancient wisdom", "balanced", "traditional", "harmony".',
      regionalPreferences: 'Traditional health wisdom combined with modern benefits. Balance and harmony messaging resonates.',
      visualTrends: {
        designPatterns: ['Traditional ingredients', 'Modern presentations', 'Balance concepts', 'Ancestral wisdom'],
        layoutStyles: ['Harmonious color combinations', 'Traditional meets modern', 'Balance-focused'],
        contentFormats: { video: 60, static: 25, carousel: 12, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Ancient Wisdom', 'Balanced Living', 'Traditional Superfood', 'Harmony in Health'],
        ctrPatterns: ['Traditional wisdom messaging increases trust by 35%', 'Balance concepts resonate strongly'],
        engagementDrivers: ['Traditional knowledge', 'Modern validation', 'Balance achievement']
      },
      seasonalTrends: {
        peakSeasons: ['Chinese New Year health', 'Spring renewal', 'Summer cooling foods', 'Winter warming foods'],
        timingRecommendations: 'Health focus hours: 7AM-9AM, 1PM-3PM, 7PM-9PM',
        culturalInsights: ['Traditional medicine respect', 'Seasonal eating practices', 'Generational health wisdom']
      },
      pricingStrategy: {
        commonOffers: ['Traditional recipe bundles', 'Seasonal health packages', 'Wisdom-based premiums', 'Family health plans'],
        pricePositioning: 'Wisdom-justified premium with family benefits',
        promotionalTactics: ['Tradition storytelling', 'Health expert partnerships', 'Seasonal alignment']
      }
    }
  },
  "bakery-confectionery": {
    usa: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-bakery-usa-1.png', engagement: 'Very High', platform: 'Instagram', contentFormat: 'video', ctr: 5.9, engagementRate: 9.8 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-bakery-usa-2.png', engagement: 'High', platform: 'TikTok', contentFormat: 'video', ctr: 5.2, engagementRate: 8.7 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-bakery-usa-3.png', engagement: 'High', platform: 'Facebook', contentFormat: 'static', ctr: 4.1, engagementRate: 6.8 },
      ],
      colorPalette: ['#FF69B4', '#FFD700', '#FFA500', '#87CEEB', '#8B4513'],
      copyTone: 'Indulgent, celebratory, and emotion-driven. "Decadent", "irresistible", "celebrate", "treat yourself", "handcrafted".',
      regionalPreferences: 'Decadent visuals with rich textures, celebration moments, and indulgence messaging. Custom occasion focus.',
      visualTrends: {
        designPatterns: ['Rich texture close-ups', 'Celebration moments', 'Handcraft process', 'Indulgent presentations'],
        layoutStyles: ['Warm, inviting colors', 'Luxury presentations', 'Celebration contexts'],
        contentFormats: { video: 65, static: 25, carousel: 8, ugc: 2 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Handcrafted Daily', 'Celebration Ready', 'Irresistibly Fresh', 'Custom Creations'],
        ctrPatterns: ['Occasion-based messaging increases CTR by 42%', 'Handcraft emphasis drives premium perception'],
        engagementDrivers: ['Process videos', 'Celebration occasions', 'Custom options']
      },
      seasonalTrends: {
        peakSeasons: ['Holiday season (Nov-Dec)', 'Wedding season (May-Sep)', 'Valentine\'s Day (Feb)', 'Graduation season (May-Jun)'],
        timingRecommendations: 'Sweet cravings peak: 2PM-4PM, 8PM-10PM',
        culturalInsights: ['Celebration culture strong', 'Custom occasions important', 'Indulgence as self-care']
      },
      pricingStrategy: {
        commonOffers: ['Custom order discounts', 'Seasonal specials', 'Bulk celebration packages', 'Loyalty rewards'],
        pricePositioning: 'Premium artisan with accessible treats',
        promotionalTactics: ['Occasion marketing', 'Custom showcases', 'Behind-the-scenes content']
      }
    },
    europe: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-bakery-eu-1.png', engagement: 'High', platform: 'Instagram', contentFormat: 'static', ctr: 3.7, engagementRate: 6.1 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-bakery-eu-2.png', engagement: 'High', platform: 'Facebook', contentFormat: 'carousel', ctr: 3.3, engagementRate: 5.4 },
      ],
      colorPalette: ['#D2691E', '#F4A460', '#DDA0DD', '#F5F5DC', '#8B4513'],
      copyTone: 'Artisanal, heritage-focused, and craftsmanship-driven. "Traditional", "artisanal", "heritage recipe", "master baker".',
      regionalPreferences: 'Traditional techniques and heritage recipes emphasized. Artisanal quality and time-honored methods.',
      visualTrends: {
        designPatterns: ['Traditional techniques', 'Heritage presentations', 'Artisan processes', 'Quality ingredients'],
        layoutStyles: ['Classic, timeless design', 'Heritage aesthetics', 'Craftsmanship focus'],
        contentFormats: { video: 45, static: 40, carousel: 12, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Heritage Recipe', 'Artisan Crafted', 'Traditional Method', 'Master Baker\'s Choice'],
        ctrPatterns: ['Heritage messaging increases trust by 29%', 'Craftsmanship stories drive premium perception'],
        engagementDrivers: ['Traditional techniques', 'Quality ingredients', 'Heritage stories']
      },
      seasonalTrends: {
        peakSeasons: ['Christmas markets (Dec)', 'Easter traditions (Mar-Apr)', 'Summer café culture', 'Autumn harvest'],
        timingRecommendations: 'Traditional tea time: 3PM-5PM, morning: 8AM-10AM',
        culturalInsights: ['Café culture integral', 'Traditional celebrations important', 'Quality over novelty']
      },
      pricingStrategy: {
        commonOffers: ['Traditional recipe sets', 'Seasonal heritage items', 'Master class experiences', 'Quality guarantees'],
        pricePositioning: 'Heritage-justified premium with authentic value',
        promotionalTactics: ['Tradition storytelling', 'Master baker features', 'Quality education']
      }
    },
    asia: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-bakery-asia-1.png', engagement: 'Very High', platform: 'TikTok', contentFormat: 'video', ctr: 6.4, engagementRate: 11.2 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-bakery-asia-2.png', engagement: 'High', platform: 'Instagram', contentFormat: 'ugc', ctr: 5.1, engagementRate: 8.9 },
      ],
      colorPalette: ['#FFB6C1', '#98FB98', '#F0E68C', '#DDA0DD', '#FF1493'],
      copyTone: 'Kawaii-inspired, innovative, and photo-worthy. "Cute", "Instagrammable", "innovative", "unique", "adorable".',
      regionalPreferences: 'Cute, photogenic designs optimized for social sharing. Innovative flavors and Instagram-worthy presentations.',
      visualTrends: {
        designPatterns: ['Cute character designs', 'Instagram-worthy plating', 'Innovative presentations', 'Color-rich displays'],
        layoutStyles: ['Kawaii aesthetics', 'Social media optimized', 'Playful presentations'],
        contentFormats: { video: 80, static: 12, carousel: 6, ugc: 2 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Insta-Worthy Treats', 'Kawaii Creations', 'Photo-Perfect Sweets', 'Unique Flavors'],
        ctrPatterns: ['Photo appeal messaging increases shares by 48%', 'Cute factor drives high engagement'],
        engagementDrivers: ['Visual appeal', 'Unique presentations', 'Social sharing potential']
      },
      seasonalTrends: {
        peakSeasons: ['Cherry blossom season', 'Summer festivals', 'Christmas kawaii', 'New Year treats'],
        timingRecommendations: 'Photo-sharing peak: 2PM-4PM, 8PM-10PM',
        culturalInsights: ['Visual appeal paramount', 'Social sharing culture', 'Seasonal theme importance']
      },
      pricingStrategy: {
        commonOffers: ['Photo contest rewards', 'Limited kawaii editions', 'Social sharing discounts', 'Seasonal character themes'],
        pricePositioning: 'Experience-justified premium with Instagram value',
        promotionalTactics: ['Visual campaigns', 'Character collaborations', 'Social media challenges']
      }
    }
  },
  "regional-traditional-foods": {
    usa: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-regional-usa-1.png', engagement: 'High', platform: 'Facebook', contentFormat: 'video', ctr: 4.3, engagementRate: 7.2 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-regional-usa-2.png', engagement: 'High', platform: 'Instagram', contentFormat: 'static', ctr: 3.9, engagementRate: 6.5 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-regional-usa-3.png', engagement: 'Very High', platform: 'TikTok', contentFormat: 'ugc', ctr: 5.4, engagementRate: 9.1 },
      ],
      colorPalette: ['#8B4513', '#CD853F', '#F0E68C', '#B22222', '#2F4F4F'],
      copyTone: 'Nostalgic, authentic, and heritage-focused. "Authentic", "family recipe", "generations", "hometown", "traditional".',
      regionalPreferences: 'Regional authenticity and family traditions emphasized. Nostalgic storytelling and local pride important.',
      visualTrends: {
        designPatterns: ['Family tradition moments', 'Regional authenticity', 'Heritage cooking', 'Local pride'],
        layoutStyles: ['Warm, nostalgic colors', 'Family-focused imagery', 'Traditional presentations'],
        contentFormats: { video: 55, static: 30, carousel: 10, ugc: 5 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Grandma\'s Recipe', 'Hometown Authentic', 'Family Tradition', 'Regional Classic'],
        ctrPatterns: ['Family story messaging increases emotional connection by 36%', 'Regional pride drives loyalty'],
        engagementDrivers: ['Family stories', 'Regional authenticity', 'Traditional methods']
      },
      seasonalTrends: {
        peakSeasons: ['Thanksgiving (Nov)', 'Summer BBQ season', 'Regional festivals', 'Family reunion season'],
        timingRecommendations: 'Family meal times: 5PM-8PM, weekend: 12PM-3PM',
        culturalInsights: ['Family tradition important', 'Regional food pride', 'Nostalgic connections valued']
      },
      pricingStrategy: {
        commonOffers: ['Family meal packages', 'Regional specialty bundles', 'Traditional recipe sets', 'Heritage premiums'],
        pricePositioning: 'Authenticity-justified with family value',
        promotionalTactics: ['Story-driven marketing', 'Regional partnerships', 'Family testimonials']
      }
    },
    europe: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-regional-eu-1.png', engagement: 'High', platform: 'Instagram', contentFormat: 'carousel', ctr: 3.6, engagementRate: 5.9 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-regional-eu-2.png', engagement: 'Medium', platform: 'Facebook', contentFormat: 'static', ctr: 2.8, engagementRate: 4.7 },
      ],
      colorPalette: ['#8FBC8F', '#DEB887', '#F5DEB3', '#A0522D', '#2F4F4F'],
      copyTone: 'Cultural heritage and terroir-focused, sophisticated, and origin-driven. "Terroir", "heritage", "cultural", "authentic origin".',
      regionalPreferences: 'Strong emphasis on geographical origin, cultural significance, and protected designations. Terroir concept important.',
      visualTrends: {
        designPatterns: ['Geographic origin', 'Cultural contexts', 'Protected designations', 'Terroir expressions'],
        layoutStyles: ['Heritage color palettes', 'Cultural authenticity', 'Geographic pride'],
        contentFormats: { video: 40, static: 45, carousel: 12, ugc: 3 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Protected Origin', 'Cultural Heritage', 'Traditional Terroir', 'Authentic Region'],
        ctrPatterns: ['Origin certification increases trust by 33%', 'Cultural significance drives premium perception'],
        engagementDrivers: ['Geographic stories', 'Cultural significance', 'Traditional methods']
      },
      seasonalTrends: {
        peakSeasons: ['Harvest seasons by region', 'Cultural festivals', 'Christmas markets', 'Easter traditions'],
        timingRecommendations: 'Cultural meal times vary by region: 12PM-2PM, 7PM-9PM',
        culturalInsights: ['Geographic identity strong', 'Cultural food significance', 'Traditional methods preserved']
      },
      pricingStrategy: {
        commonOffers: ['Regional discovery sets', 'Cultural experience packages', 'Protected origin premiums', 'Heritage collections'],
        pricePositioning: 'Cultural heritage-justified premium',
        promotionalTactics: ['Cultural storytelling', 'Geographic partnerships', 'Heritage education']
      }
    },
    asia: {
      sampleAds: [
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-regional-asia-1.png', engagement: 'High', platform: 'Instagram', contentFormat: 'video', ctr: 4.7, engagementRate: 8.2 },
        { imageUrl: 'https://storage.googleapis.com/floot-prod-assets/food-regional-asia-2.png', engagement: 'Very High', platform: 'TikTok', contentFormat: 'ugc', ctr: 5.9, engagementRate: 10.3 },
      ],
      colorPalette: ['#DC143C', '#FFD700', '#228B22', '#FF4500', '#4169E1'],
      copyTone: 'Ancestral wisdom and festival-focused, celebratory, and generation-bridging. "Ancestral", "festival", "celebration", "generation".',
      regionalPreferences: 'Strong festival and celebration contexts. Ancestral wisdom and generational recipes highly valued.',
      visualTrends: {
        designPatterns: ['Festival celebrations', 'Ancestral wisdom', 'Generational cooking', 'Cultural ceremonies'],
        layoutStyles: ['Festive color schemes', 'Ceremonial presentations', 'Traditional contexts'],
        contentFormats: { video: 70, static: 20, carousel: 8, ugc: 2 }
      },
      copyPerformance: {
        topPerformingHeadlines: ['Ancestral Recipe', 'Festival Tradition', 'Generational Secret', 'Cultural Celebration'],
        ctrPatterns: ['Festival timing increases engagement by 44%', 'Generational stories create emotional bonds'],
        engagementDrivers: ['Festival connections', 'Ancestral stories', 'Cultural celebrations']
      },
      seasonalTrends: {
        peakSeasons: ['Chinese New Year', 'Mid-Autumn Festival', 'Dragon Boat Festival', 'Regional harvest festivals'],
        timingRecommendations: 'Festival preparation times, family gathering hours: 6PM-9PM',
        culturalInsights: ['Festival food central to culture', 'Generational recipe transmission', 'Celebratory food significance']
      },
      pricingStrategy: {
        commonOffers: ['Festival food packages', 'Ancestral recipe sets', 'Cultural celebration bundles', 'Generation-sharing meals'],
        pricePositioning: 'Cultural significance-justified premium',
        promotionalTactics: ['Festival timing', 'Cultural storytelling', 'Generational connections']
      }
    }
  }
};