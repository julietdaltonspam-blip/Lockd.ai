import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    const videoId = videoIdMatch[1];
    const { YoutubeTranscript } = await import("youtube-transcript");
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const text = transcript.map((t: { text: string }) => t.text).join(" ").replace(/\[.*?\]/g, "").trim();
    if (!text) return NextResponse.json({ error: "No transcript available" }, { status: 400 });
    let title = "YouTube Video";
    try {
      const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      title = (await r.json()).title || title;
    } catch {}
    return NextResponse.json({ transcript: text, title, videoId });
  } catch (error) {
    console.error("YouTube error:", error);
    return NextResponse.json({ error: "Could not fetch transcript." }, { status: 500 });
  }
}
