import { schema, OutputType } from "./brands_GET.schema";
import { db } from "../helpers/db";
import superjson from 'superjson';

export async function handle(request: Request): Promise<Response> {
  try {
    // This endpoint doesn't require input validation as it's a simple GET all.
    // In a real app, you might add pagination or filtering based on query params.
    const brands = await db.selectFrom('brands').selectAll().orderBy('createdAt', 'desc').execute();

    return new Response(superjson.stringify(brands satisfies OutputType), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}