import { useState } from 'react';
import {
  Globe,
  Image,
  ListOrdered,
  MapPin,
  Smile,
} from 'lucide-react';
import { createPost } from '../../features/posts/api';
import { getErrorMessage } from '../../shared/api/client';
import { useAuth } from '../../context/AuthContext';
import type { Post } from '../../features/posts/types';
import { Avatar } from '../ui/Avatar';

const MAX = 280;

interface ComposePostProps {
  onPosted?: (post: Post) => void;
  placeholder?: string;
  autoFocus?: boolean;
  inModal?: boolean;
}

export function ComposePost({
  onPosted,
  placeholder = 'Quoi de neuf ?!',
  autoFocus,
  inModal,
}: ComposePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(autoFocus ?? false);

  if (!user) return null;

  const remaining = MAX - content.length;
  const canPost = content.trim().length > 0 && content.length <= MAX;
  const showCounter = content.length > 0;

  const handleSubmit = async () => {
    if (!canPost || loading) return;
    setLoading(true);
    setError('');
    try {
      const post = await createPost(content.trim());
      setContent('');
      setFocused(false);
      onPosted?.(post);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const iconBtn =
    'flex h-[34px] w-[34px] items-center justify-center rounded-full text-x-blue transition-colors hover:bg-x-blue/10';

  return (
    <div className={`x-divider ${inModal ? 'px-4 py-4' : 'px-4 py-3'}`}>
      <div className="flex gap-3">
        <Avatar user={user} size="md" />
        <div className="min-w-0 flex-1">
          {!inModal && (
            <div className="mb-1 flex items-center gap-1 text-x-blue">
              <Globe className="h-4 w-4" />
              <span className="text-[13px] font-bold">Tout le monde</span>
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX))}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            rows={focused || inModal ? 4 : 2}
            className="w-full resize-none bg-transparent text-[20px] leading-7 outline-none placeholder:text-x-gray"
          />

          {error && <p className="mb-2 text-[13px] text-x-pink">{error}</p>}

          {(focused || inModal || content.length > 0) && (
            <>
              <div className="my-3 border-t border-x-border" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  <button type="button" className={iconBtn} aria-label="Médias">
                    <Image className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                  <button type="button" className={iconBtn} aria-label="Sondage">
                    <ListOrdered className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                  <button type="button" className={iconBtn} aria-label="Emoji">
                    <Smile className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                  <button type="button" className={iconBtn} aria-label="Localisation">
                    <MapPin className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {showCounter && (
                    <div className="flex items-center gap-2">
                      {remaining <= 20 && (
                        <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="14" fill="none" stroke="#2f3336" strokeWidth="2" />
                          <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke={remaining < 0 ? '#f91880' : remaining < 20 ? '#ffd400' : '#1d9bf0'}
                            strokeWidth="2"
                            strokeDasharray={`${((MAX - remaining) / MAX) * 88} 88`}
                          />
                        </svg>
                      )}
                      {remaining <= 20 && (
                        <span
                          className={`text-[13px] ${remaining < 0 ? 'text-x-pink' : remaining < 20 ? 'text-[#ffd400]' : 'text-x-gray'}`}
                        >
                          {remaining}
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canPost || loading}
                    className="x-btn-post px-4 py-1.5 disabled:opacity-50"
                  >
                    {loading ? '...' : 'Poster'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function InlineComposeHint() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="x-divider px-4 py-3">
      <div className="flex gap-3 opacity-60">
        <Avatar user={user} />
        <div className="flex flex-1 items-center rounded-full border border-x-border px-4 py-3 text-[20px] text-x-gray">
          Quoi de neuf ?!
        </div>
      </div>
    </div>
  );
}
