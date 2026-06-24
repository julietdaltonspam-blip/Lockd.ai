"use client";

import { useState } from "react";
import { ArrowLeft, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { TryAnotherBar } from "./TryAnotherBar";
import type { Slide } from "@/types";

interface SlidesViewProps {
  data: Slide[];
  onTryAnother: () => void;
  content: string;
  uploadId: string;
}

export function SlidesView({ data, onTryAnother }: SlidesViewProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const slides = Array.isArray(data) ? data : [];
  const total = slides.length;
  const slide = slides[current];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-zinc-400"><ArrowLeft size={18} /></button>
        <div className="flex items-center gap-2"><span className="text-lg">📱</span><span className="font-bold text-blue-400">Slides Mode</span></div>
        <button className="text-zinc-400"><Share2 size={18} /></button>
      </div>
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${((current + 1) / total) * 100}%` }} />
          </div>
          <span className="text-xs text-zinc-500 font-mono">{current + 1}/{total}</span>
        </div>
        <div className="flex gap-0.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`flex-1 h-0.5 rounded-full transition-all ${i <= current ? "bg-blue-500" : "bg-zinc-800"}`} />
          ))}
        </div>
      </div>
      <div className="flex-1 px-4 pb-32">
        {slide && (
          <div className="w-full min-h-[60vh] rounded-2xl bg-zinc-900 border border-zinc-700 p-6 flex flex-col" key={current}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">Slide {current + 1}</span>
              <div className="w-8 h-1 bg-blue-500 rounded-full" />
            </div>
            <h2 className="text-xl font-black text-white mb-6 leading-tight">{slide.title}</h2>
            <ul className="space-y-3 flex-1">
              {slide.bullets?.map((b, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <p className="text-zinc-200 text-sm leading-relaxed">{b}</p>
                </li>
              ))}
            </ul>
            {slide.example && (
              <div className="mt-4 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40">
                <p className="text-xs text-blue-400 font-bold mb-1">EXAMPLE</p>
                <p className="text-sm text-zinc-300">{slide.example}</p>
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
              <p className="text-zinc-700 text-xs">made with Lockd.AI 🔒</p>
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0} className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center gap-2 text-zinc-300 font-medium text-sm disabled:opacity-30">
            <ChevronLeft size={18} />Previous
          </button>
          <button onClick={() => setCurrent(c => c + 1)} disabled={current === total - 1} className="flex-1 py-3 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center gap-2 text-blue-200 font-medium text-sm disabled:opacity-30">
            Next<ChevronRight size={18} />
          </button>
        </div>
      </div>
      <TryAnotherBar onTryAnother={onTryAnother} />
    </div>
  );
}
