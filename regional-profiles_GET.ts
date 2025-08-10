import { schema, OutputType } from "./regional-profiles_GET.schema";
import { db } from "../helpers/db";
import superjson from 'superjson';

export async function handle(request: Request): Promise<Response> {
  try {
    const regionalProfiles = await db.selectFrom('regionalProfiles').selectAll().orderBy('name', 'asc').execute();

    return new Response(superjson.stringify(regionalProfiles satisfies OutputType), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching regional profiles:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}