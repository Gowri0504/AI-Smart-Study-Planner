'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  Trophy, 
  Users, 
  Clock,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
  { name: 'Revision', href: '/revision', icon: Clock },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Don't show navbar on login page
  if (pathname === '/login') return null

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-200 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-primary-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold font-jakarta bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                StudyIntel
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  pathname === item.href
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-slate-600 hover:bg-surface-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-4 w-4", pathname === item.href ? "text-primary-600" : "text-slate-400")} />
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Profile / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4 pl-4 border-l border-surface-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-900">{session.user?.name}</span>
                  <span className="text-xs font-medium text-slate-500">{session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-surface-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden transition-all duration-300", isMenuOpen ? "block opacity-100" : "hidden opacity-0")}>
        <div className="space-y-1 px-2 pb-3 pt-2 bg-white/90 backdrop-blur-xl border-t border-surface-100">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-base font-bold",
                pathname === item.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-surface-100 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary-600" : "text-slate-400")} />
              {item.name}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex w-full items-center gap-3 px-3 py-3 text-base font-bold text-rose-600 hover:bg-rose-50 rounded-xl mt-2"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-base font-bold text-primary-600 hover:bg-primary-50 rounded-xl mt-2 border border-primary-100"
            >
              <Sparkles className="h-5 w-5" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
