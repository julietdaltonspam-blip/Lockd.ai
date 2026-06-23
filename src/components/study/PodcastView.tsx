"use client";

import { useState } from "react";
import { ArrowLeft, Share2, Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";
import { TryAnotherBar } from "./TryAnotherBar";
import type { PodcastContent, AmbientMode } from "@/types";

const AMBIENTS: { id: AmbientMode; label: string; emoji: string; cls: string }[] = [
  { id: "cafe", label: "Rainy Café", emoji: "☕", cls: "ambient-cafe" },
  { id: "fireplace", label: "Fireplace", emoji: "🔥", cls: "ambient-fireplace" },
  { id: "city", label: "Lo-fi City", emoji: "🌙", cls: "ambient-city" },
  { id: "library", label: "Library", emoji: "📚", cls: "ambient-library" },
  { id: "rain", label: "Rain", emoji: "🌧️", cls: "ambient-rain" },
];

interface PodcastViewProps {
  data: PodcastContent;
  onTryAnother: () => void;
  content: string;
  uploadId: string;
}

export function PodcastView({ data, onTryAnother }: PodcastViewProps) {
  const router = useRouter();
  const [ambient, setAmbient] = useState<AmbientMode>("cafe");
  const [playing, setPlaying] = useState(false);
  const currentAmbient = AMBIENTS.find(a => a.id === ambient)!;

  return (
    <div className={`min-h-screen pb-32 relative transition-all duration-700 ${currentAmbient.cls}`}>
      <div className="sticky top-0 z-30 glass border-b border-zinc-800/50 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-zinc-400"><ArrowLeft size={18} /></button>
        <div className="flex items-center gap-2">
          <span className="text-lg">🎤</span>
          <span className="font-bold text-amber-400">Podcast Mode</span>
        </div>
        <button className="text-zinc-400"><Share2 size={18} /></button>
      </div>

      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {AMBIENTS.map(a => (
          <button
            key={a.id}
            onClick={() => setAmbient(a.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              ambient === a.id
                ? "bg-amber-900/60 border border-amber-600/60 text-amber-300"
                : "bg-zinc-800/50 border border-zinc-700 text-zinc-400"
            }`}
          >
            <span>{a.emoji}</span><span>{a.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-700/50">
          <button
            onClick={() => setPlaying(!playing)}
            className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0"
          >
            {playing ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
          </button>
          <div className="flex-1">
            <p className="font-bold text-sm">Podcast Episode</p>
            <p className="text-zinc-400 text-xs">Alex & Jordan · {currentAmbient.emoji} {currentAmbient.label}</p>
          </div>
          <div className="flex gap-0.5 items-end">
            {[3,5,4,7,5,4,3,6,5,4].map((h, i) => (
              <div key={i} className="w-1 bg-amber-500 rounded-full" style={{ height: playing ? h * 3 : 3 }} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {data.segments?.map((seg, i) => {
          const isAlex = seg.speaker === "Alex";
          return (
            <div key={i}>
              {seg.timestamp && (
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-zinc-600 text-xs font-mono">{seg.timestamp}</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>
              )}
              <div className={`flex gap-3 ${isAlex ? "" : "flex-row-reverse"}`}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-1"
                  style={{ backgroundColor: isAlex ? "#f59e0b20" : "#a855f720" }}
                >
                  <span style={{ color: isAlex ? "#f59e0b" : "#a855f7" }}>{seg.speaker[0]}</span>
                </div>
                <div className={`flex-1 ${isAlex ? "" : "text-right"}`}>
                  <p className="text-xs font-bold mb-1" style={{ color: isAlex ? "#f59e0b" : "#a855f7" }}>{seg.speaker}</p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{seg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="py-4 text-center text-zinc-600 text-xs">made with Lockd.AI 🔒</div>
      </div>

      <TryAnotherBar onTryAnother={onTryAnother} />
    </div>
  );
}
