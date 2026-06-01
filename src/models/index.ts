import { User } from './User';
import { Post } from './Post';
import { Like } from './Like';
import { Follow } from './Follow';
import { Repost } from './Repost';
import { Conversation } from './Conversation';
import { Message } from './Message';

// User ↔ Post
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Post self-reference (comments / replies)
Post.hasMany(Post, { foreignKey: 'parentId', as: 'replies' });
Post.belongsTo(Post, { foreignKey: 'parentId', as: 'parent' });

// Likes
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Follows
User.hasMany(Follow, { foreignKey: 'followerId', as: 'following' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'followers' });
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'followed' });

// Reposts
User.hasMany(Repost, { foreignKey: 'userId', as: 'reposts' });
Repost.belongsTo(User, { foreignKey: 'userId', as: 'reposter' });
Post.hasMany(Repost, { foreignKey: 'postId', as: 'reposts' });
Repost.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Conversations & Messages
User.hasMany(Conversation, { foreignKey: 'participantAId', as: 'conversationsAsA' });
User.hasMany(Conversation, { foreignKey: 'participantBId', as: 'conversationsAsB' });
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

export { User, Post, Like, Follow, Repost, Conversation, Message };
