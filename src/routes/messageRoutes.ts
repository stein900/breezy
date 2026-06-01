import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { authenticate, ensureNotSuspended, validate } from '../middleware/auth';
import {
  conversationIdParam,
  paginationQuery,
  sendMessageValidation,
  startConversationValidation,
  userIdParam,
} from '../validators';

const router = Router();

router.use(authenticate, ensureNotSuspended);

router.get('/conversations', messageController.getConversations);

router.post(
  '/conversations',
  validate(startConversationValidation),
  messageController.startConversation
);

router.get(
  '/conversations/:conversationId',
  validate([...conversationIdParam, ...paginationQuery]),
  messageController.getMessages
);

router.post(
  '/conversations/:conversationId/messages',
  validate(sendMessageValidation),
  messageController.postMessage
);

router.post(
  '/with/:userId',
  validate(userIdParam),
  messageController.openConversationWithUser
);

export default router;
