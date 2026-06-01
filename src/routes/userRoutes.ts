import { Router } from 'express';
import * as userController from '../controllers/userController';
import {
  authenticate,
  ensureNotSuspended,
  optionalAuth,
  requireRoles,
  validate,
} from '../middleware/auth';
import {
  paginationQuery,
  suspendUserValidation,
  updateProfileValidation,
  userIdParam,
} from '../validators';
import { UserRole } from '../types';

const router = Router();

router.patch(
  '/me',
  authenticate,
  ensureNotSuspended,
  validate(updateProfileValidation),
  userController.updateProfile
);

router.get(
  '/:userId',
  optionalAuth,
  validate([...userIdParam, ...paginationQuery]),
  userController.getProfile
);

router.get(
  '/:userId/posts',
  optionalAuth,
  validate([...userIdParam, ...paginationQuery]),
  userController.getUserPosts
);

router.post(
  '/:userId/follow',
  authenticate,
  ensureNotSuspended,
  validate(userIdParam),
  userController.followUser
);

router.delete(
  '/:userId/follow',
  authenticate,
  ensureNotSuspended,
  validate(userIdParam),
  userController.unfollowUser
);

router.get(
  '/:userId/followers',
  validate(userIdParam),
  userController.getFollowers
);

router.get(
  '/:userId/following',
  validate(userIdParam),
  userController.getFollowing
);

router.patch(
  '/:userId/suspend',
  authenticate,
  requireRoles(UserRole.MODERATOR, UserRole.ADMIN),
  validate(suspendUserValidation),
  userController.suspendUser
);

export default router;
