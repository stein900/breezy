import { Router } from 'express';
import * as postController from '../controllers/postController';
import * as repostController from '../controllers/repostController';
import {
  authenticate,
  ensureNotSuspended,
  optionalAuth,
  validate,
} from '../middleware/auth';
import {
  commentIdParam,
  createCommentValidation,
  createPostValidation,
  createReplyValidation,
  paginationQuery,
  postIdParam,
} from '../validators';

const router = Router();

router.get(
  '/feed',
  authenticate,
  ensureNotSuspended,
  validate(paginationQuery),
  postController.getFeed
);

router.post(
  '/',
  authenticate,
  ensureNotSuspended,
  validate(createPostValidation),
  postController.createPost
);

router.get(
  '/:postId',
  optionalAuth,
  validate(postIdParam),
  postController.getPost
);

router.patch(
  '/:postId',
  authenticate,
  ensureNotSuspended,
  validate([...postIdParam, ...createPostValidation]),
  postController.updatePost
);

router.delete(
  '/:postId',
  authenticate,
  ensureNotSuspended,
  validate(postIdParam),
  postController.deletePost
);

router.post(
  '/:postId/like',
  authenticate,
  ensureNotSuspended,
  validate(postIdParam),
  postController.likePost
);

router.delete(
  '/:postId/like',
  authenticate,
  ensureNotSuspended,
  validate(postIdParam),
  postController.unlikePost
);

router.post(
  '/:postId/repost',
  authenticate,
  ensureNotSuspended,
  validate(postIdParam),
  repostController.repostPost
);

router.delete(
  '/:postId/repost',
  authenticate,
  ensureNotSuspended,
  validate(postIdParam),
  repostController.undoRepost
);

router.post(
  '/:postId/comments',
  authenticate,
  ensureNotSuspended,
  validate(createCommentValidation),
  postController.createComment
);

router.get(
  '/:postId/comments',
  optionalAuth,
  validate([...postIdParam, ...paginationQuery]),
  postController.getComments
);

router.post(
  '/comments/:commentId/replies',
  authenticate,
  ensureNotSuspended,
  validate(createReplyValidation),
  postController.createReply
);

router.get(
  '/comments/:commentId/replies',
  optionalAuth,
  validate([...commentIdParam, ...paginationQuery]),
  postController.getReplies
);

export default router;
