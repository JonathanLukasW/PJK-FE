import { client } from "./client";
import type {
  LocationInput,
  ChatSession,
  ChatSendResponse,
  ChatHistoryResponse,
  SuccessResponse,
} from "@/types";

export async function createChatSession(
  location: LocationInput,
  modelName = "llama-3.3-70b-versatile"
): Promise<ChatSession> {
  const res = await client.post<SuccessResponse<ChatSession>>("/api/chat/sessions", {
    location: {
      lat: location.lat,
      lng: location.lng,
      city: location.city,
      province: location.province,
      display_name: location.display_name,
    },
    model_name: modelName,
  });
  return res.data;
}

export interface SendMessageOptions {
  message: string;
  session_id: string;
  location?: LocationInput | null;
  model_name?: string | null;
}

export async function sendChatMessage(
  opts: SendMessageOptions
): Promise<ChatSendResponse> {
  const { message, session_id, location = null, model_name = null } = opts;

  const res = await client.post<SuccessResponse<ChatSendResponse>>("/api/chat/send", {
    message,
    session_id,
    location,
    history: [],
    model_name,
  });
  return res.data;
}

export async function getChatHistory(session_id: string): Promise<ChatHistoryResponse> {
  const res = await client.get<SuccessResponse<ChatHistoryResponse>>(
    `/api/chat/sessions/${session_id}/history`
  );
  return res.data;
}

export async function closeChatSession(session_id: string): Promise<void> {
  try {
    await client.delete<unknown>(`/api/chat/sessions/${session_id}`);
  } catch {
  }
}
