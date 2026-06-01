import { Link } from 'react-router-dom';
import type { ConversationPreview } from '../types';
import { Avatar } from '../../../components/ui/Avatar';
import { formatRelativeTime } from '../../../shared/utils/format';

interface ConversationRowProps {
  conversation: ConversationPreview;
  active?: boolean;
}

export function ConversationRow({ conversation, active }: ConversationRowProps) {
  const { participant, lastMessage } = conversation;
  const preview = lastMessage?.content ?? 'Démarrer la conversation';

  return (
    <Link
      to={`/messages/${conversation.id}`}
      className={`flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] ${
        active ? 'bg-white/[0.05]' : ''
      }`}
    >
      <Avatar user={participant} size="md" />
      <div className="min-w-0 flex-1 border-b border-x-border pb-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-bold">{participant.displayName}</p>
          {lastMessage && (
            <time className="shrink-0 text-[13px] text-x-gray">
              {formatRelativeTime(lastMessage.createdAt)}
            </time>
          )}
        </div>
        <p className="truncate text-[15px] text-x-gray">@{participant.username}</p>
        <p className="mt-0.5 truncate text-[15px] text-x-gray">{preview}</p>
      </div>
    </Link>
  );
}
