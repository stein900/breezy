import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Post, Like } from '../models';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { paramString } from '../utils/params';
import { UserRole } from '../types';
import {
  enrichPosts,
  findPostOrThrow,
  findCommentOrThrow,
  paginateQuery,
} from '../services/postService';
import { buildFeed } from '../services/feedService';

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const post = await Post.create({
      userId: req.user!.userId,
      content: req.body.content,
    });
    const [enriched] = await enrichPosts([post], req.user!.userId);
    res.status(201).json({ post: enriched });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    const post = await findPostOrThrow(postId);
    if (post.userId !== req.user!.userId) {
      throw new ForbiddenError('Vous ne pouvez modifier que vos propres posts');
    }

    post.content = req.body.content;
    await post.save();

    const [enriched] = await enrichPosts([post], req.user!.userId);
    res.json({ post: enriched });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    const post = await findPostOrThrow(postId);
    if (post.userId !== req.user!.userId && req.user!.role === UserRole.USER) {
      throw new ForbiddenError();
    }
    await post.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    const post = await findPostOrThrow(postId);
    const [enriched] = await enrichPosts([post], req.user?.userId);
    res.json({ post: enriched });
  } catch (err) {
    next(err);
  }
}

export async function getFeed(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query.page as number | undefined;
    const limit = req.query.limit as number | undefined;
    const { items, pagination } = await buildFeed(req.user!.userId, page, limit);

    res.json({
      items,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function likePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    await findPostOrThrow(postId);
    const [, created] = await Like.findOrCreate({
      where: { userId: req.user!.userId, postId },
    });
    res.status(created ? 201 : 200).json({ liked: true });
  } catch (err) {
    next(err);
  }
}

export async function unlikePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    await Like.destroy({
      where: { userId: req.user!.userId, postId },
    });
    res.json({ liked: false });
  } catch (err) {
    next(err);
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    await findPostOrThrow(postId);

    const comment = await Post.create({
      userId: req.user!.userId,
      content: req.body.content,
      parentId: postId,
    });

    const [enriched] = await enrichPosts([comment], req.user!.userId);
    res.status(201).json({ comment: enriched });
  } catch (err) {
    next(err);
  }
}

export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    await findPostOrThrow(postId);

    const { page, limit, offset } = paginateQuery(
      req.query.page as number | undefined,
      req.query.limit as number | undefined
    );

    const { count, rows } = await Post.findAndCountAll({
      where: { parentId: postId },
      order: [['createdAt', 'ASC']],
      limit,
      offset,
    });

    const comments = await enrichPosts(rows, req.user?.userId);

    res.json({
      comments,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function createReply(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const commentId = paramString(req.params.commentId);
    const comment = await findCommentOrThrow(commentId);

    const reply = await Post.create({
      userId: req.user!.userId,
      content: req.body.content,
      parentId: comment.id,
    });

    const [enriched] = await enrichPosts([reply], req.user!.userId);
    res.status(201).json({ reply: enriched });
  } catch (err) {
    next(err);
  }
}

export async function getReplies(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const commentId = paramString(req.params.commentId);
    await findCommentOrThrow(commentId);

    const { page, limit, offset } = paginateQuery(
      req.query.page as number | undefined,
      req.query.limit as number | undefined
    );

    const { count, rows } = await Post.findAndCountAll({
      where: { parentId: commentId },
      order: [['createdAt', 'ASC']],
      limit,
      offset,
    });

    const replies = await enrichPosts(rows, req.user?.userId);

    res.json({
      replies,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
}
