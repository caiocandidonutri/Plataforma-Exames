import { Outlet, Link, useLocation } from 'react-router-dom'
import { Activity, Beaker, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 hidden sm:block">
            MedSys Analytics
          </h1>
        </div>
        <nav className="flex items-center gap-6 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 shadow-inner">
          <Link
            to="/"
            className={cn(
              'text-sm font-semibold transition-all flex items-center gap-2 px-3 py-1.5 rounded-full',
              location.pathname === '/'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-primary',
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/integracoes"
            className={cn(
              'text-sm font-semibold transition-all flex items-center gap-2 px-3 py-1.5 rounded-full',
              location.pathname === '/integracoes'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-primary',
            )}
          >
            <Beaker className="w-4 h-4" />
            <span className="hidden sm:inline">Integrações Lab</span>
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        <Outlet />
      </main>
    </div>
  )
}
