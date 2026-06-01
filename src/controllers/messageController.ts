import { Request, Response, NextFunction } from 'express';
import {
  getOrCreateConversation,
  listConversations,
  listMessages,
  sendMessage,
} from '../services/messageService';
import { paramString } from '../utils/params';

export async function getConversations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const conversations = await listConversations(req.user!.userId);
    res.json({ conversations });
  } catch (err) {
    next(err);
  }
}

export async function startConversation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId: otherUserId } = req.body;
    const conversation = await getOrCreateConversation(req.user!.userId, otherUserId);
    res.status(201).json({ conversationId: conversation.id });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const conversationId = paramString(req.params.conversationId);
    const page = req.query.page as number | undefined;
    const result = await listMessages(conversationId, req.user!.userId, page);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function postMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const conversationId = paramString(req.params.conversationId);
    const message = await sendMessage(conversationId, req.user!.userId, req.body.content);
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function openConversationWithUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const otherUserId = paramString(req.params.userId);
    const conversation = await getOrCreateConversation(req.user!.userId, otherUserId);
    res.json({ conversationId: conversation.id });
  } catch (err) {
    next(err);
  }
}
