import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="gutter pb-20 pt-10 md:pb-32 md:pt-20">
      <h1 className="title max-w-[11em]">This sheet isn&apos;t in the set.</h1>
      <p className="lead mt-8 max-w-[40ch] text-soft">
        There is no page at this address. The link may be mistyped, or the page may have moved.
      </p>
      <p className="mt-8">
        <Link href="/">Go to the home page</Link>
      </p>
    </div>
  )
}
