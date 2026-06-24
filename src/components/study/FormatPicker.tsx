"use client";

import type { OutputFormat } from "@/types";

const FORMATS = [
  {
    id: "gossip" as OutputFormat,
    emoji: "🗣️",
    label: "Gossip Mode",
    tagline: "spill the tea on your notes",
    color: "#ec4899",
    bg: "from-pink-950/40 to-zinc-900",
    border: "border-pink-800/40 hover:border-pink-600",
    preview: (
      <div className="space-y-1 text-xs">
        <div className="flex gap-1"><span className="text-pink-400 font-bold">Mia:</span><span className="text-zinc-300">omg did u hear about mitosis??</span></div>
        <div className="flex gap-1"><span className="text-purple-400 font-bold">Zoe:</span><span className="text-zinc-300">no spill!!! 👀</span></div>
      </div>
    ),
  },
  {
    id: "podcast" as OutputFormat,
    emoji: "🎙️",
    label: "Podcast Mode",
    tagline: "chill lo-fi breakdown",
    color: "#f59e0b",
    bg: "from-amber-950/40 to-zinc-900",
    border: "border-amber-800/40 hover:border-amber-600",
    preview: (
      <div className="space-y-1 text-xs">
        <div className="flex gap-1"><span className="text-amber-400 font-bold">Alex:</span><span className="text-zinc-300">So today we're diving into...</span></div>
      </div>
    ),
  },
  {
    id: "slides" as OutputFormat,
    emoji: "📱",
    label: "Slides Mode",
    tagline: "clean & quick",
    color: "#3b82f6",
    bg: "from-blue-950/40 to-zinc-900",
    border: "border-blue-800/40 hover:border-blue-600",
    preview: (
      <div className="space-y-1 text-xs">
        <div className="h-2 bg-blue-500/60 rounded w-3/4" />
        <div className="h-1 bg-zinc-600 rounded w-full" />
        <div className="h-1 bg-zinc-600 rounded w-5/6" />
      </div>
    ),
  },
  {
    id: "flashcards" as OutputFormat,
    emoji: "🃏",
    label: "Flashcards",
    tagline: "quiz yourself",
    color: "#22c55e",
    bg: "from-green-950/40 to-zinc-900",
    border: "border-green-800/40 hover:border-green-600",
    preview: (
      <div className="flex items-center justify-center">
        <div className="w-16 h-10 rounded-lg border border-green-700/50 bg-green-950/30 flex items-center justify-center text-[10px] text-green-300 font-medium">Q: What is...</div>
      </div>
    ),
  },
  {
    id: "notes" as OutputFormat,
    emoji: "📝",
    label: "Notes",
    tagline: "clean summary",
    color: "#a855f7",
    bg: "from-purple-950/40 to-zinc-900",
    border: "border-purple-800/40 hover:border-purple-600",
    preview: (
      <div className="space-y-1 text-xs">
        <div className="text-purple-400 font-bold text-[10px]">KEY CONCEPTS</div>
        <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-purple-400" /><div className="h-1 bg-zinc-600 rounded w-3/4" /></div>
      </div>
    ),
  },
];

interface FormatPickerProps {
  onSelect: (format: OutputFormat) => void;
}

export function FormatPicker({ onSelect }: FormatPickerProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1">How do you want to study? ✨</h1>
        <p className="text-zinc-400 text-sm">Pick a format — your content is ready to go.</p>
      </div>
      <div className="space-y-3">
        {FORMATS.map(f => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`w-full p-4 rounded-2xl bg-gradient-to-r ${f.bg} border ${f.border} text-left transition-all active:scale-[0.98] hover:shadow-lg`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-black text-base" style={{ color: f.color }}>{f.label}</p>
                  <span className="text-zinc-500 text-xs italic">{f.tagline}</span>
                </div>
                <div className="mt-2 p-2 rounded-lg bg-black/20">{f.preview}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
