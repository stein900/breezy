import type { Message } from '../types';
import { formatRelativeTime } from '../../../shared/utils/format';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isOwn ? 'bg-x-blue text-white' : 'bg-x-dim text-x-white'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-[15px] leading-5">{message.content}</p>
        <time className={`mt-1 block text-[11px] ${isOwn ? 'text-white/70' : 'text-x-gray'}`}>
          {formatRelativeTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}
