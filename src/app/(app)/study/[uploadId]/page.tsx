"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { OutputFormat, GossipContent, PodcastContent, Slide, Flashcard, NotesContent } from "@/types";
import { GossipView } from "@/components/study/GossipView";
import { PodcastView } from "@/components/study/PodcastView";
import { SlidesView } from "@/components/study/SlidesView";
import { FlashcardsView } from "@/components/study/FlashcardsView";
import { NotesView } from "@/components/study/NotesView";
import { FormatPicker } from "@/components/study/FormatPicker";
import { AIChat } from "@/components/AIChat";

export default function StudyPage({ params }: { params: Promise<{ uploadId: string }> }) {
  const { uploadId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState(searchParams.get("content") || "");
  const [format, setFormat] = useState<OutputFormat | null>((searchParams.get("format") as OutputFormat) || null);
  const [generating, setGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [subject] = useState<string | undefined>();

  useEffect(() => {
    if (format && content && !generatedData) generateContent(format);
  }, []);

  async function generateContent(selectedFormat: OutputFormat) {
    setFormat(selectedFormat); setGenerating(true); setError("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, format: selectedFormat, uploadId, subject }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setGeneratedData(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong."); setFormat(null);
    } finally { setGenerating(false); }
  }

  if (generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-purple-900/30 animate-ping absolute inset-0" />
          <div className="w-24 h-24 rounded-full bg-purple-900/50 flex items-center justify-center relative animate-pulse-glow"><span className="text-4xl">✨</span></div>
        </div>
        <p className="text-white font-bold mb-2">Generating {format} mode...</p>
        <p className="text-zinc-400 text-sm">Gemini is working its magic</p>
      </div>
    );
  }

  if (!format || !generatedData) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="px-4 pt-12">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 mb-6"><ArrowLeft size={18} /><span className="text-sm">Back</span></button>
          {error && <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-sm">{error}</div>}
          {!content ? <div className="text-center py-12"><p className="text-zinc-400">No content found. Please upload something first.</p></div> : <FormatPicker onSelect={generateContent} />}
        </div>
      </div>
    );
  }

  const sharedProps = { onTryAnother: () => { setFormat(null); setGeneratedData(null); setError(""); }, content, uploadId };

  return (
    <div className="min-h-screen bg-zinc-950">
      {format === "gossip" && <GossipView data={generatedData as GossipContent} {...sharedProps} />}
      {format === "podcast" && <PodcastView data={generatedData as PodcastContent} {...sharedProps} />}
      {format === "slides" && <SlidesView data={generatedData as Slide[]} {...sharedProps} />}
      {format === "flashcards" && <FlashcardsView data={generatedData as Flashcard[]} {...sharedProps} />}
      {format === "notes" && <NotesView data={generatedData as NotesContent} {...sharedProps} />}
      <AIChat context={content} subject={subject} />
    </div>
  );
}
