"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Flame, Zap, Trophy, Settings, Globe, Bell, ChevronRight, LogOut, Shield, Star, Share2 } from "lucide-react";
import { getLevel, LEVEL_THRESHOLDS } from "@/types";

const LEVEL_COLORS: Record<string, string> = {
  "Freshman": "#94a3b8", "Sophomore": "#22c55e", "Junior": "#3b82f6", "Senior": "#f59e0b", "Dean's List": "#a855f7",
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<{ streak: number; xp: number; subjects: string[]; is_public: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/user/profile").then(r => r.json()).then(setUserData).catch(() => {});
  }, []);

  const xp = userData?.xp || 0;
  const streak = userData?.streak || 0;
  const level = getLevel(xp);
  const levelColor = LEVEL_COLORS[level];
  const firstName = session?.user?.name?.split(" ")[0] || "Student";

  const thresholds = Object.entries(LEVEL_THRESHOLDS).sort((a, b) => a[1] - b[1]);
  const currentIdx = thresholds.findIndex(([name]) => name === level);
  const nextLevel = thresholds[currentIdx + 1];
  const progress = nextLevel ? ((xp - thresholds[currentIdx][1]) / (nextLevel[1] - thresholds[currentIdx][1])) * 100 : 100;

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">Profile</h1>
          <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center"><Settings size={18} className="text-zinc-400" /></div>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-16 h-16 rounded-full border-2" style={{ borderColor: levelColor }} />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black" style={{ backgroundColor: `${levelColor}20`, border: `2px solid ${levelColor}` }}>
                {firstName[0]}
              </div>
            )}
            <div className="flex-1">
              <p className="font-black text-lg">{session?.user?.name}</p>
              <p className="text-zinc-500 text-xs mb-2">{session?.user?.email}</p>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${levelColor}20`, color: levelColor }}>
                <Star size={10} fill="currentColor" />{level}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500">XP Progress</span>
              {nextLevel && <span className="text-xs text-zinc-500">{xp} / {nextLevel[1]} XP → {nextLevel[0]}</span>}
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: levelColor }} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[{icon: Flame, val: streak, label: "Day streak", color: "text-orange-400", bg: "bg-orange-950/50"}, {icon: Zap, val: xp, label: "Total XP", color: "text-purple-400", bg: "bg-purple-950/50"}, {icon: Trophy, val: "—", label: "Rank", color: "text-amber-400", bg: "bg-amber-950/50"}].map(({icon: Icon, val, label, color, bg}) => (
            <div key={label} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
              <div className="flex justify-center mb-1"><div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}><Icon size={18} className={color} /></div></div>
              <p className={`text-2xl font-black ${color}`}>{val}</p>
              <p className="text-zinc-500 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {userData?.subjects && userData.subjects.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {userData.subjects.map((s: string) => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 mb-6">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">How to earn XP</h3>
        <div className="space-y-2">
          {[{label: "Generate a format", xp: "+10 XP", icon: "✨"}, {label: "Complete flashcard deck", xp: "+20 XP", icon: "🃏"}, {label: "Study 3+ days in a row", xp: "+15 XP", icon: "🔥"}, {label: "Share your content", xp: "+5 XP", icon: "📤"}].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3"><span className="text-lg">{item.icon}</span><span className="text-sm text-zinc-300">{item.label}</span></div>
              <span className="text-purple-400 font-bold text-sm">{item.xp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Settings</h3>
        <div className="space-y-1">
          {[{icon: Bell, label: "Notifications", desc: "Streak reminders & updates"}, {icon: Globe, label: "Public profile", desc: userData?.is_public ? "On" : "Off"}, {icon: Share2, label: "Share my content", desc: "Let others see your study sets"}, {icon: Shield, label: "Privacy", desc: "Manage your data"}].map(({icon: Icon, label, desc}) => (
            <button key={label} className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0"><Icon size={15} className="text-zinc-400" /></div>
              <div className="flex-1"><p className="text-sm font-medium">{label}</p><p className="text-zinc-500 text-xs mt-0.5">{desc}</p></div>
              <ChevronRight size={16} className="text-zinc-600" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-950/50 transition-all">
          <LogOut size={16} /><span className="font-medium text-sm">Sign out</span>
        </button>
      </div>
      <p className="text-center text-zinc-700 text-xs mt-6 pb-4">Lockd.AI · Free forever 🔒</p>
    </div>
  );
}
