import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../db/connection';
import { Post, Like, User, Repost } from '../models';
import type { PostWithMeta } from '../types/domain';

export type { PostWithMeta };

interface CountRow {
  id: string;
  count: number;
}

export async function enrichPosts(
  posts: Post[],
  currentUserId?: string
): Promise<PostWithMeta[]> {
  if (posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);
  const authorIds = [...new Set(posts.map((p) => p.userId))];

  const [authors, likeCounts, replyCounts, repostCounts, myLikes, myReposts] = await Promise.all([
    User.findAll({ where: { id: authorIds } }),
    sequelize.query<CountRow>(
      `SELECT post_id AS id, COUNT(*)::int AS count
       FROM likes WHERE post_id IN (:postIds) GROUP BY post_id`,
      { replacements: { postIds }, type: QueryTypes.SELECT }
    ),
    sequelize.query<CountRow>(
      `SELECT parent_id AS id, COUNT(*)::int AS count
       FROM posts WHERE parent_id IN (:postIds) GROUP BY parent_id`,
      { replacements: { postIds }, type: QueryTypes.SELECT }
    ),
    sequelize.query<CountRow>(
      `SELECT post_id AS id, COUNT(*)::int AS count
       FROM reposts WHERE post_id IN (:postIds) GROUP BY post_id`,
      { replacements: { postIds }, type: QueryTypes.SELECT }
    ),
    currentUserId
      ? Like.findAll({ where: { userId: currentUserId, postId: postIds } })
      : Promise.resolve([]),
    currentUserId
      ? Repost.findAll({ where: { userId: currentUserId, postId: postIds } })
      : Promise.resolve([]),
  ]);

  const authorMap = new Map(authors.map((a) => [a.id, a.toPublicJSON()]));
  const likeMap = new Map(likeCounts.map((l) => [l.id, l.count]));
  const replyMap = new Map(replyCounts.map((r) => [r.id, r.count]));
  const repostMap = new Map(repostCounts.map((r) => [r.id, r.count]));
  const myLikeSet = new Set(myLikes.map((l) => l.postId));
  const myRepostSet = new Set(myReposts.map((r) => r.postId));

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    parentId: post.parentId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: authorMap.get(post.userId)!,
    likeCount: likeMap.get(post.id) ?? 0,
    replyCount: replyMap.get(post.id) ?? 0,
    repostCount: repostMap.get(post.id) ?? 0,
    likedByMe: myLikeSet.has(post.id),
    repostedByMe: myRepostSet.has(post.id),
  }));
}

export async function getFollowingIds(userId: string): Promise<string[]> {
  const { Follow } = await import('../models');
  const follows = await Follow.findAll({ where: { followerId: userId } });
  return follows.map((f) => f.followingId);
}

export function paginateQuery(page = 1, limit = 20) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  return {
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
    page: safePage,
  };
}

export async function findPostOrThrow(postId: string): Promise<Post> {
  const post = await Post.findOne({
    where: { id: postId, parentId: { [Op.is]: null } },
  });
  if (!post) {
    const { NotFoundError } = await import('../utils/errors');
    throw new NotFoundError('Post introuvable');
  }
  return post;
}

export async function findCommentOrThrow(commentId: string): Promise<Post> {
  const comment = await Post.findOne({
    where: { id: commentId, parentId: { [Op.not]: null } },
  });
  if (!comment) {
    const { NotFoundError } = await import('../utils/errors');
    throw new NotFoundError('Commentaire introuvable');
  }
  return comment;
}
