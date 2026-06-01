import { Link, NavLink } from 'react-router-dom';
import { Bell, Home, Mail, MoreHorizontal, Search, Settings, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { XLogo } from '../icons/XLogo';
import { Avatar } from '../ui/Avatar';
import { NavItem } from './NavItem';

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-[275px] shrink-0 flex-col justify-between px-3 py-1 md:flex xl:px-2">
      <div>
        <Link
          to="/"
          className="mb-1 inline-flex rounded-full p-3 transition-colors hover:bg-white/10"
        >
          <XLogo className="h-[30px] w-[30px]" />
        </Link>

        <nav className="flex flex-col">
          <NavItem to="/" icon={Home} label="Accueil" end />
          <NavItem to="/explore" icon={Search} label="Explorer" />
          <span className="flex cursor-default items-center gap-5 rounded-full px-3 py-3 text-x-gray opacity-60">
            <Bell className="h-[26px] w-[26px]" strokeWidth={2} />
            <span className="hidden text-x-nav xl:inline">Notifications</span>
          </span>
          <NavItem to="/messages" icon={Mail} label="Messages" />
          {user && <NavItem to={`/user/${user.id}`} icon={User} label="Profil" />}
          {user && <NavItem to="/settings" icon={Settings} label="Paramètres" />}
        </nav>

        <Link
          to="/compose"
          className="mt-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-x-blue text-[17px] font-bold text-white transition-colors hover:bg-x-blue-hover xl:h-auto xl:w-[90%] xl:py-3.5"
        >
          <span className="hidden xl:inline">Poster</span>
          <svg className="h-6 w-6 xl:hidden" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-5.5v-2h5.5c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H11v2H5.5C4.12 22 3 20.88 3 19.5v-15z" />
          </svg>
        </Link>
      </div>

      {user && (
        <button
          type="button"
          onClick={logout}
          className="mb-3 flex w-full max-w-[90%] items-center gap-3 rounded-full p-3 transition-colors hover:bg-white/10"
        >
          <Avatar user={user} size="sm" ring />
          <div className="hidden min-w-0 flex-1 text-left xl:block">
            <p className="truncate text-[15px] font-bold leading-5">{user.displayName}</p>
            <p className="truncate text-[15px] leading-5 text-x-gray">@{user.username}</p>
          </div>
          <MoreHorizontal className="hidden h-[18px] w-[18px] text-x-white xl:block" />
        </button>
      )}
    </aside>
  );
}

function MobileNavLink({
  to,
  icon: Icon,
  end,
}: {
  to: string;
  icon: LucideIcon;
  end?: boolean;
}) {
  return (
    <NavLink to={to} end={end} className="rounded-full p-2.5">
      {({ isActive }) => (
        <Icon
          className="h-[26px] w-[26px]"
          strokeWidth={isActive ? 0 : 2}
          fill={isActive ? 'currentColor' : 'none'}
        />
      )}
    </NavLink>
  );
}

export function MobileNav() {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-x-border bg-x-black/85 px-6 py-2 backdrop-blur-xl md:hidden">
      <MobileNavLink to="/" icon={Home} end />
      <MobileNavLink to="/explore" icon={Search} />
      <Link
        to="/compose"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-x-blue"
      >
        <span className="text-lg font-light leading-none text-white">+</span>
      </Link>
      <MobileNavLink to="/messages" icon={Mail} />
      {user && <MobileNavLink to={`/user/${user.id}`} icon={User} />}
    </nav>
  );
}

export function RightPanel() {
  return (
    <aside className="hidden w-[350px] shrink-0 py-1 pl-4 xl:block">
      <div className="sticky top-2 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-x-gray" />
          <input type="search" placeholder="Rechercher" className="x-search" readOnly />
        </div>

        <div className="overflow-hidden rounded-2xl bg-x-dim">
          <h2 className="px-4 py-3 text-x-title">Tendances pour vous</h2>
          {[
            { tag: '#Breezy', posts: '12,4K posts' },
            { tag: 'TypeScript', posts: '8,2K posts' },
            { tag: '#DevWeb', posts: '5,1K posts' },
            { tag: 'React', posts: '21K posts' },
          ].map(({ tag, posts }) => (
            <button
              key={tag}
              type="button"
              className="w-full px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
            >
              <p className="text-[13px] leading-4 text-x-gray">Tendance · France</p>
              <p className="text-[15px] font-bold leading-5">{tag}</p>
              <p className="text-[13px] leading-4 text-x-gray">{posts}</p>
            </button>
          ))}
          <button
            type="button"
            className="w-full px-4 py-3 text-left text-[15px] text-x-blue hover:bg-white/[0.03]"
          >
            Afficher plus
          </button>
        </div>

        <div className="px-4 text-[13px] leading-4 text-x-gray">
          <p className="flex flex-wrap gap-x-2 gap-y-1">
            <span>Conditions d&apos;utilisation</span>
            <span>·</span>
            <span>Confidentialité</span>
          </p>
          <p className="mt-2">© 2026 Breezy Corp.</p>
        </div>
      </div>
    </aside>
  );
}
