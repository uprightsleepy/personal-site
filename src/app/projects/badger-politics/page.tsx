import type { Metadata } from 'next'
import ProjectStudy, { type Study } from '@/components/project-study'

const title = 'Building a Civic Data Platform for Wisconsin'
const description =
  'How I built Badger Politics: a Python pipeline that loads Wisconsin public records into SQLite behind integrity gates, a static Astro site and keyless JSON API, and keyless deploys from GitHub Actions.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/projects/badger-politics' },
  keywords: [
    'Badger Politics',
    'Civic technology',
    'Data engineering',
    'Python',
    'SQLite',
    'Astro',
    'Workload Identity Federation',
    'Software engineering project',
  ],
  openGraph: {
    title: `${title} | Henry Phillips`,
    description,
    url: 'https://henryp.me/projects/badger-politics',
    images: [{ url: '/og/badger-politics.png', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/badger-politics.png'],
  },
}

// Every statement below is taken from the project's public repository: its
// README, the importer's checks, the site's verification scripts, the
// workflows and the infrastructure code. Update it from there.
const study: Study = {
  path: '/projects/badger-politics',
  name: 'Badger Politics',
  title: 'Building a civic data platform for Wisconsin',
  lead: 'A free, open-source site that puts Wisconsin bills, votes, campaign finance and elections in one place, built from official public records',
  intro:
    'Badger Politics is an independent civic technology project designed to make Wisconsin election, legislative, and representative information more accessible. The project combines public data, application development, and infrastructure automation to present complex civic information through a centralized platform.',
  description,
  image: '/og/badger-politics.png',
  published: '2026-11-26',
  modified: '2026-11-26',
  about: ['Civic technology', 'Data engineering', 'SQLite', 'Static site generation', 'CI/CD'],
  facts: [
    ['Period', '2026 to now'],
    [
      'Stack',
      'Python, SQLite, Astro, Pagefind, Terraform (OpenTofu), GitHub Actions, GCP, Firebase Hosting',
    ],
    ['Licence', 'Apache 2.0'],
  ],
  site: { href: 'https://badgerpolitics.org', label: 'badgerpolitics.org' },
  source: {
    href: 'https://github.com/uprightsleepy/badger-politics',
    label: 'github.com/uprightsleepy/badger-politics',
  },
  sections: [
    {
      heading: 'Architecture',
      paragraphs: [
        'The site is a pipeline with a static site at the end of it. Scrapers and importers fetch public records and archive the raw data. A SQLite database is rebuilt from that archive on every run. Integrity checks run against the database, and only if they pass are the data products written and the site built with Astro and published to Firebase Hosting.',
        'What is served is entirely static. There are no servers and no functions behind the site, which is how the project holds to a running cost of about two dollars a month plus domains. SQLite is the only database by rule.',
      ],
    },
    {
      heading: 'Data sources and ingestion',
      rows: [
        [
          'Legislature',
          'Bills, votes and members through the Open States scrapers for Wisconsin, pinned to a version, with the Legislature’s own member pages, subject index and plain-language bill analyses',
        ],
        ['Elections', 'Wisconsin Elections Commission ballot access lists and certified canvasses'],
        ['Campaign finance', 'The state’s campaign finance system, fetched month by month'],
        ['Congress', 'Roll calls from the U.S. Senate’s and the House Clerk’s published XML'],
        ['City councils', 'Recorded votes for Milwaukee, Madison, Appleton, Waukesha and West Allis'],
      ],
      paragraphs: [
        'The Open States scrapers are GPL-licensed and this project is Apache 2.0, so they are run only as a command-line subprocess and never imported. Changes they need are kept as patches beside the pipeline.',
      ],
    },
    {
      heading: 'Integrity gates',
      paragraphs: [
        'A run that fails a check stops before any snapshot is written. The rule in the repository is that a check is never weakened to make a run pass: the scraper or importer is fixed, or the run fails.',
      ],
      list: [
        'Yes and no totals on every roll call must match the official counts exactly.',
        'The number of bills in a session cannot fall more than 2% against the previous run.',
        'References must resolve across every table: votes to people and events, events to bills, bills to sessions, and contributions to people and committees.',
        'A vote is attributed against the roster for that session, and an ambiguous surname fails the run. It is never resolved by a best guess.',
        'Each month of campaign finance data must match the source system’s own transaction count.',
      ],
    },
    {
      heading: 'The site and its data products',
      paragraphs: [
        'The Astro build writes one page for every bill, legislator and roll call. Search is built with Pagefind and runs in the browser. Finding your legislators also happens in the browser: the Census geocoder turns an address into coordinates, and the district is matched against boundaries bundled with the site. The address is not stored anywhere but the reader’s device.',
        'Everything on the site is also published as data that needs no API key: a static JSON API of more than 41,000 files, Atom feeds, iCal calendars for hearings and election days, a CSV for each session, and a SQLite snapshot. The bulk files go to GitHub Releases with SHA-256 checksums.',
      ],
    },
    {
      heading: 'Testing and verification',
      paragraphs: [
        'The pipeline has 43 test files with close to 400 tests, run with pytest. The built site is then checked by its own set of scripts before any release.',
      ],
      rows: [
        ['Preflight', 'The built pages match the database they came from: every session, and a page for every bill, legislator and roll call'],
        ['Functional', 'Eleven checks in headless Chrome, including search quality and an address resolving to the right two legislators'],
        ['Accessibility', 'axe-core at WCAG 2.2 AA over 41 representative pages, at desktop width and at 360 pixels, with no violations allowed'],
        ['Responsive', 'No horizontal overflow on the same pages at seven widths'],
        ['Links', 'Every internal path and anchor resolves'],
        ['Content Security Policy', 'Run against the released site, to confirm the policy breaks neither search nor the address lookup'],
      ],
    },
    {
      heading: 'Delivery and infrastructure',
      paragraphs: [
        'The nightly parser runs as a sequence of resumable GitHub Actions jobs that keep their checkpoints in a private Cloud Storage bucket. Releases also run only in GitHub Actions. A push to main rehearses the release on a development project, and production is a separate, deliberate promotion. No deploy runs from a pull request.',
        'GitHub Actions reaches GCP through Workload Identity Federation, so there is no service account key to store. The identity pool and provider, the deployer and parser service accounts and their bucket-level roles are defined in Terraform. Dependencies are pinned by hash, and npm installs run with install scripts turned off.',
      ],
    },
    {
      heading: 'Trade-offs',
      list: [
        'Serving only static files rules out accounts. Followed bills and a saved address live in the browser’s local storage.',
        'Rows that come from LegiScan are shown on pages with credit and a link to the record and its licence, and are left out of the API and every export.',
        'Anything that would add a paid cloud resource is turned down, which keeps features inside what a static build can do.',
        'Where a city’s history is incomplete, the page says so.',
      ],
    },
  ],
}

export default function BadgerPolitics() {
  return <ProjectStudy study={study} />
}
