import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-sonnet-4-6";

export async function generateGossipMode(content: string, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `Rewrite the following study notes as a funny Gen Z gossip conversation between two friends named Mia and Zoe. Use current slang naturally but keep it educational. Make it entertaining but make sure the actual content is accurate.${subjectHint} At the end, add a section called "Receipts 🧾" with 5-8 bullet points summarizing the real key facts in plain language.\n\nReturn as JSON with this structure:\n{\n  "messages": [{"speaker": "Mia", "text": "..."}, {"speaker": "Zoe", "text": "..."}],\n  "receipts": ["fact 1", "fact 2", ...]\n}\n\nHere are the notes: ${content}`,
    }],
  });
  return (response.content[0] as { text: string }).text;
}

export async function generatePodcastMode(content: string, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [{
      role: "user",
      content: `Write a natural, engaging podcast script about the following study content.${subjectHint} The hosts are Alex and Jordan — two friendly, casual hosts who genuinely find the topic interesting. Include natural back-and-forth, follow-up questions, and real examples. Add timestamp markers every 2-3 minutes (like "2:30").\n\nReturn as JSON with this structure:\n{\n  "segments": [{"timestamp": "0:00", "speaker": "Alex", "text": "..."}, ...]\n}\n\nHere is the content: ${content}`,
    }],
  });
  return (response.content[0] as { text: string }).text;
}

export async function generateSlidesMode(content: string, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `Generate 8-15 presentation slides from the following study content.${subjectHint} Each slide should have a short bold title, 3-5 bullet points max, and optionally an "example" callout.\n\nReturn as JSON: [{"title": "...", "bullets": ["...", "..."], "example": "optional"}]\n\nHere is the content: ${content}`,
    }],
  });
  return (response.content[0] as { text: string }).text;
}

export async function generateFlashcards(content: string, count = 15, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `Generate ${count} flashcard pairs from the following study content.${subjectHint} For each card, write a clear question on the front and a concise but complete answer on the back.\n\nReturn as JSON array: [{"front": "question", "back": "answer"}, ...]\n\nHere is the content: ${content}`,
    }],
  });
  return (response.content[0] as { text: string }).text;
}

export async function generateNotes(content: string, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `Generate a clean, well-formatted study summary from the following content.${subjectHint}\n\nReturn as JSON:\n{\n  "title": "...",\n  "keyConcepts": ["concept 1", ...],\n  "summary": "detailed summary with markdown",\n  "takeaways": ["takeaway 1", ...]\n}\n\nHere is the content: ${content}`,
    }],
  });
  return (response.content[0] as { text: string }).text;
}

export async function extractTextFromImage(imageBase64: string, mimeType: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: imageBase64,
          },
        },
        {
          type: "text",
          text: "Extract all text and content from this image. This may be handwritten notes, printed text, textbook pages, or whiteboard content. Return all the text and information you can see, organized clearly. Also describe any diagrams or visual elements that are educationally relevant.",
        },
      ],
    }],
  });
  return (response.content[0] as { text: string }).text;
}

export async function chatWithAI(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  context: string,
  subject?: string
): Promise<string> {
  const systemPrompt = `You are an expert tutor helping a student understand their study material. You have access to their current study content and should act as a helpful, encouraging teacher. Keep responses concise but thorough. Use examples when helpful.${subject ? ` The subject is ${subject}.` : ""}\n\nCurrent study content:\n${context}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  });
  return (response.content[0] as { text: string }).text;
}
