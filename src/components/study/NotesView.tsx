"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { TryAnotherBar } from "./TryAnotherBar";
import type { NotesContent } from "@/types";

interface NotesViewProps {
  data: NotesContent;
  onTryAnother: () => void;
  content: string;
  uploadId: string;
}

export function NotesView({ data, onTryAnother }: NotesViewProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 pb-32">
      <div className="sticky top-0 z-30 glass border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-zinc-400"><ArrowLeft size={18} /></button>
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <span className="font-bold text-purple-400">Notes</span>
        </div>
        <button className="text-zinc-400"><Share2 size={18} /></button>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-black text-white leading-tight">{data.title}</h1>

        {data.keyConcepts?.length > 0 && (
          <div>
            <h2 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-3">Key Concepts</h2>
            <div className="flex flex-wrap gap-2">
              {data.keyConcepts.map((concept, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-purple-950/50 border border-purple-800/50 text-purple-200 text-sm font-medium">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.summary && (
          <div>
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Summary</h2>
            <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</div>
          </div>
        )}

        {data.takeaways?.length > 0 && (
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700">
            <h2 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-3">Key Takeaways</h2>
            <ul className="space-y-2">
              {data.takeaways.map((t, i) => (
                <li key={i} className="flex gap-3 items-start text-sm text-zinc-300">
                  <span className="text-purple-400 font-black flex-shrink-0 mt-0.5">{i + 1}.</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center py-4">
          <p className="text-zinc-700 text-xs">made with Lockd.AI 🔒</p>
        </div>
      </div>

      <TryAnotherBar onTryAnother={onTryAnother} />
    </div>
  );
}
