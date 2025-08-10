import { schema, OutputType } from "./scrape-brand-info_POST.schema";
import superjson from 'superjson';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { BrandTone, BrandToneArrayValues } from "../helpers/schema";

// Helper function to fetch content from a URL
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching URL ${url}:`, error);
    throw new Error(`Could not retrieve content from ${url}. The site may be down or blocking requests.`);
  }
}

// Helper function to resolve relative URLs to absolute URLs
function toAbsoluteUrl(base: string, relative: string): string | null {
  if (!relative) return null;
  try {
    return new URL(relative, base).href;
  } catch (e) {
    return null;
  }
}

// Helper function to extract colors from CSS text
function extractColorsFromCss(css: string): string[] {
  const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)|hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+\s*)?\)/g;
  const matches = css.match(colorRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

// Helper function to extract gradients from CSS
function extractGradientsFromCss(css: string): string[] {
  const gradientRegex = /linear-gradient\([^)]+\)|radial-gradient\([^)]+\)/g;
  const matches = css.match(gradientRegex) || [];
  return [...new Set(matches)];
}

// Helper function to extract fonts from CSS
function extractFontsFromCss(css: string): string[] {
  const fontRegex = /font-family\s*:\s*([^;}]+)/gi;
  const matches: string[] = [];
  let match;
  while ((match = fontRegex.exec(css)) !== null) {
    const fonts = match[1].split(',').map(f => f.trim().replace(/['"]/g, ''));
    matches.push(...fonts);
  }
  return [...new Set(matches)].filter(font => !font.includes('system') && !font.includes('sans-serif') && !font.includes('serif'));
}

// Helper function to analyze brand tone from content
function analyzeBrandTone(content: string): BrandTone | null {
  const text = content.toLowerCase();
  
  // Define keywords for each tone
  const toneKeywords = {
    luxury: ['premium', 'exclusive', 'elegant', 'sophisticated', 'luxury', 'finest', 'exquisite', 'crafted'],
    professional: ['professional', 'expertise', 'trusted', 'reliable', 'corporate', 'business', 'industry', 'solutions'],
    friendly: ['friendly', 'welcome', 'community', 'together', 'family', 'caring', 'warm', 'personal'],
    playful: ['fun', 'exciting', 'adventure', 'playful', 'amazing', 'awesome', 'vibrant', 'energetic'],
    casual: ['casual', 'easy', 'simple', 'everyday', 'relaxed', 'comfortable', 'laid-back'],
    authoritative: ['leader', 'authority', 'expert', 'proven', 'established', 'pioneer', 'innovative', 'cutting-edge']
  };
  
  const scores: Record<BrandTone, number> = {
    luxury: 0,
    professional: 0,
    friendly: 0,
    playful: 0,
    casual: 0,
    authoritative: 0
  };
  
  for (const [tone, keywords] of Object.entries(toneKeywords)) {
    for (const keyword of keywords) {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      scores[tone as BrandTone] += matches;
    }
  }
  
  const topTone = Object.entries(scores).reduce((a, b) => scores[a[0] as BrandTone] > scores[b[0] as BrandTone] ? a : b);
  return topTone[1] > 2 ? topTone[0] as BrandTone : null;
}

// Helper function to extract social media links
function extractSocialLinks($: cheerio.CheerioAPI, baseUrl: string) {
  const social = {
    facebook: null as string | null,
    twitter: null as string | null,
    instagram: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
    tiktok: null as string | null,
    other: [] as string[]
  };
  
  $('a[href*="facebook.com"], a[href*="fb.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !social.facebook) social.facebook = href;
  });
  
  $('a[href*="twitter.com"], a[href*="x.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !social.twitter) social.twitter = href;
  });
  
  $('a[href*="instagram.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !social.instagram) social.instagram = href;
  });
  
  $('a[href*="linkedin.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !social.linkedin) social.linkedin = href;
  });
  
  $('a[href*="youtube.com"], a[href*="youtu.be"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !social.youtube) social.youtube = href;
  });
  
  $('a[href*="tiktok.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !social.tiktok) social.tiktok = href;
  });
  
  return social;
}

// Helper function to extract pricing information
function extractPricing($: cheerio.CheerioAPI): string[] {
  const pricing: string[] = [];
  const priceSelectors = [
    '[class*="price"]',
    '[class*="cost"]',
    '[id*="price"]',
    'span:contains("$")',
    'div:contains("$")',
    '.price, .pricing, .cost'
  ];
  
  priceSelectors.forEach(selector => {
    $(selector).each((_, el) => {
      const text = $(el).text().trim();
      if (text.match(/\$[\d,]+(\.\d{2})?/)) {
        pricing.push(text);
      }
    });
  });
  
  return [...new Set(pricing)].slice(0, 10); // Limit to 10 unique prices
}

export async function handle(request: Request): Promise<Response> {
  const startTime = Date.now();
  
  try {
    const json = superjson.parse(await request.text());
    const { url } = schema.parse(json);
    const base = new URL(url);
    const baseUrl = `${base.protocol}//${base.hostname}`;

    const html = await fetchUrlContent(url);
    const $ = cheerio.load(html);

    // Count elements for performance metrics
    const imageCount = $('img').length;
    const linkCount = $('a').length;

    // 1. Extract Brand Name
    const brandName =
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="application-name"]').attr('content') ||
      $('meta[name="twitter:site"]').attr('content')?.replace('@', '') ||
      $('title').text().split('|')[0].split('-')[0].trim() ||
      $('h1').first().text().trim() ||
      '';

    // 2. Extract Description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    // 3. Extract Logos
    const logos = {
      primary: null as string | null,
      favicon: null as string | null,
      variations: [] as string[]
    };

    // Primary logo
    const logoSelectors = [
      'img[src*="logo"]',
      'img[alt*="logo" i]',
      'header img',
      'nav img',
      'a[href="/"] img',
      '.logo img'
    ];
    for (const selector of logoSelectors) {
      const src = $(selector).first().attr('src');
      if (src) {
        logos.primary = toAbsoluteUrl(url, src);
        if (logos.primary) break;
      }
    }

    // Favicon
    const faviconHref = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').first().attr('href');
    if (faviconHref) {
      logos.favicon = toAbsoluteUrl(url, faviconHref);
    }

    // Logo variations
    logoSelectors.forEach(selector => {
      $(selector).each((_, el) => {
        const src = $(el).attr('src');
        if (src) {
          const absoluteUrl = toAbsoluteUrl(url, src);
          if (absoluteUrl && absoluteUrl !== logos.primary) {
            logos.variations.push(absoluteUrl);
          }
        }
      });
    });
    logos.variations = [...new Set(logos.variations)].slice(0, 5);

    // 4. Extract Colors and Fonts
    let allCss = '';
    let allColors: string[] = [];
    let allGradients: string[] = [];
    let allFonts: string[] = [];

    // From inline styles
    const inlineStyles = $('[style]').map((_, el) => $(el).attr('style')).get().join(' ');
    allCss += inlineStyles;
    allColors.push(...extractColorsFromCss(inlineStyles));
    allGradients.push(...extractGradientsFromCss(inlineStyles));
    allFonts.push(...extractFontsFromCss(inlineStyles));

    // From stylesheets
    const stylesheetPromises: Promise<void>[] = [];
    $('link[rel="stylesheet"]').slice(0, 5).each((i, el) => { // Limit to 5 stylesheets
      const href = $(el).attr('href');
      if (href) {
        const stylesheetUrl = toAbsoluteUrl(url, href);
        if (stylesheetUrl && !stylesheetUrl.includes('fonts.googleapis.com')) {
          stylesheetPromises.push(
            fetchUrlContent(stylesheetUrl)
              .then(css => {
                allCss += css;
                allColors.push(...extractColorsFromCss(css));
                allGradients.push(...extractGradientsFromCss(css));
                allFonts.push(...extractFontsFromCss(css));
              })
              .catch(err => console.warn(`Could not fetch stylesheet ${stylesheetUrl}:`, err))
          );
        }
      }
    });
    await Promise.all(stylesheetPromises);

    // Process colors
    const colorCounts: Record<string, number> = {};
    allColors.forEach(color => {
      if (!/^(#000|#000000|#fff|#ffffff|#888|#888888|#ccc|#cccccc|rgba?\(0,\s*0,\s*0|rgba?\(255,\s*255,\s*255)/.test(color)) {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }
    });

    const sortedColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([color]) => color);

    const colors = {
      primary: sortedColors[0] || '#000000',
      secondary: sortedColors[1] || null,
      palette: sortedColors.slice(0, 10),
      gradients: [...new Set(allGradients)].slice(0, 5)
    };

    // Process fonts
    const fonts = {
      primary: null as string | null,
      headings: null as string | null,
      body: null as string | null,
      detected: [...new Set(allFonts)].slice(0, 10)
    };

    // Try to detect primary font from h1, h2
    const headingFont = $('h1, h2').first().css('font-family');
    if (headingFont) fonts.headings = headingFont.split(',')[0].replace(/['"]/g, '').trim();

    const bodyFont = $('body, p').first().css('font-family');
    if (bodyFont) fonts.body = bodyFont.split(',')[0].replace(/['"]/g, '').trim();

    fonts.primary = fonts.headings || fonts.body || fonts.detected[0] || null;

    // 5. Extract Content for Analysis
    const allText = $('body').text();
    const tone = analyzeBrandTone(allText);

    const headings = $('h1, h2, h3').map((_, el) => $(el).text().trim()).get().slice(0, 10);
    const taglines = $('[class*="tagline"], [class*="slogan"], [class*="motto"]').map((_, el) => $(el).text().trim()).get();
    
    // Extract key messages from prominent text
    const keyMessages: string[] = [];
    $('h1, h2, .hero-text, .banner-text, .intro-text').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 10 && text.length < 200) {
        keyMessages.push(text);
      }
    });

    const content = {
      keyMessages: [...new Set(keyMessages)].slice(0, 5),
      valuePropositions: [...new Set(keyMessages.filter(msg => msg.length > 20))].slice(0, 3),
      taglines: [...new Set(taglines)].slice(0, 3),
      keywords: [...new Set(allText.toLowerCase().split(/\W+/).filter(word => word.length > 3))].slice(0, 20),
      headings: [...new Set(headings.filter(h => h.length > 0))].slice(0, 10)
    };

    // 6. Extract Product Information
    const productImages: string[] = [];
    $('img[src*="product"], img[alt*="product" i], .product img, .shop img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) {
        const absoluteUrl = toAbsoluteUrl(url, src);
        if (absoluteUrl) productImages.push(absoluteUrl);
      }
    });

    const productCategories = $('[class*="category"], [class*="collection"]').map((_, el) => $(el).text().trim()).get();
    const productDescriptions = $('[class*="product-description"], .product p').map((_, el) => $(el).text().trim()).get().slice(0, 5);
    const pricing = extractPricing($);

    const products = {
      images: [...new Set(productImages)].slice(0, 10),
      categories: [...new Set(productCategories.filter(cat => cat.length > 0))].slice(0, 5),
      descriptions: [...new Set(productDescriptions.filter(desc => desc.length > 10))].slice(0, 5),
      pricing: [...new Set(pricing)]
    };

    // 7. Extract Social Media and Contact
    const social = extractSocialLinks($, baseUrl);

    const contact = {
      email: null as string | null,
      phone: null as string | null,
      address: null as string | null
    };

    // Extract contact information
    const emailMatch = allText.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) contact.email = emailMatch[0];

    const phoneMatch = allText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) contact.phone = phoneMatch[0];

    // 8. Extract SEO and Meta Information
    const ogTags: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr('property')?.replace('og:', '');
      const content = $(el).attr('content');
      if (property && content) ogTags[property] = content;
    });

    const twitterTags: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const name = $(el).attr('name')?.replace('twitter:', '');
      const content = $(el).attr('content');
      if (name && content) twitterTags[name] = content;
    });

    // Extract structured data
    const structuredData: Record<string, any>[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || '');
        structuredData.push(data);
      } catch (e) {
        // Invalid JSON, skip
      }
    });

    const seo = {
      title: $('title').text() || null,
      metaDescription: $('meta[name="description"]').attr('content') || null,
      keywords: $('meta[name="keywords"]').attr('content') || null,
      ogTags,
      twitterTags,
      structuredData: structuredData.slice(0, 5)
    };

    // 9. Extract Visual Assets
    const heroImages: string[] = [];
    const bannerImages: string[] = [];
    const backgroundImages: string[] = [];

    $('[class*="hero"] img, [class*="banner"] img, [id*="hero"] img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) {
        const absoluteUrl = toAbsoluteUrl(url, src);
        if (absoluteUrl) heroImages.push(absoluteUrl);
      }
    });

    $('[style*="background-image"]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const matches = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
      if (matches && matches[1]) {
        const absoluteUrl = toAbsoluteUrl(url, matches[1]);
        if (absoluteUrl) backgroundImages.push(absoluteUrl);
      }
    });

    const iconography: string[] = [];
    $('svg, img[src*="icon"], .icon img').each((_, el) => {
      if ($(el).is('svg')) {
        // For SVG, we'd need to serialize it, but for now just note it exists
        iconography.push('svg-icon');
      } else {
        const src = $(el).attr('src');
        if (src) {
          const absoluteUrl = toAbsoluteUrl(url, src);
          if (absoluteUrl) iconography.push(absoluteUrl);
        }
      }
    });

    const visuals = {
      heroImages: [...new Set(heroImages)].slice(0, 5),
      bannerImages: [...new Set(bannerImages)].slice(0, 5),
      backgroundImages: [...new Set(backgroundImages)].slice(0, 5),
      productPhotos: products.images,
      iconography: [...new Set(iconography)].slice(0, 10)
    };

    // 10. Technical Information
    const technologies: string[] = [];
    
    // Detect common technologies
    if ($('script[src*="react"]').length > 0) technologies.push('React');
    if ($('script[src*="vue"]').length > 0) technologies.push('Vue');
    if ($('script[src*="angular"]').length > 0) technologies.push('Angular');
    if ($('script[src*="jquery"]').length > 0) technologies.push('jQuery');
    if ($('script[src*="bootstrap"]').length > 0) technologies.push('Bootstrap');
    if ($('[class*="wp-"]').length > 0) technologies.push('WordPress');
    if ($('script[src*="shopify"]').length > 0) technologies.push('Shopify');

    const technical = {
      websiteUrl: url,
      lastScraped: new Date().toISOString(),
      technologies,
      performance: {
        loadTime: Date.now() - startTime,
        imageCount,
        linkCount
      }
    };

    const output: OutputType = {
      name: brandName,
      description,
      logos,
      colors,
      fonts,
      tone,
      products,
      content,
      social,
      contact,
      seo,
      visuals,
      technical
    };

    console.log(`Successfully scraped comprehensive brand data for ${brandName} in ${Date.now() - startTime}ms`);

    return new Response(superjson.stringify(output), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error scraping brand info:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during scraping.";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}