import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { createFolder } from "@/lib/db";
import { FOLDER_COLORS } from "@/types";

function getSubjectEmoji(subject: string): string {
  const map: Record<string, string> = {
    "AP Biology": "🧬", "AP Chemistry": "⚗️", "AP Physics": "⚡",
    "AP Psychology": "🧠", "AP Statistics": "📊", "AP Calculus": "∫",
    "AP History": "🏛️", "AP English": "📖", "AP Economics": "📈",
    "College Math": "📐", "College Science": "🔬", "College Humanities": "🎭",
    "Business": "💼", "Law": "⚖️", "Medicine": "🩺", "Other": "📚",
  };
  return map[subject] || "📚";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { subjects, defaultFormat } = await req.json();
    await supabase.from("users").update({ subjects, default_format: defaultFormat, onboarded: true, xp: 0, streak: 0, is_public: false }).eq("id", session.user.id);
    for (let i = 0; i < subjects.length; i++) {
      await createFolder(session.user.id, subjects[i], FOLDER_COLORS[i % FOLDER_COLORS.length], getSubjectEmoji(subjects[i]));
    }
    await createFolder(session.user.id, "Uncategorized", "#71717a", "📦");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboard error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
