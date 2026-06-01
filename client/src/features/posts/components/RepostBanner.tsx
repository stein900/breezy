import { Link } from 'react-router-dom';
import { Repeat2 } from 'lucide-react';
import type { RepostMeta } from '../types';
import { formatRelativeTime } from '../../../shared/utils/format';

interface RepostBannerProps {
  repost: RepostMeta;
}

export function RepostBanner({ repost }: RepostBannerProps) {
  return (
    <div className="mb-1 flex items-center gap-2 pl-1 text-[13px] leading-4 text-x-gray">
      <Repeat2 className="h-[14px] w-[14px]" />
      <Link to={`/user/${repost.by.id}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
        {repost.by.displayName}
      </Link>
      <span>a reposté</span>
      <span>· {formatRelativeTime(repost.createdAt)}</span>
    </div>
  );
}
