import type { Metadata } from 'next'
import ProjectStudy, { type Study } from '@/components/project-study'

const title = 'Engineering an Interactive Geolocation Game'
const description =
  'How I built Spawnpointed, a daily video game geolocation game: one Cloudflare Worker, D1 and R2, HMAC-signed play state, passkey sign-in and a CI pipeline that scans its own history.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/projects/spawnpointed' },
  keywords: [
    'Spawnpointed',
    'Cloudflare Workers',
    'D1',
    'R2',
    'React',
    'Passkeys',
    'Full-stack development',
    'Software engineering project',
  ],
  openGraph: {
    title: `${title} | Henry Phillips`,
    description,
    url: 'https://henryp.me/projects/spawnpointed',
    images: [{ url: '/og/spawnpointed.png', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/spawnpointed.png'],
  },
}

// Every statement below is taken from the project's repository: its plan,
// its infrastructure and accounts notes, the Worker's source and the CI
// workflow. Update it from there, not from memory.
const study: Study = {
  path: '/projects/spawnpointed',
  name: 'Spawnpointed',
  title: 'Engineering an interactive geolocation game',
  lead: 'A daily game that asks which video game a screenshot is from, and where on its map it was taken',
  intro:
    'Spawnpointed is a video game geolocation platform that challenges players to identify games and pinpoint locations within virtual environments. I built the application to explore interactive gameplay systems, full-stack development, and the operational challenges of maintaining an independently developed software product.',
  description,
  image: '/og/spawnpointed.png',
  published: '2026-11-26',
  modified: '2026-11-26',
  about: ['Cloudflare Workers', 'React', 'Web application security', 'Game development', 'CI/CD'],
  facts: [
    ['Period', '2026 to now'],
    ['Stack', 'React, TypeScript, Vite, Cloudflare Workers, D1, R2, Leaflet, GitHub Actions'],
  ],
  site: { href: 'https://spawnpointed.com', label: 'spawnpointed.com' },
  sections: [
    {
      heading: 'How a round works',
      paragraphs: [
        'Each day has five rounds worth 1,000 points each, and every player gets the same five. A round has two stages. In the first, the player names the game from a screenshot. There are three attempts: the first is worth 400 points, the second 250 after the release year is shown, and the third 100 after the platform is shown.',
        'In the second stage the player drops a pin on that game’s map. A pin on the spot scores 600, and the score falls away with distance. Distance is measured as a share of the map’s diagonal, so a city map and a continent map score the same way whatever units the game uses.',
      ],
    },
    {
      heading: 'Architecture',
      paragraphs: [
        'The whole application is one Cloudflare Worker. It serves the React single-page app as static assets and answers the API from the same deployment. A D1 database (SQLite) holds the catalogue of games, maps and screenshots, each day’s rounds, scores and accounts. Screenshots and map tiles are stored in an R2 bucket on its own hostname, under content-hashed names with immutable cache headers.',
        'I chose Cloudflare on cost. It is free at low traffic, R2 does not charge for egress, and the free tier stops serving when a limit is reached instead of sending a bill. Of the alternatives I priced, Firebase Hosting and Cloud Storage behind Cloud CDN both charge for image egress, and Cloud Run with Firestore meant a second provider and cold starts when a score is submitted.',
      ],
      rows: [
        ['Frontend', 'React and TypeScript, built with Vite and served by the Worker as static assets'],
        ['API', 'One Worker with a plain fetch handler, no framework'],
        ['Database', 'D1, with the schema kept as numbered SQL migrations'],
        ['Images', 'R2, with maps cut into tiles and drawn with Leaflet'],
      ],
    },
    {
      heading: 'Daily rounds and game state',
      paragraphs: [
        'A day’s rounds are picked by a random number generator seeded with an HMAC of the date under a server secret. The picker skips anything used in the previous 60 days. The first request for a day computes the rounds and stores them in D1, and from then on the stored row is the truth, so a deploy or a catalogue edit cannot change a day that people have already played.',
        'The Worker keeps no session for a game in progress. Every response carries the play state (the date, the player, the round, the attempts used and the scores so far) signed with HMAC, and the browser sends it back with the next move. The Worker verifies the signature, applies the move and returns a new signed state.',
        'The answers never reach the browser. The client works in the pixel space of the map image, and the Worker alone holds the answer, converts pixels to the game’s world coordinates and computes the score.',
      ],
    },
    {
      heading: 'Maps and coordinates',
      paragraphs: [
        'Every map has three control points that tie pixels on the map image to positions in the game’s own world units. An affine transform is solved from those points, which is what lets a pin on an image be compared with where a screenshot was taken. A detailed map of an area inside a larger one, such as a single zone of a continent, carries its own control points into the parent map’s units.',
        'Games, maps and screenshots are added through a contributor area in the app. Dropping a map image tiles it in the browser and uploads the tiles, and a screenshot is placed by clicking where it was taken. In production that area sits behind Cloudflare Access.',
      ],
    },
    {
      heading: 'Accounts and Discord',
      paragraphs: [
        'Playing never needs an account. Signing in is optional and exists to carry progress between devices. It supports passkeys, implemented with SimpleWebAuthn, and OAuth sign-in with Google or Discord. The session is a sealed, HttpOnly cookie.',
        'There is a Discord bot with slash commands and a daily recap for servers, and the game also runs inside Discord as an Activity. The bot’s endpoint checks the Ed25519 signature on every request Discord sends.',
      ],
    },
    {
      heading: 'Security',
      list: [
        'Play state is signed and answers stay on the server, so a score cannot be forged by editing a request and an answer cannot be read out of the page.',
        'Only scores that come with a valid Cloudflare Turnstile token, or from a player signed in with Discord inside the Discord Activity, count toward the day’s ranking.',
        'A rate limit sits in front of the API, ahead of the Worker.',
        'The site sends a Content-Security-Policy, and the Worker collects the violation reports browsers send back.',
        'Signing keys and OAuth credentials are Worker secrets and are not in the repository.',
      ],
    },
    {
      heading: 'Testing and delivery',
      paragraphs: [
        'The repository has 47 test files with more than 300 tests, run with Vitest. They cover scoring, the daily picker, signed state, accounts, the coordinate maths and the map tiler.',
        'CI runs the type check, the tests, the linter and a dependency audit on every push and pull request. It also scans the whole git history for secrets with Gitleaks and checks the workflow file itself with zizmor. Actions are pinned to commit hashes, and Dependabot opens weekly update pull requests. A push to main applies the D1 migrations and deploys the Worker.',
      ],
    },
    {
      heading: 'Trade-offs',
      list: [
        'Checking every guess on the server costs more Worker requests than sending the answers to the browser would. I kept the answers on the server.',
        'There is one production configuration and a setup script, with no Terraform. That is deliberate until there is a second environment or a second person.',
        'Sessions are stateless, so signing out cannot revoke a copied cookie before it expires.',
        'Throwaway player ids and answers shared between friends are accepted. Closing those would need accounts for everyone.',
      ],
    },
  ],
}

export default function Spawnpointed() {
  return <ProjectStudy study={study} />
}
