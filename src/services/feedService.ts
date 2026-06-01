import { Op } from 'sequelize';
import { Post, Repost, User } from '../models';
import type { FeedItem, PostWithMeta } from '../types/domain';
import { enrichPosts, getFollowingIds, paginateQuery } from './postService';

interface FeedEntry {
  kind: 'post' | 'repost';
  sortDate: Date;
  post: Post;
  repost?: Repost;
}

export async function buildFeed(
  userId: string,
  page = 1,
  limit = 20
): Promise<{ items: FeedItem[]; pagination: ReturnType<typeof paginateQuery> & { total: number; totalPages: number } }> {
  const { limit: safeLimit, offset, page: safePage } = paginateQuery(page, limit);
  const followingIds = await getFollowingIds(userId);
  const authorIds = [...followingIds, userId];

  const [posts, reposts] = await Promise.all([
    Post.findAll({
      where: { userId: authorIds, parentId: { [Op.is]: null } },
      order: [['createdAt', 'DESC']],
      limit: safeLimit * 2,
    }),
    Repost.findAll({
      where: { userId: authorIds },
      order: [['createdAt', 'DESC']],
      limit: safeLimit * 2,
    }),
  ]);

  const repostPostIds = [...new Set(reposts.map((r) => r.postId))];
  const repostPosts = repostPostIds.length
    ? await Post.findAll({
        where: { id: repostPostIds, parentId: { [Op.is]: null } },
      })
    : [];
  const repostPostMap = new Map(repostPosts.map((p) => [p.id, p]));

  const entries: FeedEntry[] = [
    ...posts.map((post) => ({
      kind: 'post' as const,
      sortDate: post.createdAt,
      post,
    })),
    ...reposts.flatMap((repost) => {
      const post = repostPostMap.get(repost.postId);
      if (!post) return [];
      return [
        {
          kind: 'repost' as const,
          sortDate: repost.createdAt,
          post,
          repost,
        },
      ];
    }),
  ];

  entries.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  const total = entries.length;
  const pageEntries = entries.slice(offset, offset + safeLimit);

  const uniquePosts = [...new Map(pageEntries.map((e) => [e.post.id, e.post])).values()];
  const enrichedMap = new Map(
    (await enrichPosts(uniquePosts, userId)).map((p) => [p.id, p])
  );

  const reposterIds = [...new Set(pageEntries.filter((e) => e.repost).map((e) => e.repost!.userId))];
  const reposters = reposterIds.length ? await User.findAll({ where: { id: reposterIds } }) : [];
  const reposterMap = new Map(reposters.map((u) => [u.id, u.toPublicJSON()]));

  const items: FeedItem[] = pageEntries.map((entry) => {
    const base = {
      kind: entry.kind,
      post: enrichedMap.get(entry.post.id)!,
    };
    if (entry.kind === 'repost' && entry.repost) {
      return {
        ...base,
        repost: {
          id: entry.repost.id,
          by: reposterMap.get(entry.repost.userId)!,
          createdAt: entry.repost.createdAt,
        },
      };
    }
    return base;
  });

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      offset,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}
