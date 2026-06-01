import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { User, Follow, Post } from '../models';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { enrichPosts, paginateQuery } from '../services/postService';
import { paramString } from '../utils/params';

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = paramString(req.params.userId);
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('Utilisateur introuvable');

    const followerCount = await Follow.count({ where: { followingId: userId } });
    const followingCount = await Follow.count({ where: { followerId: userId } });
    const postCount = await Post.count({
      where: { userId, parentId: { [Op.is]: null } },
    });

    let isFollowing = false;
    if (req.user && req.user.userId !== userId) {
      const follow = await Follow.findOne({
        where: { followerId: req.user.userId, followingId: userId },
      });
      isFollowing = !!follow;
    }

    res.json({
      user: user.toPublicJSON(),
      stats: { followerCount, followingCount, postCount },
      isFollowing,
      isOwnProfile: req.user?.userId === userId,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findByPk(req.user!.userId);
    if (!user) throw new NotFoundError();

    const { displayName, bio, profilePhoto } = req.body;
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    await user.save();
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

export async function getUserPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = paramString(req.params.userId);
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('Utilisateur introuvable');

    const { page, limit, offset } = paginateQuery(
      req.query.page as number | undefined,
      req.query.limit as number | undefined
    );

    const { count, rows } = await Post.findAndCountAll({
      where: { userId, parentId: { [Op.is]: null } },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const posts = await enrichPosts(rows, req.user?.userId);

    res.json({
      posts,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function followUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = paramString(req.params.userId);
    const followerId = req.user!.userId;

    if (userId === followerId) {
      throw new ForbiddenError('Impossible de se suivre soi-même');
    }

    const target = await User.findByPk(userId);
    if (!target) throw new NotFoundError('Utilisateur introuvable');

    const [, created] = await Follow.findOrCreate({
      where: { followerId, followingId: userId },
    });

    res.status(created ? 201 : 200).json({ following: true });
  } catch (err) {
    next(err);
  }
}

export async function unfollowUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = paramString(req.params.userId);
    await Follow.destroy({
      where: { followerId: req.user!.userId, followingId: userId },
    });
    res.json({ following: false });
  } catch (err) {
    next(err);
  }
}

export async function getFollowers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = paramString(req.params.userId);
    const follows = await Follow.findAll({
      where: { followingId: userId },
      include: [{ model: User, as: 'follower' }],
    });
    res.json({
      followers: follows.map((f) => (f as Follow & { follower: User }).follower.toPublicJSON()),
    });
  } catch (err) {
    next(err);
  }
}

export async function getFollowing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = paramString(req.params.userId);
    const follows = await Follow.findAll({
      where: { followerId: userId },
      include: [{ model: User, as: 'followed' }],
    });
    res.json({
      following: follows.map((f) => (f as Follow & { followed: User }).followed.toPublicJSON()),
    });
  } catch (err) {
    next(err);
  }
}

export async function suspendUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = paramString(req.params.userId);
    const { suspended } = req.body;

    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('Utilisateur introuvable');

    user.isSuspended = suspended;
    await user.save();

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}
