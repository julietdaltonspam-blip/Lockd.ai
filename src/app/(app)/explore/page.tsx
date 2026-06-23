"use client";

import { useState } from "react";
import { Heart, Share2, Bookmark, TrendingUp } from "lucide-react";
import Link from "next/link";

const MOCK_FEED = [
  { id: "1", format: "gossip", emoji: "🗣️", color: "#ec4899", title: "AP Bio: Cell Division Drama", creator: "Emma K.", avatar: "E", subject: "AP Biology", preview: "Mia: omg so mitosis literally divides the cell into TWO identical copies... like a photocopy machine for life bestie", likes: 234, views: 1200 },
  { id: "2", format: "podcast", emoji: "🎤", color: "#f59e0b", title: "Calculus Deep Dive: Derivatives", creator: "Jake M.", avatar: "J", subject: "AP Calculus", preview: "Alex: So Jordan, today we're talking about derivatives — basically how fast things change...", likes: 156, views: 890 },
  { id: "3", format: "slides", emoji: "📱", color: "#3b82f6", title: "Psychology: Memory & Learning", creator: "Sofia R.", avatar: "S", subject: "AP Psychology", preview: "Short-Term Memory → Working Memory → Long-Term Memory storage systems...", likes: 89, views: 445 },
  { id: "4", format: "flashcards", emoji: "🃏", color: "#22c55e", title: "AP Chem: Periodic Table Essentials", creator: "Marcus T.", avatar: "M", subject: "AP Chemistry", preview: "20 cards covering atomic structure, electron configuration, and periodic trends", likes: 312, views: 1567 },
  { id: "5", format: "gossip", emoji: "🗣️", color: "#ec4899", title: "WW2 Drama: The Real Story", creator: "Aisha B.", avatar: "A", subject: "AP History", preview: "Zoe: okay but did you hear what happened at Dunkirk?? The British literally had to swim home...", likes: 445, views: 2100 },
];

const SUBJECTS = ["All", "AP Biology", "AP Chemistry", "AP Psychology", "AP Calculus", "AP History", "College"];

export default function ExplorePage() {
  const [filter, setFilter] = useState("All");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const feed = filter === "All" ? MOCK_FEED : MOCK_FEED.filter(item => item.subject.includes(filter));

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-4"><TrendingUp size={20} className="text-purple-400" /><h1 className="text-2xl font-black">Explore</h1></div>
        <p className="text-zinc-400 text-sm mb-4">See what other students are studying</p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === s ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 pb-24">
        {feed.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black" style={{ backgroundColor: `${item.color}20`, color: item.color }}>{item.avatar}</div>
                  <div><p className="font-semibold text-xs">{item.creator}</p><p className="text-zinc-500 text-[10px]">{item.subject}</p></div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <span>{item.emoji}</span><span>{item.format}</span>
                </div>
              </div>
              <h3 className="font-black text-base mb-2">{item.title}</h3>
              <div className="p-3 rounded-xl text-xs text-zinc-400 leading-relaxed" style={{ backgroundColor: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                "{item.preview}"
              </div>
            </div>
            <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setLiked(prev => { const n = new Set(prev); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })} className="flex items-center gap-1.5 text-xs">
                  <Heart size={16} className={liked.has(item.id) ? "text-red-500 fill-red-500" : "text-zinc-500"} />
                  <span className={liked.has(item.id) ? "text-red-400" : "text-zinc-500"}>{item.likes + (liked.has(item.id) ? 1 : 0)}</span>
                </button>
                <span className="text-zinc-600 text-xs">{item.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSaved(prev => { const n = new Set(prev); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })}>
                  <Bookmark size={16} className={saved.has(item.id) ? "text-purple-400 fill-purple-400" : "text-zinc-500"} />
                </button>
                <button><Share2 size={16} className="text-zinc-500" /></button>
              </div>
            </div>
          </div>
        ))}
        <div className="text-center py-4">
          <p className="text-zinc-600 text-sm">You've seen it all! 🎉</p>
          <p className="text-zinc-700 text-xs mt-1">Upload your own content to appear here</p>
        </div>
      </div>
    </div>
  );
}
