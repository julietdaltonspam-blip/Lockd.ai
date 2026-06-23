"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Share2, Check, X, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { TryAnotherBar } from "./TryAnotherBar";
import type { Flashcard } from "@/types";

interface FlashcardsViewProps {
  data: Flashcard[];
  onTryAnother: () => void;
  content: string;
  uploadId: string;
}

export function FlashcardsView({ data, onTryAnother }: FlashcardsViewProps) {
  const router = useRouter();
  const cards = Array.isArray(data) ? data : [];
  const [queue, setQueue] = useState<Flashcard[]>(cards);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<boolean[]>([]);
  const [wrong, setWrong] = useState<Flashcard[]>([]);
  const [done, setDone] = useState(false);

  const card = queue[current];
  const total = queue.length;

  function answer(correct: boolean) {
    if (!flipped) { setFlipped(true); return; }
    const newKnown = [...known, correct];
    setKnown(newKnown);
    if (!correct) setWrong(w => [...w, card]);

    if (current + 1 >= total) {
      const finalWrong = !correct ? [...wrong, card] : wrong;
      if (finalWrong.length > 0) {
        setTimeout(() => { setQueue(finalWrong); setCurrent(0); setFlipped(false); setKnown([]); setWrong([]); }, 300);
      } else {
        setDone(true);
      }
    } else {
      setCurrent(c => c + 1);
      setFlipped(false);
    }
  }

  function restart() { setQueue(cards); setCurrent(0); setFlipped(false); setKnown([]); setWrong([]); setDone(false); }

  if (done) {
    const correctCount = known.filter(Boolean).length;
    const percentage = Math.round((correctCount / known.length) * 100);
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">{percentage >= 80 ? "🏆" : percentage >= 60 ? "💪" : "📚"}</div>
        <h2 className="text-2xl font-black mb-2">{percentage >= 80 ? "Locked in! 🔒" : percentage >= 60 ? "Getting there!" : "Keep studying!"}</h2>
        <p className="text-zinc-400 mb-6">{correctCount}/{known.length} cards correct</p>
        <div className="w-full max-w-xs mb-8">
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: percentage >= 80 ? "#22c55e" : percentage >= 60 ? "#f59e0b" : "#ef4444" }} />
          </div>
          <p className="text-sm text-zinc-400 mt-2">{percentage}% accuracy</p>
        </div>
        {wrong.length > 0 && (
          <div className="w-full max-w-xs mb-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-700 text-left">
            <p className="font-bold text-sm mb-2 text-red-400">Weak spots — study these:</p>
            <ul className="space-y-1">{wrong.map((w, i) => <li key={i} className="text-xs text-zinc-400">• {w.front}</li>)}</ul>
          </div>
        )}
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={restart} className="flex-1 py-3 rounded-xl bg-zinc-800 font-bold text-sm flex items-center justify-center gap-2"><RotateCcw size={16} />Try again</button>
          <button onClick={onTryAnother} className="flex-1 py-3 rounded-xl btn-purple text-white font-bold text-sm">New format</button>
        </div>
        <p className="text-zinc-700 text-xs mt-6">made with Lockd.AI 🔒</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-zinc-400"><ArrowLeft size={18} /></button>
        <div className="flex items-center gap-2"><span className="text-lg">🃏</span><span className="font-bold text-green-400">Flashcards</span></div>
        <button className="text-zinc-400"><Share2 size={18} /></button>
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${(current / total) * 100}%` }} />
          </div>
          <span className="text-xs text-zinc-500 font-mono">{current + 1}/{total}</span>
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col items-center pb-32">
        <div className="w-full max-w-sm perspective-1000 cursor-pointer" style={{ height: "55vw", maxHeight: 300 }} onClick={() => setFlipped(f => !f)}>
          <div className="w-full h-full preserve-3d transition-all duration-500 relative" style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
            <div className="absolute inset-0 backface-hidden rounded-3xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-4">QUESTION</p>
              <p className="text-base font-bold text-white leading-relaxed">{card?.front}</p>
              <p className="text-xs text-zinc-600 mt-6">tap to flip</p>
            </div>
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl flex flex-col items-center justify-center p-6 text-center" style={{ background: "linear-gradient(135deg, #14532d20 0%, #18181b 100%)", border: "1px solid #16a34a40" }}>
              <p className="text-xs text-green-500 font-bold uppercase tracking-wider mb-4">ANSWER</p>
              <p className="text-sm text-zinc-200 leading-relaxed">{card?.back}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6 w-full max-w-sm">
          <button onClick={() => answer(false)} className="flex-1 py-4 rounded-2xl bg-red-950/50 border border-red-800/50 flex items-center justify-center gap-2 text-red-400 font-bold active:scale-[0.97] transition-all">
            <X size={20} />{flipped ? "Missed it" : "Skip"}
          </button>
          <button onClick={() => answer(true)} className="flex-1 py-4 rounded-2xl bg-green-950/50 border border-green-800/50 flex items-center justify-center gap-2 text-green-400 font-bold active:scale-[0.97] transition-all">
            <Check size={20} />{flipped ? "Got it!" : "Flip"}
          </button>
        </div>
        <p className="text-zinc-600 text-xs mt-4 text-center">{flipped ? "Did you know it?" : "Tap card to reveal answer"}</p>
      </div>

      <TryAnotherBar onTryAnother={onTryAnother} />
    </div>
  );
}
