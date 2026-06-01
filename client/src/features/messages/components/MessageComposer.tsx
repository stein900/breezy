import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';

interface MessageComposerProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text || loading || disabled) return;
    setLoading(true);
    try {
      await onSend(text);
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 border-t border-x-border px-4 py-3"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 2000))}
        placeholder="Écrivez un message..."
        rows={1}
        disabled={disabled}
        className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-x-border bg-x-dim px-4 py-3 text-[15px] outline-none focus:border-x-blue disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!content.trim() || loading || disabled}
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-x-blue text-white transition-colors hover:bg-x-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Envoyer"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
