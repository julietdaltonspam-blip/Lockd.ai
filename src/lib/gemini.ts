import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const MODEL = "gemini-1.5-flash";

function getModel() {
  return genAI.getGenerativeModel({ model: MODEL });
}

async function generate(prompt: string, maxTokens = 2000): Promise<string> {
  const model = getModel();
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens },
  });
  return result.response.text();
}

export async function generateGossipMode(content: string, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  return generate(
    `Rewrite the following study notes as a funny Gen Z gossip conversation between two friends named Mia and Zoe. Use current slang naturally but keep it educational. Make it entertaining but make sure the actual content is accurate.${subjectHint} At the end, add a section called "Receipts 🧾" with 5-8 bullet points summarizing the real key facts in plain language.\n\nReturn as JSON with this structure:\n{\n  "messages": [{"speaker": "Mia", "text": "..."}, {"speaker": "Zoe", "text": "..."}],\n  "receipts": ["fact 1", "fact 2", ...]\n}\n\nHere are the notes: ${content}`,
    2000
  );
}

export async function generatePodcastMode(content: string, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  return generate(
    `Write a natural, engaging podcast script about the following study content.${subjectHint} The hosts are Alex and Jordan — two friendly, casual hosts who genuinely find the topic interesting. Include natural back-and-forth, follow-up questions, and real examples. Add timestamp markers every 2-3 minutes (like "2:30").\n\nReturn as JSON with this structure:\n{\n  "segments": [{"timestamp": "0:00", "speaker": "Alex", "text": "..."}, ...]\n}\n\nHere is the content: ${content}`,
    3000
  );
}

export async function generateSlidesMode(content: string, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  return generate(
    `Generate 8-15 presentation slides from the following study content.${subjectHint} Each slide should have a short bold title, 3-5 bullet points max, and optionally an "example" callout.\n\nReturn as JSON with this structure:\n[{"title": "...", "bullets": ["...", "..."], "example": "optional example"}]\n\nHere is the content: ${content}`,
    2000
  );
}

export async function generateFlashcards(content: string, count = 15, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  return generate(
    `Generate ${count} flashcard pairs from the following study content.${subjectHint} For each card, write a clear question on the front and a concise but complete answer on the back. Focus on the most important concepts.\n\nReturn as a JSON array: [{"front": "question", "back": "answer"}, ...]\n\nHere is the content: ${content}`,
    2000
  );
}

export async function generateNotes(content: string, subject?: string): Promise<string> {
  const subjectHint = subject ? ` The subject is ${subject}.` : "";
  return generate(
    `Generate a clean, well-formatted study summary from the following content.${subjectHint}\n\nReturn as JSON with this structure:\n{\n  "title": "...",\n  "keyConcepts": ["concept 1", "concept 2", ...],\n  "summary": "detailed summary with markdown formatting",\n  "takeaways": ["takeaway 1", ...]\n}\n\nHere is the content: ${content}`,
    2000
  );
}

export async function extractTextFromImage(imageBase64: string, mimeType: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: [
        { inlineData: { data: imageBase64, mimeType } },
        { text: "Extract all text and content from this image. This may be handwritten notes, printed text, textbook pages, or whiteboard content. Return all the text and information you can see, organized clearly. Also describe any diagrams or visual elements that are educationally relevant." },
      ],
    }],
    generationConfig: { maxOutputTokens: 2000 },
  });
  return result.response.text();
}

export async function chatWithAI(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  context: string,
  subject?: string
): Promise<string> {
  const systemText = `You are an expert tutor helping a student understand their study material. You have access to their current study content and should act as a helpful, encouraging teacher. Keep responses concise but thorough. Use examples when helpful.${subject ? ` The subject is ${subject}.` : ""}\n\nCurrent study content:\n${context}`;

  const model = getModel();

  const history = messages.slice(0, -1).map((m, i) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: i === 0 ? `${systemText}\n\n${m.content}` : m.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(
    history.length === 0 ? `${systemText}\n\n${lastMessage.content}` : lastMessage.content
  );
  return result.response.text();
}
