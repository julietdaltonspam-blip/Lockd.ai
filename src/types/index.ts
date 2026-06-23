export type Subject =
  | "AP Biology"
  | "AP Chemistry"
  | "AP Physics"
  | "AP Psychology"
  | "AP Statistics"
  | "AP Calculus"
  | "AP History"
  | "AP English"
  | "AP Economics"
  | "College Math"
  | "College Science"
  | "College Humanities"
  | "Business"
  | "Law"
  | "Medicine"
  | "Other";

export type OutputFormat = "gossip" | "podcast" | "slides" | "flashcards" | "notes";

export type AmbientMode = "cafe" | "fireplace" | "city" | "library" | "rain";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  subjects: Subject[];
  defaultFormat: OutputFormat;
  streak: number;
  xp: number;
  level: string;
  lastStudiedAt?: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color: string;
  emoji?: string;
  isShared: boolean;
  shareToken?: string;
  members?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Upload {
  id: string;
  userId: string;
  folderId?: string;
  title: string;
  contentType: "text" | "pdf" | "youtube" | "audio" | "image";
  rawContent: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedContent {
  id: string;
  uploadId: string;
  userId: string;
  format: OutputFormat;
  content: string;
  isPublic: boolean;
  views: number;
  likes: number;
  createdAt: string;
}

export interface Flashcard {
  front: string;
  back: string;
  known?: boolean;
}

export interface Slide {
  title: string;
  bullets: string[];
  example?: string;
}

export interface GossipMessage {
  speaker: "Mia" | "Zoe";
  text: string;
}

export interface GossipContent {
  messages: GossipMessage[];
  receipts: string[];
}

export interface PodcastSegment {
  timestamp: string;
  speaker: "Alex" | "Jordan";
  text: string;
}

export interface PodcastContent {
  segments: PodcastSegment[];
}

export interface NotesContent {
  title: string;
  keyConcepts: string[];
  summary: string;
  takeaways: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const LEVEL_THRESHOLDS: Record<string, number> = {
  Freshman: 0,
  Sophomore: 101,
  Junior: 301,
  Senior: 601,
  "Dean's List": 1001,
};

export function getLevel(xp: number): string {
  if (xp >= 1001) return "Dean's List";
  if (xp >= 601) return "Senior";
  if (xp >= 301) return "Junior";
  if (xp >= 101) return "Sophomore";
  return "Freshman";
}

export const FOLDER_COLORS = [
  "#a855f7", "#7c3aed", "#c084fc", "#d946ef",
  "#ec4899", "#f43f5e", "#fb7185", "#f97316",
  "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6",
  "#6366f1", "#8b5cf6", "#a78bfa", "#38bdf8",
  "#fb923c", "#fbbf24", "#a3e635", "#4ade80",
  "#2dd4bf", "#38bdf8", "#818cf8", "#e879f9",
  "#f472b6", "#94a3b8",
];
