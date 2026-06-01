import { api } from '../../shared/api/client';
import type { Pagination } from '../../shared/types/user';
import type { ConversationPreview, Message } from './types';

export async function fetchConversations(): Promise<ConversationPreview[]> {
  const res = await api.get<{ conversations: ConversationPreview[] }>('/api/messages/conversations');
  return res.data.conversations;
}

export async function openConversation(userId: string): Promise<string> {
  const res = await api.post<{ conversationId: string }>(`/api/messages/with/${userId}`);
  return res.data.conversationId;
}

export async function fetchMessages(
  conversationId: string,
  page = 1
): Promise<{ messages: Message[]; pagination: Pagination }> {
  const res = await api.get(`/api/messages/conversations/${conversationId}`, {
    params: { page, limit: 50 },
  });
  return res.data;
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const res = await api.post<{ message: Message }>(
    `/api/messages/conversations/${conversationId}/messages`,
    { content }
  );
  return res.data.message;
}
