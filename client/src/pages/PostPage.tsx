import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  createComment,
  createReply,
  fetchComments,
  fetchPost,
  fetchReplies,
} from '../features/posts/api';
import { getErrorMessage } from '../shared/api/client';
import type { Post } from '../features/posts/types';
import { PageHeader } from '../components/layout/AppLayout';
import { PostCard } from '../features/posts/components/PostCard';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';

function ReplyComposer({
  commentId,
  onReplied,
}: {
  commentId: string;
  onReplied: (reply: Post) => void;
}) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const reply = await createReply(commentId, content.trim());
      setContent('');
      setOpen(false);
      onReplied(reply);
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[13px] text-x-gray hover:text-x-blue"
      >
        Répondre
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 280))}
        placeholder="Poster votre réponse"
        rows={2}
        className="w-full resize-none rounded-lg border border-x-border bg-transparent px-3 py-2 text-[15px] outline-none focus:border-x-blue"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={loading || !content.trim()}
          className="x-btn-post px-4 py-1.5 text-[13px] disabled:opacity-50"
        >
          Répondre
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-4 py-1.5 text-[13px] font-bold hover:bg-white/10"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

function CommentThread({ comment }: { comment: Post }) {
  const [replies, setReplies] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadReplies = async () => {
    if (loaded) return;
    try {
      const data = await fetchReplies(comment.id);
      setReplies(data.replies);
      setLoaded(true);
    } catch (err) {
      console.error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    if (comment.replyCount > 0) loadReplies();
  }, [comment.id, comment.replyCount]);

  return (
    <div className="x-divider px-4 py-3">
      <PostCard post={comment} compact showActions={false} clickable={false} />
      <div className="ml-[52px]">
        <ReplyComposer
          commentId={comment.id}
          onReplied={(reply) => {
            setReplies((prev) => [...prev, reply]);
            setLoaded(true);
          }}
        />
        {replies.map((reply) => (
          <div key={reply.id} className="mt-3 border-l-2 border-x-border pl-3">
            <PostCard post={reply} compact showActions={false} clickable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [postData, commentsData] = await Promise.all([
          fetchPost(postId),
          fetchComments(postId),
        ]);
        setPost(postData);
        setComments(commentsData.comments);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  const handleComment = async (content: string) => {
    if (!postId) return;
    const comment = await createComment(postId, content);
    setComments((prev) => [...prev, comment]);
    setPost((p) => (p ? { ...p, replyCount: p.replyCount + 1 } : p));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-x-blue border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-x-pink">{error || 'Post introuvable'}</p>
        <Link to="/" className="mt-4 inline-block text-x-blue hover:underline">
          Retour
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Post" />
      <PostCard post={post} onUpdate={setPost} showActions clickable={false} />

      <div className="x-divider px-4 py-4">
        {user && (
          <div className="flex gap-3">
            <Avatar user={user} size="sm" />
            <CommentInput onSubmit={handleComment} />
          </div>
        )}
      </div>

      {comments.map((comment) => (
        <CommentThread key={comment.id} comment={comment} />
      ))}

      {comments.length === 0 && (
        <p className="px-4 py-12 text-center text-[15px] text-x-gray">
          Aucune réponse pour l&apos;instant.
        </p>
      )}
    </>
  );
}

function CommentInput({ onSubmit }: { onSubmit: (content: string) => Promise<void> }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-0 flex-1">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 280))}
        placeholder="Poster votre réponse"
        rows={2}
        className="w-full resize-none bg-transparent text-[17px] outline-none placeholder:text-x-gray"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={loading || !content.trim()}
          className="x-btn-post px-4 py-1.5 text-[13px] disabled:opacity-50"
        >
          Répondre
        </button>
      </div>
    </div>
  );
}
