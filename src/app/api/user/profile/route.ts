import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getUserProfile(session.user.id);
  return NextResponse.json(profile || { streak: 0, xp: 0, name: session.user.name, subjects: [], default_format: "flashcards" });
}
