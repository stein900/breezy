import { body, param, query } from 'express-validator';
import { config } from '../config';

export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username: 3-30 caractères alphanumériques'),
  body('email').trim().isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Mot de passe: minimum 8 caractères'),
  body('displayName').trim().isLength({ min: 1, max: 50 }),
];

export const loginValidation = [
  body('login').trim().notEmpty().withMessage('Email ou username requis'),
  body('password').notEmpty(),
];

export const updateProfileValidation = [
  body('displayName').optional().trim().isLength({ min: 1, max: 50 }),
  body('bio').optional().trim().isLength({ max: 160 }),
  body('profilePhoto').optional().trim().isURL().withMessage('URL de photo invalide'),
];

export const createPostValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: config.postMaxLength })
    .withMessage(`Contenu: 1-${config.postMaxLength} caractères`),
];

export const createCommentValidation = [
  param('postId').isUUID(),
  body('content')
    .trim()
    .isLength({ min: 1, max: config.postMaxLength }),
];

export const createReplyValidation = [
  param('commentId').isUUID(),
  body('content')
    .trim()
    .isLength({ min: 1, max: config.postMaxLength }),
];

export const userIdParam = [param('userId').isUUID()];
export const postIdParam = [param('postId').isUUID()];
export const commentIdParam = [param('commentId').isUUID()];

export const paginationQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const suspendUserValidation = [
  param('userId').isUUID(),
  body('suspended').isBoolean(),
];

export const conversationIdParam = [param('conversationId').isUUID()];

export const startConversationValidation = [body('userId').isUUID()];

export const sendMessageValidation = [
  ...conversationIdParam,
  body('content')
    .trim()
    .isLength({ min: 1, max: config.messageMaxLength })
    .withMessage(`Message: 1-${config.messageMaxLength} caractères`),
];
