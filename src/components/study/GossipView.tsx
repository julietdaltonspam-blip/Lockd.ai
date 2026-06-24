"use client";

import { useRef } from "react";
import { Share2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { TryAnotherBar } from "./TryAnotherBar";
import type { GossipContent } from "@/types";

interface GossipViewProps {
  data: GossipContent;
  onTryAnother: () => void;
  content: string;
  uploadId: string;
}

export function GossipView({ data, onTryAnother }: GossipViewProps) {
  const router = useRouter();
  const chatRef = useRef<HTMLDivElement>(null);

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "Study notes — Lockd.AI",
        text: data.messages.slice(0, 3).map(m => `${m.speaker}: ${m.text}`).join("\n"),
      });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-32">
      <div className="sticky top-0 z-30 glass border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">🗣️</span>
          <span className="font-bold text-pink-400">Gossip Mode</span>
        </div>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200">
          <Share2 size={18} />
        </button>
      </div>

      <div ref={chatRef} className="px-4 py-4 space-y-3 max-w-lg mx-auto">
        {data.messages?.map((msg, i) => {
          const isMia = msg.speaker === "Mia";
          return (
            <div key={i} className={`flex gap-2 ${isMia ? "flex-row" : "flex-row-reverse"}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-auto"
                style={{ backgroundColor: isMia ? "#ec489920" : "#a855f720", border: `1px solid ${isMia ? "#ec4899" : "#a855f7"}40` }}
              >
                <span style={{ color: isMia ? "#ec4899" : "#a855f7" }}>{msg.speaker[0]}</span>
              </div>
              <div className="max-w-[78%]">
                <p className="text-xs font-bold mb-1" style={{ color: isMia ? "#ec4899" : "#a855f7" }}>{msg.speaker}</p>
                <div
                  className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                  style={{
                    backgroundColor: isMia ? "#ec489915" : "#a855f715",
                    border: `1px solid ${isMia ? "#ec4899" : "#a855f7"}20`,
                    borderBottomLeftRadius: isMia ? 4 : 16,
                    borderBottomRightRadius: isMia ? 16 : 4,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {data.receipts?.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-700">
            <h3 className="font-black text-base mb-3">Receipts 🧾</h3>
            <p className="text-zinc-500 text-xs mb-3">The actual key facts, no cap:</p>
            <ul className="space-y-2">
              {data.receipts.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-300">
                  <span className="text-pink-400 flex-shrink-0">•</span>
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-zinc-700 text-center">
              <p className="text-zinc-600 text-xs">made with Lockd.AI 🔒</p>
            </div>
          </div>
        )}
      </div>

      <TryAnotherBar onTryAnother={onTryAnother} />
    </div>
  );
}
