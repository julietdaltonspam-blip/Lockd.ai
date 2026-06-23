"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Check, ArrowRight, ChevronLeft } from "lucide-react";
import type { Subject, OutputFormat } from "@/types";

const SUBJECTS: Subject[] = [
  "AP Biology", "AP Chemistry", "AP Physics", "AP Psychology",
  "AP Statistics", "AP Calculus", "AP History", "AP English",
  "AP Economics", "College Math", "College Science", "College Humanities",
  "Business", "Law", "Medicine", "Other",
];

const FORMATS: { id: OutputFormat; emoji: string; label: string; desc: string; color: string }[] = [
  { id: "gossip", emoji: "🗣️", label: "Gossip Mode", desc: "Your notes as tea-spilling Gen Z bestie convos", color: "#ec4899" },
  { id: "podcast", emoji: "🎤", label: "Podcast Mode", desc: "Chill lo-fi podcast script with two hosts", color: "#f59e0b" },
  { id: "slides", emoji: "📱", label: "Slides Mode", desc: "Clean swipeable slides — great for visual learners", color: "#3b82f6" },
  { id: "flashcards", emoji: "🃏", label: "Flashcards", desc: "Quiz yourself with tap-to-flip cards", color: "#22c55e" },
  { id: "notes", emoji: "📝", label: "Notes", desc: "Clean structured summary with key takeaways", color: "#a855f7" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [defaultFormat, setDefaultFormat] = useState<OutputFormat | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function toggleSubject(s: Subject) {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function saveAndContinue() {
    if (step === 1) {
      if (subjects.length === 0) return;
      setStep(2);
    } else if (step === 2) {
      if (!defaultFormat) return;
      setStep(3);
    } else {
      setSaving(true);
      try {
        await fetch("/api/user/onboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjects, defaultFormat }),
        });
      } catch { /* continue */ }
      router.push("/upload");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="px-4 pt-12 pb-6">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="flex gap-2 max-w-xs mx-auto">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? "bg-purple-500" : "bg-zinc-800"}`} />
          ))}
        </div>
        <p className="text-center text-zinc-400 text-xs mt-2">Step {step} of 3</p>
      </div>

      <div className="flex-1 px-4 pb-8 overflow-y-auto animate-fade-in" key={step}>
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-black mb-1">What are you studying? 📚</h1>
            <p className="text-zinc-400 text-sm mb-6">Pick your subjects — we'll organize your library automatically.</p>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map(s => {
                const selected = subjects.includes(s);
                return (
                  <button key={s} onClick={() => toggleSubject(s)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm font-medium transition-all ${selected ? "bg-purple-900/40 border-purple-500 text-purple-200" : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600"}`}
                  >
                    {selected && <Check size={14} className="text-purple-400 flex-shrink-0" />}
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-black mb-1">How do you learn best? 🧠</h1>
            <p className="text-zinc-400 text-sm mb-6">Pick your default study format — you can always change it later.</p>
            <div className="space-y-3">
              {FORMATS.map(f => {
                const selected = defaultFormat === f.id;
                return (
                  <button key={f.id} onClick={() => setDefaultFormat(f.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${selected ? "" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}
                    style={selected ? { backgroundColor: `${f.color}15`, borderColor: f.color } : {}}
                  >
                    <span className="text-3xl">{f.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold" style={selected ? { color: f.color } : { color: "#fafafa" }}>{f.label}</p>
                      <p className="text-zinc-400 text-xs mt-0.5">{f.desc}</p>
                    </div>
                    {selected && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: f.color }}>
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4 animate-float">🔒</div>
            <h1 className="text-2xl font-black mb-2">Let's make your first study set</h1>
            <p className="text-zinc-400 text-sm mb-8">Upload anything — a photo of your notes, a PDF, a YouTube link, or just paste some text.</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {["📸 Photo", "📄 PDF", "🔗 YouTube", "🎤 Record", "🎵 Audio", "✍️ Text"].map(i => (
                <div key={i} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-300">{i}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-8 pt-4 border-t border-zinc-800">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <ChevronLeft size={20} className="text-zinc-300" />
            </button>
          )}
          <button
            onClick={saveAndContinue}
            disabled={saving || (step === 1 && subjects.length === 0) || (step === 2 && !defaultFormat)}
            className="flex-1 py-3.5 rounded-xl btn-purple text-white font-bold flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>{step === 3 ? "Make my first study set" : "Continue"}<ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
