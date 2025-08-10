import { schema } from "./upload-image_POST.schema";
import type { OutputType } from "./upload-image_POST.schema";
import superjson from 'superjson';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function handle(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(superjson.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return new Response(superjson.stringify({ error: 'No file uploaded or invalid form data.' }), { status: 400 });
    }

    // Server-side validation
    if (file.size > MAX_FILE_SIZE) {
      return new Response(superjson.stringify({ error: `File size should be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.` }), { status: 400 });
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return new Response(superjson.stringify({ error: `Invalid file type. Only ${ACCEPTED_IMAGE_TYPES.join(', ')} are accepted.` }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    const responsePayload: OutputType = { dataUrl };

    return new Response(superjson.stringify(responsePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during file upload.';
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}