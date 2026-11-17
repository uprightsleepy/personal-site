import Link from 'next/link'
import type { ReactNode } from 'react'
import type { WorkItem } from '@/lib/site'

// Links a piece of work to its case study or its live site. Work without
// either renders as plain text.
export default function WorkLink({
  item,
  className,
  children,
}: {
  item: WorkItem
  className?: string
  children: ReactNode
}) {
  if (!item.link) {
    return <span className={className}>{children}</span>
  }
  if (item.link.external) {
    return (
      <a href={item.link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link href={item.link.href} className={className}>
      {children}
    </Link>
  )
}
