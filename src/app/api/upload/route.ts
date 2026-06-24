import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractTextFromImage } from "@/lib/gemini";
import { createUpload, updateUserStreak } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const type = formData.get("type") as string;
    const folderId = formData.get("folderId") as string | null;
    const title = formData.get("title") as string || "Untitled";

    let content = "";
    let contentType: "text" | "pdf" | "youtube" | "audio" | "image" = "text";
    let sourceUrl: string | undefined;

    if (type === "text") {
      content = formData.get("content") as string;
      contentType = "text";
    } else if (type === "image") {
      const file = formData.get("file") as File;
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = file.type || "image/jpeg";

      content = await extractTextFromImage(base64, mimeType);
      contentType = "image";
    } else if (type === "pdf") {
      const file = formData.get("file") as File;
      content = `PDF content from: ${file.name}. Please note that PDF parsing requires additional setup. The content should be extracted server-side.`;
      contentType = "pdf";
    } else {
      return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
    }

    const upload = await createUpload(
      session.user.id,
      title,
      contentType,
      content,
      folderId || undefined,
      sourceUrl
    );

    await updateUserStreak(session.user.id);

    return NextResponse.json({ upload, content });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
