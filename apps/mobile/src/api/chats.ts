import { faker } from "@faker-js/faker";
import { Chat, ChatMessage } from "../types/chat";
import { apiFetch } from "./config";
import { mockFlags } from "./mockFlags";

// ── Mock caches ──────────────────────────────────────────────────────────────

let mockChatsCache: Chat[] | null = null;
const mockMessagesCache = new Map<number, ChatMessage[]>();

const AVATARS = ["🐯", "🤖", "🦊", "🐙", "🦋", "🐻", "🐼", "🦁"];
const AVATAR_COLORS = [
  "#FF6B35", "#7C3AED", "#EC4899",
  "#10B981", "#6366F1", "#F59E0B", "#EF4444", "#3B82F6",
];

const ORG_MESSAGES = [
  "Benvenuti al torneo!",
  "Ricordate di pagare la quota entro venerdì.",
  "Il torneo inizia domani alle 10:00.",
  "Ottimo lavoro nella prima giornata!",
  "Confermiamo la vostra iscrizione.",
  "Ci vediamo in campo!",
];

function buildMockTime(index: number): string {
  if (index === 0) {
    const h = faker.number.int({ min: 8, max: 22 });
    const m = faker.number.int({ min: 0, max: 59 });
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return (["Ieri", "Lun", "Dom", "Sab", "Ven", "Mer"] as const)[
    (index - 1) % 6
  ];
}

function generateChats(): Chat[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: faker.company.name(),
    tournamentName: `Torneo ${faker.word.adjective()} ${faker.location.city()}`,
    lastMessage: faker.lorem.sentence({ min: 3, max: 8 }),
    time: buildMockTime(i),
    unread: faker.datatype.boolean(),
    avatar: AVATARS[i % AVATARS.length] ?? "⚽",
    avatarBg: AVATAR_COLORS[i % AVATAR_COLORS.length] ?? "#FF6B35",
  }));
}

function getMockChatsCache(): Chat[] {
  if (!mockChatsCache) mockChatsCache = generateChats();
  return mockChatsCache;
}

function generateMessages(chatId: number): ChatMessage[] {
  const count = faker.number.int({ min: 3, max: 7 });
  const base = Date.now() - count * 15 * 60_000;
  return Array.from({ length: count }, (_, i) => {
    const fromMe = i % 2 === 0;
    const ts = new Date(base + i * 15 * 60_000);
    const time = `${String(ts.getHours()).padStart(2, "0")}:${String(ts.getMinutes()).padStart(2, "0")}`;
    return {
      id: chatId * 1000 + i,
      text: fromMe
        ? faker.helpers.arrayElement(ORG_MESSAGES)
        : faker.lorem.sentence({ min: 3, max: 10 }),
      fromMe,
      time,
      createdAt: ts.toISOString(),
    };
  });
}

function getMockMessages(chatId: number): ChatMessage[] {
  if (!mockMessagesCache.has(chatId)) {
    mockMessagesCache.set(chatId, generateMessages(chatId));
  }
  return mockMessagesCache.get(chatId)!;
}

// ── API functions ────────────────────────────────────────────────────────────

export async function fetchChats(token: string): Promise<Chat[]> {
  if (mockFlags.IS_MOCKING_FETCH_CHATS) {
    await new Promise((r) => setTimeout(r, 400));
    return [...getMockChatsCache()];
  }
  return apiFetch<Chat[]>("/chats", {}, token);
}

export async function fetchChatMessages(
  chatId: number,
  token: string,
): Promise<ChatMessage[]> {
  if (mockFlags.IS_MOCKING_FETCH_CHAT_MESSAGES) {
    await new Promise((r) => setTimeout(r, 300));
    return [...getMockMessages(chatId)];
  }
  return apiFetch<ChatMessage[]>(`/chats/${chatId}/messages`, {}, token);
}

export async function sendChatMessage(
  chatId: number,
  text: string,
  token: string,
): Promise<ChatMessage> {
  if (mockFlags.IS_MOCKING_SEND_CHAT_MESSAGE) {
    await new Promise((r) => setTimeout(r, 200));
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const msg: ChatMessage = {
      id: Date.now(),
      text,
      fromMe: true,
      time,
      createdAt: now.toISOString(),
    };
    getMockMessages(chatId).push(msg);
    const chat = getMockChatsCache().find((c) => c.id === chatId);
    if (chat) {
      chat.lastMessage = text;
      chat.time = time;
      chat.unread = false;
    }
    return msg;
  }
  return apiFetch<ChatMessage>(
    `/chats/${chatId}/messages`,
    { method: "POST", body: JSON.stringify({ text }) },
    token,
  );
}
