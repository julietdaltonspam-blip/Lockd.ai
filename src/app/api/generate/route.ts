import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  generateGossipMode,
  generatePodcastMode,
  generateSlidesMode,
  generateFlashcards,
  generateNotes,
} from "@/lib/gemini";
import { saveGeneratedContent, addXP } from "@/lib/db";
import type { OutputFormat } from "@/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, format, uploadId, subject } = await req.json();

    if (!content || !format) {
      return NextResponse.json({ error: "Missing content or format" }, { status: 400 });
    }

    let rawResult: string;

    switch (format as OutputFormat) {
      case "gossip":
        rawResult = await generateGossipMode(content, subject);
        break;
      case "podcast":
        rawResult = await generatePodcastMode(content, subject);
        break;
      case "slides":
        rawResult = await generateSlidesMode(content, subject);
        break;
      case "flashcards":
        rawResult = await generateFlashcards(content, 15, subject);
        break;
      case "notes":
        rawResult = await generateNotes(content, subject);
        break;
      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const jsonMatch = rawResult.match(/```json\n?([\s\S]*?)\n?```/) ||
      rawResult.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(rawResult);

    if (uploadId) {
      await saveGeneratedContent(session.user.id, uploadId, format, JSON.stringify(parsed));
      await addXP(session.user.id, 10);
    }

    return NextResponse.json({ data: parsed });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
