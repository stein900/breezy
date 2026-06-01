import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeed } from '../features/posts/api';
import { getErrorMessage } from '../shared/api/client';
import type { FeedItem } from '../features/posts/types';
import { FeedHeader } from '../components/layout/AppLayout';
import { ComposePost } from '../components/post/ComposePost';
import { FeedItemCard } from '../features/posts/components/PostCard';

export function HomePage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeed = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFeed();
      setItems(data.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <>
      <FeedHeader />
      <ComposePost onPosted={(post) => setItems((prev) => [{ kind: 'post', post }, ...prev])} />

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-x-blue border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="px-4 py-12 text-center">
          <p className="text-x-pink">{error}</p>
          <button type="button" onClick={loadFeed} className="mt-3 text-[15px] text-x-blue hover:underline">
            Réessayer
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="px-8 py-20 text-center">
          <h2 className="text-[31px] font-extrabold leading-9">Bienvenue sur Breezy !</h2>
          <p className="mt-3 text-[15px] leading-5 text-x-gray">
            Suivez des comptes pour voir leurs posts et reposts ici.
          </p>
        </div>
      )}

      {items.map((item) => (
        <FeedItemCard
          key={item.kind === 'repost' ? `repost-${item.repost!.id}` : item.post.id}
          item={item}
          onUpdate={(updated) =>
            setItems((prev) =>
              prev.map((i) => (i.post.id === updated.id ? { ...i, post: updated } : i))
            )
          }
        />
      ))}
    </>
  );
}

export function ExplorePage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-x-border bg-x-black/80 px-4 py-3 backdrop-blur-xl">
        <div className="relative">
          <input type="search" placeholder="Rechercher" className="x-search !py-2.5" readOnly />
        </div>
      </header>
      <div className="px-4 py-16 text-center">
        <h2 className="text-x-title">Explorer</h2>
        <p className="mt-2 text-[15px] text-x-gray">La recherche arrive bientôt.</p>
        <Link to="/" className="mt-4 inline-block text-[15px] text-x-blue hover:underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </>
  );
}

export function ComposePage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-x-border bg-x-black/80 px-4 py-3 backdrop-blur-xl">
        <h1 className="text-x-title">Poster</h1>
      </header>
      <ComposePost autoFocus inModal placeholder="Quoi de neuf ?!" />
    </>
  );
}
