import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

export function NavItem({ to, icon: Icon, label, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-5 rounded-full px-3 py-3 transition-colors hover:bg-white/10 ${
          isActive ? 'font-bold' : 'font-normal'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className="h-[26px] w-[26px] shrink-0"
            strokeWidth={isActive ? 0 : 2}
            fill={isActive ? 'currentColor' : 'none'}
          />
          <span className="hidden text-x-nav xl:inline">{label}</span>
        </>
      )}
    </NavLink>
  );
}
