import { NotAdminError, assertAdmin } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, saveImage } from "@/lib/db/images";
import { NextResponse } from "next/server";

// Photos are resized in the browser first, so they stay well under Vercel's 4.5 MB request limit.
export async function POST(request: Request) {
  try {
    await assertAdmin();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "invalid_image" }, { status: 400 });
    }
    const url = await saveImage(file.type, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof NotAdminError) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
