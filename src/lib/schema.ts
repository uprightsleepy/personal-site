import { certifications, education, experience, profile } from '@/lib/site'

// schema.org descriptions of the site, for search engines and other
// crawlers. Everything here restates what the pages already say; nothing is
// claimed here that a reader cannot see on the site.
//
// The person and the site each have one identifier, and every other object
// points at those, so a crawler reads the pages as being about one person
// and belonging to one site.

const PERSON = `${profile.url}/#person`
const SITE = `${profile.url}/#website`

const schools: Record<string, string> = {
  'Western Governors University': 'https://www.wgu.edu',
  'California State University, San Bernardino': 'https://www.csusb.edu',
}

const current = experience[0]

export const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON,
  name: profile.name,
  url: profile.url,
  image: `${profile.url}/headshot.jpg`,
  description: profile.description,
  jobTitle: current.title,
  worksFor: { '@type': 'Organization', name: current.company },
  sameAs: [profile.linkedin, profile.github],
  alumniOf: education.map((item) => ({
    '@type': 'CollegeOrUniversity',
    name: item.school,
    url: schools[item.school],
  })),
  hasCredential: [
    ...certifications.map((name) => ({
      '@type': 'EducationalOccupationalCredential',
      name,
      credentialCategory: 'certification',
    })),
    ...education.map((item) => ({
      '@type': 'EducationalOccupationalCredential',
      name: item.degree,
      credentialCategory: 'degree',
      recognizedBy: { '@type': 'CollegeOrUniversity', name: item.school },
    })),
  ],
  knowsAbout: [
    'Security Engineering',
    'Platform Engineering',
    'Software Engineering',
    'Cloud Security',
    'DevSecOps',
    'Software Supply Chain Security',
    'Distributed Systems',
    'Security Automation',
    'CI/CD Platform Engineering',
    'Secrets Management',
    'Identity and Access Management',
    'Terraform',
    'Kubernetes',
    'AWS',
    'Google Cloud Platform',
    'Go',
    'Python',
    'Java',
  ],
  // Where he is: the Greater Milwaukee area. He also works remotely.
  homeLocation: { '@type': 'Place', name: 'Greater Milwaukee area, Wisconsin' },
  address: { '@type': 'PostalAddress', addressRegion: 'WI', addressCountry: 'US' },
}

export const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE,
  name: profile.name,
  description: profile.siteDescription,
  url: profile.url,
  inLanguage: 'en-US',
  publisher: { '@id': PERSON },
}

// The About page is a profile of the person.
export const profilePage = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${profile.url}/about`,
  url: `${profile.url}/about`,
  name: `About ${profile.name}`,
  isPartOf: { '@id': SITE },
  mainEntity: { '@id': PERSON },
}

// The trail from the home page down to a page, as a list of [name, path].
export function breadcrumbs(trail: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${profile.url}${path}`,
    })),
  }
}

// A case study, as a technical article by the person. The dates are when
// the page was first published and last revised.
export function caseStudy({
  path,
  headline,
  description,
  image,
  published,
  modified,
  about,
}: {
  path: string
  headline: string
  description: string
  image: string
  published: string
  modified: string
  about: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    image: `${profile.url}${image}`,
    url: `${profile.url}${path}`,
    mainEntityOfPage: `${profile.url}${path}`,
    datePublished: published,
    dateModified: modified,
    inLanguage: 'en-US',
    author: { '@id': PERSON },
    publisher: { '@id': PERSON },
    isPartOf: { '@id': SITE },
    about,
  }
}
