import Link from 'next/link'
import type { WorkItem } from '@/lib/site'

// One piece of work: label, title, summary and tags on the left, a single
// headline number on the right.
export default function WorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="grid overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:grid-cols-3">
      <div className="p-8 md:col-span-2">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {item.kind} <span aria-hidden="true">/</span> {item.period}
        </p>
        <h3 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {item.title}
        </h3>
        <p className="mb-5 leading-relaxed text-gray-700 dark:text-gray-300">
          {item.summary}
        </p>
        <ul className="mb-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              {tag}
            </li>
          ))}
        </ul>
        {item.link &&
          (item.link.external ? (
            <a
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-offset-gray-800"
            >
              {item.link.label}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <Link
              href={item.link.href}
              className="inline-flex items-center gap-1 rounded font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-offset-gray-800"
            >
              {item.link.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
      </div>
      <div className="flex flex-col justify-center border-t border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900/40 md:border-l md:border-t-0">
        <p className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text pb-1 text-5xl font-bold leading-tight text-transparent">
          {item.stat.value}
        </p>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{item.stat.label}</p>
      </div>
    </article>
  )
}
