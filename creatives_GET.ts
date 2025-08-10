import { schema } from "./creatives_GET.schema";
import type { OutputType } from "./creatives_GET.schema";
import superjson from 'superjson';
import { db } from "../helpers/db";
import { PlatformTypeArrayValues } from "../helpers/schema";

export async function handle(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response(superjson.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const queryParams = {
      brandId: url.searchParams.get('brandId') || undefined,
      platform: url.searchParams.get('platform') || undefined,
      limit: url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined,
    };

    const validationResult = schema.safeParse(queryParams);

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.flatten());
      return new Response(superjson.stringify({ error: "Invalid query parameters.", details: validationResult.error.flatten().fieldErrors }), { status: 400 });
    }

    const { brandId, platform, limit } = validationResult.data;

    let query = db
      .selectFrom('generatedCreatives')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (brandId) {
      query = query.where('brandId', '=', brandId);
    }

    if (platform) {
      query = query.where('platform', '=', platform);
    }

    const creatives = await query.execute();

    const responsePayload: OutputType = creatives.map(creative => ({
      id: creative.id,
      brandId: creative.brandId,
      regionalProfileId: creative.regionalProfileId,
      platform: creative.platform,
      imageUrl: creative.imageUrl,
      copyText: creative.copyText,
      matchScore: creative.matchScore,
      createdAt: creative.createdAt,
      isManualUpload: creative.promptUsed === 'MANUAL_UPLOAD',
    }));

    return new Response(superjson.stringify(responsePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error fetching creatives:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching creatives.';
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}