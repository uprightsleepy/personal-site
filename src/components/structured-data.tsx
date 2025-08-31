interface PersonData {
  name: string
  jobTitle: string
  description: string
  url: string
  image: string
  email: string
  sameAs: string[]
  worksFor?: {
    name: string
    url: string
  }
  alumniOf?: Array<{
    name: string
    url: string
  }>
  skills: string[]
}

interface ArticleData {
  title: string
  description: string
  image: string
  url: string
  datePublished: string
  dateModified: string
  author: {
    name: string
    url: string
  }
  publisher: {
    name: string
    logo: string
  }
}

interface WebsiteData {
  name: string
  description: string
  url: string
  author: {
    name: string
  }
}

interface StructuredDataProps {
  type: 'person' | 'article' | 'website'
  data: PersonData | ArticleData | WebsiteData
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData = {}

  switch (type) {
    case 'person': {
      const personData = data as PersonData
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": personData.name,
        "jobTitle": personData.jobTitle,
        "description": personData.description,
        "url": personData.url,
        "image": personData.image,
        "sameAs": personData.sameAs,
        "worksFor": personData.worksFor ? {
          "@type": "Organization",
          "name": personData.worksFor.name,
          "url": personData.worksFor.url
        } : undefined,
        "alumniOf": personData.alumniOf?.map((school) => ({
          "@type": "EducationalOrganization",
          "name": school.name,
          "url": school.url
        })),
        "knowsAbout": personData.skills,
        "email": personData.email,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        }
      }
      break
    }
    
    case 'article': {
      const articleData = data as ArticleData
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.title,
        "description": articleData.description,
        "image": articleData.image,
        "author": {
          "@type": "Person",
          "name": articleData.author.name,
          "url": articleData.author.url
        },
        "publisher": {
          "@type": "Organization",
          "name": articleData.publisher.name,
          "logo": {
            "@type": "ImageObject",
            "url": articleData.publisher.logo
          }
        },
        "datePublished": articleData.datePublished,
        "dateModified": articleData.dateModified,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": articleData.url
        }
      }
      break
    }
    
    case 'website': {
      const websiteData = data as WebsiteData
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": websiteData.name,
        "description": websiteData.description,
        "url": websiteData.url,
        "author": {
          "@type": "Person",
          "name": websiteData.author.name
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${websiteData.url}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
      break
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}