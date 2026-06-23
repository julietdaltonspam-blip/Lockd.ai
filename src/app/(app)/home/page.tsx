"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Zap, Plus, ChevronRight, BookOpen, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";
import type { Upload } from "@/types";
import { getLevel } from "@/types";

const WEEKLY_CHALLENGES = [
  { title: "Generate 3 formats", desc: "Try gossip, podcast, and slides", xp: 30, progress: 0, total: 3 },
  { title: "Complete a flashcard deck", desc: "Go through all cards at least once", xp: 20, progress: 0, total: 1 },
  { title: "Study 3 days in a row", desc: "Build that streak!", xp: 15, progress: 1, total: 3 },
];

const FORMAT_SUGGESTIONS = [
  { format: "gossip", label: "Gossip Mode", emoji: "🗣️", color: "#ec4899" },
  { format: "podcast", label: "Podcast Mode", emoji: "🎤", color: "#f59e0b" },
  { format: "slides", label: "Slides", emoji: "📱", color: "#3b82f6" },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<{ streak: number; xp: number; name: string } | null>(null);
  const [recentUploads, setRecentUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([
        fetch("/api/user/profile").then(r => r.json()),
        fetch("/api/uploads?limit=3").then(r => r.json()),
      ]).then(([u, ups]) => {
        setUserData(u);
        setRecentUploads(ups.uploads || []);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [session]);

  const firstName = session?.user?.name?.split(" ")[0] || "friend";
  const streak = userData?.streak || 0;
  const xp = userData?.xp || 0;
  const level = getLevel(xp);

  if (loading) {
    return (
      <div className="p-4 space-y-4 pt-12">
        <div className="h-8 w-48 shimmer rounded-xl" />
        <div className="h-28 shimmer rounded-2xl" />
        <div className="h-40 shimmer rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">hey {firstName} 🔒</h1>
            <p className="text-zinc-400 text-sm mt-0.5">ready to lock in?</p>
          </div>
          <Link href="/profile">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-500" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center">
                <span className="text-purple-200 font-bold text-sm">{firstName[0]?.toUpperCase()}</span>
              </div>
            )}
          </Link>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-950/50 flex items-center justify-center"><Flame size={20} className="text-orange-400" /></div>
            <div><p className="text-xl font-black text-orange-400">{streak}</p><p className="text-zinc-500 text-xs">day streak</p></div>
          </div>
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/50 flex items-center justify-center"><Zap size={20} className="text-purple-400" /></div>
            <div><p className="text-xl font-black text-purple-400">{xp}</p><p className="text-zinc-500 text-xs">{level}</p></div>
          </div>
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/50 flex items-center justify-center"><Trophy size={20} className="text-amber-400" /></div>
            <div><p className="text-xl font-black text-amber-400">#1</p><p className="text-zinc-500 text-xs">rank</p></div>
          </div>
        </div>
      </div>

      {recentUploads.length > 0 ? (
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Continue studying</h2>
            <Link href="/library" className="text-purple-400 text-xs font-medium flex items-center gap-1">See all <ChevronRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {recentUploads.map(upload => (
              <Link key={upload.id} href={`/study/${upload.id}`} className="flex items-center gap-3 p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all active:scale-[0.99]">
                <div className="w-10 h-10 rounded-xl bg-purple-950/50 flex items-center justify-center"><BookOpen size={18} className="text-purple-400" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{upload.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 capitalize">{upload.contentType}</p>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="px-4 mb-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="font-bold mb-1">No uploads yet</h3>
            <p className="text-zinc-400 text-sm mb-4">Upload your first set of notes to get started!</p>
            <Link href="/upload" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-purple text-white text-sm font-bold">
              <Plus size={16} />Upload something
            </Link>
          </div>
        </section>
      )}

      {recentUploads.length > 0 && (
        <section className="px-4 mb-6">
          <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide mb-3">Try a new format</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {FORMAT_SUGGESTIONS.map(f => (
              <Link key={f.format} href={`/study/${recentUploads[0]?.id}?format=${f.format}`}
                className="flex-shrink-0 w-32 p-3 rounded-2xl border border-zinc-800 bg-zinc-900 flex flex-col items-center gap-2 hover:border-zinc-700 transition-all"
                style={{ borderColor: `${f.color}40` }}
              >
                <span className="text-3xl">{f.emoji}</span>
                <p className="text-xs font-medium text-center" style={{ color: f.color }}>{f.label}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Weekly challenges</h2>
          <span className="text-zinc-500 text-xs">Resets Sunday</span>
        </div>
        <div className="space-y-2">
          {WEEKLY_CHALLENGES.map(c => (
            <div key={c.title} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{c.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{c.desc}</p>
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded-full">+{c.xp} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(c.progress / c.total) * 100}%` }} />
                </div>
                <span className="text-xs text-zinc-500">{c.progress}/{c.total}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide"><TrendingUp size={14} className="inline mr-1" />Trending from students</h2>
          <Link href="/explore" className="text-purple-400 text-xs font-medium flex items-center gap-1">See all <ChevronRight size={12} /></Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {["AP Bio Gossip 🗣️", "Calc Podcast 🎤", "Psych Slides 📱"].map((item, i) => (
            <Link key={item} href="/explore" className="flex-shrink-0 w-40 h-28 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-end p-3 hover:border-zinc-700 transition-all overflow-hidden relative">
              <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${["#ec4899", "#f59e0b", "#3b82f6"][i]}, transparent)` }} />
              <p className="font-semibold text-xs relative z-10">{item}</p>
              <p className="text-zinc-500 text-xs relative z-10 mt-0.5">Trending</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
