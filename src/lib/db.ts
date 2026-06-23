import { supabase } from "./supabase";
import type { Folder, Upload, GeneratedContent, OutputFormat } from "@/types";

export async function getUserProfile(userId: string) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateUserProfile(userId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserStreak(userId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("streak, last_studied_at")
    .eq("id", userId)
    .single();

  if (!user) return;

  const now = new Date();
  const last = user.last_studied_at ? new Date(user.last_studied_at) : null;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak = user.streak || 0;

  if (!last) {
    newStreak = 1;
  } else {
    const lastDate = last.toDateString();
    const todayDate = now.toDateString();
    const yesterdayDate = yesterday.toDateString();
    if (lastDate === todayDate) return;
    else if (lastDate === yesterdayDate) newStreak += 1;
    else newStreak = 1;
  }

  await supabase
    .from("users")
    .update({ streak: newStreak, last_studied_at: now.toISOString() })
    .eq("id", userId);

  return newStreak;
}

export async function addXP(userId: string, amount: number) {
  const { data: user } = await supabase
    .from("users")
    .select("xp")
    .eq("id", userId)
    .single();
  if (!user) return;
  const newXP = (user.xp || 0) + amount;
  await supabase.from("users").update({ xp: newXP }).eq("id", userId);
  return newXP;
}

export async function getFolders(userId: string): Promise<Folder[]> {
  const { data } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as Folder[]) || [];
}

export async function createFolder(userId: string, name: string, color: string, emoji?: string) {
  const { data, error } = await supabase
    .from("folders")
    .insert({ user_id: userId, name, color, emoji, is_shared: false })
    .select()
    .single();
  if (error) throw error;
  return data as Folder;
}

export async function updateFolder(folderId: string, updates: Partial<Folder>) {
  const { data, error } = await supabase
    .from("folders")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", folderId)
    .select()
    .single();
  if (error) throw error;
  return data as Folder;
}

export async function deleteFolder(folderId: string) {
  const { error } = await supabase.from("folders").delete().eq("id", folderId);
  if (error) throw error;
}

export async function getUploads(userId: string, folderId?: string): Promise<Upload[]> {
  let query = supabase
    .from("uploads")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (folderId) query = query.eq("folder_id", folderId);
  const { data } = await query;
  return (data as Upload[]) || [];
}

export async function getUpload(uploadId: string): Promise<Upload | null> {
  const { data } = await supabase.from("uploads").select("*").eq("id", uploadId).single();
  return data as Upload | null;
}

export async function createUpload(
  userId: string,
  title: string,
  contentType: Upload["contentType"],
  rawContent: string,
  folderId?: string,
  sourceUrl?: string
): Promise<Upload> {
  const { data, error } = await supabase
    .from("uploads")
    .insert({ user_id: userId, folder_id: folderId || null, title, content_type: contentType, raw_content: rawContent, source_url: sourceUrl })
    .select()
    .single();
  if (error) throw error;
  return data as Upload;
}

export async function getGeneratedContent(uploadId: string, format?: OutputFormat): Promise<GeneratedContent[]> {
  let query = supabase.from("generated_content").select("*").eq("upload_id", uploadId);
  if (format) query = query.eq("format", format);
  const { data } = await query;
  return (data as GeneratedContent[]) || [];
}

export async function saveGeneratedContent(
  userId: string,
  uploadId: string,
  format: OutputFormat,
  content: string,
  isPublic = false
): Promise<GeneratedContent> {
  const { data, error } = await supabase
    .from("generated_content")
    .upsert({ user_id: userId, upload_id: uploadId, format, content, is_public: isPublic, views: 0, likes: 0 }, { onConflict: "upload_id,format" })
    .select()
    .single();
  if (error) throw error;
  return data as GeneratedContent;
}

export async function getPublicFeed(limit = 20) {
  const { data } = await supabase
    .from("generated_content")
    .select("*, uploads(title, user_id), users(name, image)")
    .eq("is_public", true)
    .order("views", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function incrementViews(contentId: string) {
  await supabase.rpc("increment_views", { content_id: contentId });
}

export async function toggleLike(contentId: string, userId: string) {
  const { data } = await supabase.from("likes").select("id").eq("content_id", contentId).eq("user_id", userId).single();
  if (data) {
    await supabase.from("likes").delete().eq("id", data.id);
    return false;
  } else {
    await supabase.from("likes").insert({ content_id: contentId, user_id: userId });
    return true;
  }
}
