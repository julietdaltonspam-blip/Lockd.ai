"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  MessageCircle, Mic, SlidersHorizontal, BookOpen, FileText,
  Star, Zap, Users, ArrowRight, Lock, Sparkles
} from "lucide-react";

const FEATURES = [
  { icon: "🗣️", label: "Gossip Mode", desc: "spill the tea on your notes", color: "#ec4899" },
  { icon: "🎙️", label: "Podcast Mode", desc: "chill lo-fi breakdown", color: "#f59e0b" },
  { icon: "📱", label: "Slides Mode", desc: "clean & quick", color: "#3b82f6" },
  { icon: "🃏", label: "Flashcards", desc: "quiz yourself", color: "#22c55e" },
  { icon: "📝", label: "Notes", desc: "clean summary", color: "#a855f7" },
];

const SOCIAL_PROOF = [
  "Join thousands of students locking in",
  "Free forever — no credit card needed",
  "Works on any device",
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={() => signIn("google", { callbackUrl: "/home" })}
            className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/50 border border-purple-800/50 text-purple-300 text-xs font-medium mb-6 animate-fade-in">
            <Sparkles size={12} />
            <span>Free forever · No paywall</span>
          </div>

          {/* Logo large */}
          <div className="flex justify-center mb-4 animate-float">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-2xl shadow-purple-900/50">
              <Lock size={36} className="text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4 animate-slide-down">
            <span className="gradient-text">Lock in.</span>
            <br />
            <span className="text-zinc-50">Level up.</span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Turn any notes, PDF, YouTube video, or lecture into flashcards, podcasts,
            gossip breakdowns, and more — powered by AI.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/home" })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl btn-purple text-white font-bold text-lg shadow-2xl shadow-purple-900/40 mb-4 transition-all hover:scale-105 active:scale-95"
          >
            Get Started Free
            <ArrowRight size={20} />
          </button>

          <p className="text-zinc-500 text-sm">No credit card · Takes 10 seconds</p>
        </div>
      </section>

      {/* Mode cards */}
      <section className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-zinc-400 text-sm font-medium mb-4 uppercase tracking-widest">
            5 Ways to Study
          </p>
          <div className="grid grid-cols-1 gap-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${f.color}20`, border: `1px solid ${f.color}40` }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold" style={{ color: f.color }}>{f.label}</p>
                  <p className="text-zinc-400 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-12 bg-zinc-900/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">How it works</h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Upload anything",
                desc: "Photos, PDFs, YouTube links, audio recordings, or just paste your notes.",
                icon: "📸",
              },
              {
                step: "2",
                title: "Pick your format",
                desc: "Choose how you want to study — gossip mode, podcast, slides, flashcards, or notes.",
                icon: "✨",
              },
              {
                step: "3",
                title: "Lock in",
                desc: "Study with AI-powered content tailored to your material. Ask follow-up questions anytime.",
                icon: "🔒",
              },
            ].map(item => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-400 font-black flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-bold mb-1">{item.title} {item.icon}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h3 className="text-xl font-bold mb-2">Join thousands of students locking in</h3>
          <p className="text-zinc-400 text-sm mb-6">
            Free forever. No subscriptions. No paywalls. Just studying.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SOCIAL_PROOF.map(p => (
              <span key={p} className="px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 text-xs">
                ✓ {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-950/50 to-zinc-900 border border-purple-800/30">
            <h2 className="text-2xl font-black mb-2">Ready to lock in?</h2>
            <p className="text-zinc-400 text-sm mb-6">Start studying smarter in seconds.</p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/home" })}
              className="w-full py-4 rounded-2xl btn-purple text-white font-bold text-base flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-4 py-6 text-center text-zinc-500 text-xs">
        <Logo size="sm" />
        <p className="mt-2">© 2026 Lockd.AI · Free forever for students</p>
      </footer>
    </div>
  );
}
