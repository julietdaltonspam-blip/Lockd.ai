import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUploads } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId") || undefined;
  const limit = parseInt(searchParams.get("limit") || "20");
  let uploads = await getUploads(session.user.id, folderId);
  uploads = uploads.slice(0, limit);
  return NextResponse.json({ uploads });
}
