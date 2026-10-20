import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const postId = (formData.get("postId") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Validate mime type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file format: ${file.type}. Please upload JPG, PNG, WEBP, GIF, or SVG.` },
        { status: 400 }
      );
    }

    // Size limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save directly into PostgreSQL
    const image = await prisma.blogImage.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        data: buffer,
        size: file.size,
        altText: altText || null,
        caption: caption || null,
        postId: postId || null,
      },
    });

    const publicUrl = `/api/images/${image.id}`;

    return NextResponse.json({
      success: true,
      id: image.id,
      url: publicUrl,
      filename: image.filename,
      size: image.size,
      mimeType: image.mimeType,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image into database." },
      { status: 500 }
    );
  }
}
