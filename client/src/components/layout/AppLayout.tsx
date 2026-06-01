import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MobileNav, RightPanel, Sidebar } from './Sidebar';
import { XLogo } from '../icons/XLogo';

export function AppLayout() {
  const location = useLocation();
  const isMessages = location.pathname.startsWith('/messages');

  return (
    <div className="mx-auto flex min-h-screen max-w-[1280px] justify-center">
      <Sidebar />
      <main
        className={
          isMessages
            ? 'min-h-screen w-full max-w-[920px] flex-1 border-x border-x-border pb-[53px] md:pb-0'
            : 'x-col min-h-screen pb-[53px] md:pb-0'
        }
      >
        <Outlet />
      </main>
      {!isMessages && <RightPanel />}
      <MobileNav />
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-x-black lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(29,155,240,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(249,24,128,0.08),_transparent_50%)]" />
        <div className="relative z-10 p-12">
          <XLogo className="mb-16 h-[350px] w-[350px] opacity-[0.08]" />
          <h1 className="max-w-md text-[64px] font-extrabold leading-[1.1] tracking-tight">
            Ça se passe maintenant.
          </h1>
          <p className="mt-4 max-w-sm text-[31px] font-bold leading-9">
            Inscrivez-vous.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px] animate-slide-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function FeedHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-x-border bg-x-black/80 backdrop-blur-xl">
      <div className="flex md:hidden items-center px-4 py-3">
        <XLogo className="h-7 w-7" />
      </div>
      <div className="flex">
        <button type="button" className="x-tab x-tab-active">
          Pour vous
        </button>
        <button type="button" className="x-tab">
          Abonnements
        </button>
      </div>
    </header>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
}

export function PageHeader({ title, subtitle, backTo = '/' }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-6 border-b border-x-border bg-x-black/80 px-4 py-2 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="flex h-[34px] w-[34px] items-center justify-center rounded-full transition-colors hover:bg-white/10"
        aria-label="Retour"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div>
        <h1 className="text-x-title leading-6">{title}</h1>
        {subtitle && <p className="text-[13px] leading-4 text-x-gray">{subtitle}</p>}
      </div>
    </header>
  );
}

export function ProfileHeader({
  title,
  postCount,
  backTo = '/',
}: {
  title: string;
  postCount?: number;
  backTo?: string;
}) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-6 border-b border-x-border bg-x-black/65 px-4 py-2 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="flex h-[34px] w-[34px] items-center justify-center rounded-full transition-colors hover:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div>
        <h1 className="text-x-title leading-6">{title}</h1>
        {postCount !== undefined && (
          <p className="text-[13px] leading-4 text-x-gray">{postCount} posts</p>
        )}
      </div>
    </header>
  );
}
