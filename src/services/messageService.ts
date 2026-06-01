import { Conversation, Message, User } from '../models';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { sortParticipantIds } from '../utils/participants';
import type { ConversationPreview, MessageDto } from '../types/domain';
import { paginateQuery } from './postService';

export async function findConversationForUser(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) throw new NotFoundError('Conversation introuvable');
  if (conversation.participantAId !== userId && conversation.participantBId !== userId) {
    throw new ForbiddenError();
  }
  return conversation;
}

export async function getOrCreateConversation(
  userId: string,
  otherUserId: string
): Promise<Conversation> {
  if (userId === otherUserId) {
    throw new ForbiddenError('Impossible de démarrer une conversation avec soi-même');
  }

  const other = await User.findByPk(otherUserId);
  if (!other) throw new NotFoundError('Utilisateur introuvable');

  const [participantAId, participantBId] = sortParticipantIds(userId, otherUserId);

  const [conversation] = await Conversation.findOrCreate({
    where: { participantAId, participantBId },
    defaults: { participantAId, participantBId },
  });

  return conversation;
}

export async function listConversations(userId: string): Promise<ConversationPreview[]> {
  const { Op } = await import('sequelize');
  const rows = await Conversation.findAll({
    where: {
      [Op.or]: [{ participantAId: userId }, { participantBId: userId }],
    },
    order: [['lastMessageAt', 'DESC']],
  });

  if (rows.length === 0) return [];

  const participantIds = rows.map((c) =>
    c.participantAId === userId ? c.participantBId : c.participantAId
  );
  const users = await User.findAll({ where: { id: participantIds } });
  const userMap = new Map(users.map((u) => [u.id, u.toPublicJSON()]));

  const conversationIds = rows.map((c) => c.id);
  const lastMessages = await Message.findAll({
    where: { conversationId: conversationIds },
    order: [['createdAt', 'DESC']],
  });

  const lastByConversation = new Map<string, Message>();
  for (const msg of lastMessages) {
    if (!lastByConversation.has(msg.conversationId)) {
      lastByConversation.set(msg.conversationId, msg);
    }
  }

  return rows.map((conversation) => {
    const otherId =
      conversation.participantAId === userId
        ? conversation.participantBId
        : conversation.participantAId;
    const last = lastByConversation.get(conversation.id);

    return {
      id: conversation.id,
      participant: userMap.get(otherId)!,
      lastMessage: last
        ? {
            id: last.id,
            content: last.content,
            senderId: last.senderId,
            createdAt: last.createdAt,
          }
        : null,
      lastMessageAt: conversation.lastMessageAt,
    };
  });
}

export async function listMessages(
  conversationId: string,
  userId: string,
  page = 1
): Promise<{ messages: MessageDto[]; pagination: ReturnType<typeof paginateQuery> & { total: number; totalPages: number } }> {
  await findConversationForUser(conversationId, userId);
  const { limit, offset, page: safePage } = paginateQuery(page, 50);

  const { count, rows } = await Message.findAndCountAll({
    where: { conversationId },
    order: [['createdAt', 'ASC']],
    limit,
    offset,
  });

  const senderIds = [...new Set(rows.map((m) => m.senderId))];
  const senders = await User.findAll({ where: { id: senderIds } });
  const senderMap = new Map(senders.map((s) => [s.id, s.toPublicJSON()]));

  const messages: MessageDto[] = rows.map((m) => ({
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    content: m.content,
    createdAt: m.createdAt,
    sender: senderMap.get(m.senderId)!,
  }));

  return {
    messages,
    pagination: {
      page: safePage,
      limit,
      offset,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
}

export async function sendMessage(
  conversationId: string,
  userId: string,
  content: string
): Promise<MessageDto> {
  await findConversationForUser(conversationId, userId);

  const message = await Message.create({
    conversationId,
    senderId: userId,
    content,
  });

  await Conversation.update(
    { lastMessageAt: message.createdAt },
    { where: { id: conversationId } }
  );

  const sender = await User.findByPk(userId);

  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
    sender: sender!.toPublicJSON(),
  };
}
