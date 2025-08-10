import { schema, OutputType } from "./brands_POST.schema";
import { db } from "../helpers/db";
import superjson from 'superjson';
import { nanoid } from 'nanoid';
import { Selectable } from "kysely";
import { Brands } from "../helpers/schema";

export async function handle(request: Request): Promise<Response> {
  try {
    // Note: For file uploads, we'd typically use `request.formData()`.
    // However, the schema is defined as JSON with URLs.
    // This implementation assumes URLs are provided directly.
    // A real implementation would handle file uploads, store them (e.g., in S3),
    // and then save the URLs to the database.
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newBrand: Selectable<Brands> = await db
      .insertInto('brands')
      .values({
        id: nanoid(),
        name: input.name,
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        tone: input.tone,
        websiteUrl: input.websiteUrl,
        logoUrl: input.logoUrl,
        productImages: input.productImages,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify(newBrand satisfies OutputType), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}