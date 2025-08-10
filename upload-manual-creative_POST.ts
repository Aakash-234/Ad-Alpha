import { schema } from "./upload-manual-creative_POST.schema";
import type { OutputType } from "./upload-manual-creative_POST.schema";
import superjson from 'superjson';
import { db } from "../helpers/db";
import { nanoid } from 'nanoid';
import { GeneratedCreatives } from "../helpers/schema";
import { Selectable } from "kysely";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function fileToDataUrl(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function handle(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(superjson.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const formData = await request.formData();
    
    const brandId = formData.get('brandId');
    const regionalProfileId = formData.get('regionalProfileId');
    const platform = formData.get('platform');
    const copyText = formData.get('copyText');
    const files = formData.getAll('files').filter((f): f is File => f instanceof File);

    // Validate form data using Zod schema
    const validationResult = schema.safeParse({
      brandId,
      regionalProfileId,
      platform,
      copyText,
      files,
    });

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.flatten());
      return new Response(superjson.stringify({ error: "Invalid input.", details: validationResult.error.flatten().fieldErrors }), { status: 400 });
    }

    const { data: validatedInput } = validationResult;

    // Check if brand and regional profile exist
    const brandExists = await db.selectFrom('brands').select('id').where('id', '=', validatedInput.brandId).executeTakeFirst();
    if (!brandExists) {
      return new Response(superjson.stringify({ error: "Brand not found" }), { status: 404 });
    }

    const regionalProfileExists = await db.selectFrom('regionalProfiles').select('id').where('id', '=', validatedInput.regionalProfileId).executeTakeFirst();
    if (!regionalProfileExists) {
      return new Response(superjson.stringify({ error: "Regional profile not found" }), { status: 404 });
    }

    const createdCreatives: Array<Selectable<GeneratedCreatives>> = [];

    for (const file of validatedInput.files) {
      // Convert file to data URL
      const imageUrl = await fileToDataUrl(file);

      // Create a record in the database for each image
      const newCreative = await db
        .insertInto('generatedCreatives')
        .values({
          id: nanoid(),
          brandId: validatedInput.brandId,
          regionalProfileId: validatedInput.regionalProfileId,
          platform: validatedInput.platform,
          imageUrl: imageUrl,
          copyText: validatedInput.copyText,
          promptUsed: "MANUAL_UPLOAD", // Flag to indicate manual upload
          matchScore: null, // Not applicable for manual uploads
          createdAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      
      createdCreatives.push(newCreative);
    }

    console.log(`Successfully uploaded ${createdCreatives.length} manual creatives for brand ${validatedInput.brandId}`);

    // Format response to match generate-creative endpoint structure
    const responsePayload: OutputType = createdCreatives.map(creative => ({
      ...creative,
      competitorInsights: null,
    }));

    return new Response(superjson.stringify(responsePayload), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error handling manual creative upload:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during file upload.';
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}