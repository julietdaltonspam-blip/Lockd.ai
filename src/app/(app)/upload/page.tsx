"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, FileText, Mic, Music, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

type InputType = "photo" | "pdf" | "youtube" | "record" | "audio" | "text" | null;

const INPUT_TILES = [
  { id: "photo" as InputType, emoji: "📸", label: "Camera / Photo", desc: "Handwritten notes, textbooks, whiteboards" },
  { id: "pdf" as InputType, emoji: "📄", label: "PDF", desc: "Upload any PDF file" },
  { id: "youtube" as InputType, emoji: "🔗", label: "YouTube Link", desc: "Paste a video URL" },
  { id: "record" as InputType, emoji: "🎙️", label: "Record Live", desc: "Record audio in real time" },
  { id: "audio" as InputType, emoji: "🎵", label: "Audio / Video", desc: "Upload any media file" },
  { id: "text" as InputType, emoji: "✍️", label: "Type or Paste", desc: "Plain text input" },
];

const PROCESSING_MESSAGES = ["Lockd is reading your notes...", "Finding the key concepts...", "Extracting what matters...", "Almost ready..."];

export default function UploadPage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<InputType>(null);
  const [processing, setProcessing] = useState(false);
  const [processMsg, setProcessMsg] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startProcessing() {
    setProcessing(true);
    let i = 0;
    const interval = setInterval(() => { i = (i + 1) % PROCESSING_MESSAGES.length; setProcessMsg(i); }, 1800);
    return () => clearInterval(interval);
  }

  async function handleFileUpload(file: File, type: "image" | "pdf") {
    const cleanup = startProcessing();
    setError("");
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);
      formData.append("title", title || file.name.replace(/\.[^/.]+$/, "") || "Upload");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      cleanup();
      router.push(`/study/${data.upload.id}?content=${encodeURIComponent(data.content)}`);
    } catch (e) {
      cleanup();
      setProcessing(false);
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
  }

  async function handleYouTube() {
    if (!youtubeUrl.trim()) return;
    const cleanup = startProcessing();
    setError("");
    try {
      const res = await fetch("/api/youtube", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: youtubeUrl }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const fd = new FormData();
      fd.append("type", "text"); fd.append("content", data.transcript); fd.append("title", title || data.title || "YouTube");
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error);
      cleanup();
      router.push(`/study/${upData.upload.id}?content=${encodeURIComponent(data.transcript)}`);
    } catch (e) {
      cleanup(); setProcessing(false); setError(e instanceof Error ? e.message : "Could not fetch transcript.");
    }
  }

  async function handleText() {
    if (!textContent.trim()) return;
    const cleanup = startProcessing();
    setError("");
    try {
      const fd = new FormData();
      fd.append("type", "text"); fd.append("content", textContent); fd.append("title", title || "My Notes");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      cleanup();
      router.push(`/study/${data.upload.id}?content=${encodeURIComponent(textContent)}`);
    } catch (e) {
      cleanup(); setProcessing(false); setError(e instanceof Error ? e.message : "Failed.");
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setTextContent(`[Audio recording: ${Math.round(recordingTime / 60)}m ${recordingTime % 60}s]\n\nPaste transcript here to study.`);
        setActiveType("text"); setRecording(false);
      };
      audioRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch { setError("Microphone access denied."); }
  }

  function stopRecording() {
    audioRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  if (processing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-purple-900/30 animate-ping absolute inset-0" />
          <div className="w-24 h-24 rounded-full bg-purple-900/50 flex items-center justify-center relative animate-pulse-glow"><span className="text-4xl">🔒</span></div>
        </div>
        <p className="text-zinc-400 text-sm" key={processMsg}>{PROCESSING_MESSAGES[processMsg]}</p>
      </div>
    );
  }

  if (!activeType) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="px-4 pt-12 pb-6"><Logo size="sm" /><h1 className="text-2xl font-black mt-4 mb-1">Upload anything 📤</h1><p className="text-zinc-400 text-sm">We'll turn it into something you'll actually study.</p></div>
        <div className="px-4 mb-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give it a name (optional)" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500" />
        </div>
        <div className="px-4 grid grid-cols-2 gap-3">
          {INPUT_TILES.map(tile => (
            <button key={tile.id} onClick={() => setActiveType(tile.id)} className="flex flex-col items-start gap-2 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all active:scale-[0.97] text-left">
              <span className="text-3xl">{tile.emoji}</span>
              <div><p className="font-bold text-sm">{tile.label}</p><p className="text-zinc-500 text-xs mt-0.5 leading-tight">{tile.desc}</p></div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="px-4 pt-12 pb-6">
        <button onClick={() => setActiveType(null)} className="flex items-center gap-2 text-zinc-400 mb-6"><ArrowLeft size={18} /><span className="text-sm">Back</span></button>
        {error && <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-sm">{error}</div>}

        {activeType === "photo" && (
          <div>
            <h2 className="text-xl font-black mb-2">📸 Photo Upload</h2>
            <p className="text-zinc-400 text-sm mb-6">Works on handwritten notes, textbook pages, whiteboards.</p>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "image")} />
            <button onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-purple-500">
              <Camera size={40} className="text-zinc-500" /><p className="text-zinc-400 font-medium">Tap to take photo or choose image</p>
            </button>
          </div>
        )}
        {activeType === "pdf" && (
          <div>
            <h2 className="text-xl font-black mb-2">📄 PDF Upload</h2>
            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], "pdf")} />
            <button onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-purple-500">
              <FileText size={40} className="text-zinc-500" /><p className="text-zinc-400 font-medium">Tap to select PDF</p>
            </button>
          </div>
        )}
        {activeType === "youtube" && (
          <div>
            <h2 className="text-xl font-black mb-2">🔗 YouTube Link</h2>
            <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 mb-4" />
            <button onClick={handleYouTube} disabled={!youtubeUrl.trim()} className="w-full py-3.5 rounded-xl btn-purple text-white font-bold disabled:opacity-40">Fetch & Study</button>
          </div>
        )}
        {activeType === "record" && (
          <div className="text-center">
            <h2 className="text-xl font-black mb-2">🎙️ Record Live</h2>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${recording ? "bg-red-900/50 animate-pulse-glow" : "bg-zinc-800"}`}>
              <Mic size={48} className={recording ? "text-red-400" : "text-zinc-400"} />
            </div>
            {recording && <p className="text-red-400 font-mono text-xl mb-4">{String(Math.floor(recordingTime/60)).padStart(2,"0")}:{String(recordingTime%60).padStart(2,"0")}</p>}
            <button onClick={recording ? stopRecording : startRecording} className={`px-8 py-3.5 rounded-xl font-bold ${recording ? "bg-red-600 text-white" : "btn-purple text-white"}`}>{recording ? "Stop Recording" : "Start Recording"}</button>
          </div>
        )}
        {activeType === "audio" && (
          <div>
            <h2 className="text-xl font-black mb-2">🎵 Audio / Video File</h2>
            <input ref={fileInputRef} type="file" accept="audio/*,video/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setTextContent(`[File: ${e.target.files[0].name}]\n\nPaste transcript here to study.`); setActiveType("text"); } }} />
            <button onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-3">
              <Music size={40} className="text-zinc-500" /><p className="text-zinc-400 font-medium">Select audio or video file</p>
            </button>
          </div>
        )}
        {activeType === "text" && (
          <div>
            <h2 className="text-xl font-black mb-2">✍️ Type or Paste</h2>
            <textarea value={textContent} onChange={e => setTextContent(e.target.value)} placeholder="Paste your notes here..." rows={12} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 resize-none mb-4" />
            <button onClick={handleText} disabled={!textContent.trim()} className="w-full py-3.5 rounded-xl btn-purple text-white font-bold disabled:opacity-40">Process Notes</button>
          </div>
        )}
      </div>
    </div>
  );
}
