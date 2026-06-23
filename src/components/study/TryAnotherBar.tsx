"use client";

import { Shuffle } from "lucide-react";

interface TryAnotherBarProps {
  onTryAnother: () => void;
}

export function TryAnotherBar({ onTryAnother }: TryAnotherBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-zinc-800 pb-safe">
      <div className="max-w-lg mx-auto px-4 py-3">
        <button
          onClick={onTryAnother}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm transition-all active:scale-[0.98]"
        >
          <Shuffle size={16} className="text-purple-400" />
          Try another format
        </button>
      </div>
    </div>
  );
}
