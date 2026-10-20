import { getImage } from "@/lib/db/images";

export async function GET(_request: Request, { params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params;
  try {
    const image = await getImage(imageId);
    if (!image) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(Buffer.from(image.data), {
      headers: {
        "Content-Type": image.content_type,
        // Each upload gets a new id, so the bytes behind a URL never change
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Could not load image:", error);
    return new Response("Unavailable", { status: 503 });
  }
}
