import { execSync } from 'node:child_process'

// The commit the site was built from. Cloudflare Pages provides it during a
// build; local builds ask git. Returns null when neither is available.
export function buildRevision(): string | null {
  const fromCloudflare = process.env.CF_PAGES_COMMIT_SHA
  if (fromCloudflare) return fromCloudflare
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return null
  }
}
