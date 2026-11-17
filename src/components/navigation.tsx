"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

const links = [
  { href: '/case-studies', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Writing' },
]

const subscribeToNothing = () => () => {}

export default function Navigation() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  // The stored theme is only known in the browser. Until then the button
  // shows the default label so the prerendered HTML and first render agree.
  const mounted = useSyncExternalStore(subscribeToNothing, () => true, () => false)
  // Blueprint is the default theme (next-themes calls it "dark").
  const blueprint = !mounted || resolvedTheme !== 'light'

  const toggleTheme = () => {
    const next = blueprint ? 'light' : 'dark'
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || typeof document.startViewTransition !== 'function') {
      setTheme(next)
      return
    }
    // Wipe the new sheet in (see .theme-wipe in globals.css). The class has
    // to change inside the callback so the browser can snapshot both states.
    root.classList.add('theme-wipe')
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next))
      root.classList.remove('light', 'dark')
      root.classList.add(next)
    })
    transition.finished.finally(() => root.classList.remove('theme-wipe'))
  }

  return (
    <header className="gutter flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5 md:py-7">
      <Link href="/" className="nav-link font-bold" aria-current={pathname === '/' ? 'page' : undefined}>
        Henry Phillips
      </Link>
      <nav aria-label="Main" className="flex flex-wrap items-baseline gap-x-5 md:gap-x-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nav-link"
            aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={toggleTheme}
          className="cursor-pointer text-soft hover:text-ink hover:underline"
          aria-label={blueprint ? 'Switch to the paper theme' : 'Switch to the blueprint theme'}
        >
          {blueprint ? 'Paper' : 'Blueprint'}
        </button>
      </nav>
    </header>
  )
}
