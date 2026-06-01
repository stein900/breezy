import { Request, Response, NextFunction } from 'express';
import { Repost } from '../models';
import { paramString } from '../utils/params';
import { findPostOrThrow, enrichPosts } from '../services/postService';

export async function repostPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    await findPostOrThrow(postId);

    const [, created] = await Repost.findOrCreate({
      where: { userId: req.user!.userId, postId },
    });

    res.status(created ? 201 : 200).json({ reposted: true });
  } catch (err) {
    next(err);
  }
}

export async function undoRepost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postId = paramString(req.params.postId);
    await Repost.destroy({
      where: { userId: req.user!.userId, postId },
    });
    res.json({ reposted: false });
  } catch (err) {
    next(err);
  }
}

export async function getReposts(
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
