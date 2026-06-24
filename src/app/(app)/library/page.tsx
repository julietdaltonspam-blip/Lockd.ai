"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, ChevronRight, FileText, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import type { Folder as FolderType, Upload } from "@/types";
import { FOLDER_COLORS } from "@/types";

const FOLDER_EMOJIS = ["📚","🧬","⚗️","⚡","🧠","📊","∫","🏙️","📖","📈","📐","🔬","🎤","💼","⚖️","🩺","📦","🗂️","✏️","🎯"];

export default function LibraryPage() {
  const { data: session } = useSession();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [newFolderEmoji, setNewFolderEmoji] = useState("📚");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([fetch("/api/folders"), fetch("/api/uploads")])
        .then(async ([fRes, uRes]) => {
          if (fRes.ok) setFolders((await fRes.json()).folders || []);
          if (uRes.ok) setUploads((await uRes.json()).uploads || []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [session]);

  async function createFolder() {
    if (!newFolderName.trim()) return;
    const res = await fetch("/api/folders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newFolderName, color: newFolderColor, emoji: newFolderEmoji }) });
    if (res.ok) { const d = await res.json(); setFolders(prev => [d.folder, ...prev]); setShowNewFolder(false); setNewFolderName(""); }
  }

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-4 space-y-4 pt-12">{[1,2,3].map(i => <div key={i} className="h-16 shimmer rounded-2xl" />)}</div>;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black">Library 📚</h1>
          <button onClick={() => setShowNewFolder(true)} className="w-9 h-9 rounded-xl bg-purple-900/50 border border-purple-700/50 flex items-center justify-center"><Plus size={18} className="text-purple-400" /></button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search folders..." className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500" />
        </div>
      </div>

      {showNewFolder && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowNewFolder(false)} />
          <div className="relative w-full glass border-t border-zinc-700 rounded-t-2xl p-4 animate-slide-up max-w-lg mx-auto">
            <h3 className="font-black text-lg mb-4">New Folder</h3>
            <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name..." autoFocus className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 mb-3" />
            <p className="text-xs text-zinc-500 font-bold mb-2">ICON</p>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {FOLDER_EMOJIS.map(e => <button key={e} onClick={() => setNewFolderEmoji(e)} className={`flex-shrink-0 w-9 h-9 rounded-lg text-lg flex items-center justify-center ${newFolderEmoji === e ? "bg-purple-900/50 border border-purple-500" : "bg-zinc-800 border border-zinc-700"}`}>{e}</button>)}
            </div>
            <p className="text-xs text-zinc-500 font-bold mb-2">COLOR</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {FOLDER_COLORS.map(c => <button key={c} onClick={() => setNewFolderColor(c)} className={`w-7 h-7 rounded-full ${newFolderColor === c ? "scale-125 ring-2 ring-white ring-offset-1 ring-offset-zinc-900" : ""}`} style={{ backgroundColor: c }} />)}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNewFolder(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-sm">Cancel</button>
              <button onClick={createFolder} disabled={!newFolderName.trim()} className="flex-1 py-3 rounded-xl btn-purple text-white font-bold text-sm disabled:opacity-40">Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 space-y-2">
        {filteredFolders.length === 0 ? (
          <div className="py-12 text-center"><div className="text-4xl mb-3">📁</div><p className="text-zinc-400 text-sm font-medium mb-1">No folders yet</p><p className="text-zinc-600 text-xs">Tap + to create your first folder</p></div>
        ) : filteredFolders.map(folder => {
          const folderUploads = uploads.filter(u => u.folderId === folder.id);
          const isSelected = selectedFolder === folder.id;
          return (
            <div key={folder.id}>
              <button onClick={() => setSelectedFolder(isSelected ? null : folder.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${isSelected ? "bg-zinc-800 border-zinc-600" : "bg-zinc-900 border-zinc-800"}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${folder.color}20`, border: `1px solid ${folder.color}40` }}>{folder.emoji || "📁"}</div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm" style={{ color: folder.color }}>{folder.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{folderUploads.length} uploads</p>
                </div>
                <ChevronRight size={16} className={`text-zinc-600 transition-transform ${isSelected ? "rotate-90" : ""}`} />
              </button>
              {isSelected && (
                <div className="ml-6 mt-1 space-y-1">
                  {folderUploads.length === 0 ? (
                    <div className="p-3 text-center"><p className="text-zinc-600 text-xs">No uploads in this folder</p></div>
                  ) : folderUploads.map(upload => (
                    <Link key={upload.id} href={`/study/${upload.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <FileText size={16} className="text-zinc-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{upload.title}</p></div>
                      <ChevronRight size={14} className="text-zinc-600" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className="mt-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Uncategorized</h3>
          <div className="space-y-2">
            {uploads.filter(u => !u.folderId).map(upload => (
              <Link key={upload.id} href={`/study/${upload.id}`} className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center"><BookOpen size={16} className="text-zinc-400" /></div>
                <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{upload.title}</p><p className="text-zinc-500 text-xs capitalize">{upload.contentType}</p></div>
                <ChevronRight size={16} className="text-zinc-600" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
