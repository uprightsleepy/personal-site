interface StructuredDataProps {
  type: 'person' | 'article' | 'website'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData = {}

  switch (type) {
    case 'person':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data.name,
        "jobTitle": data.jobTitle,
        "description": data.description,
        "url": data.url,
        "image": data.image,
        "sameAs": data.sameAs,
        "worksFor": {
          "@type": "Organization",
          "name": data.worksFor?.name,
          "url": data.worksFor?.url
        },
        "alumniOf": data.alumniOf?.map((school: any) => ({
          "@type": "EducationalOrganization",
          "name": school.name,
          "url": school.url
        })),
        "knowsAbout": data.skills,
        "email": data.email,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        }
      }
      break
    
    case 'article':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "image": data.image,
        "author": {
          "@type": "Person",
          "name": data.author.name,
          "url": data.author.url
        },
        "publisher": {
          "@type": "Organization",
          "name": data.publisher.name,
          "logo": {
            "@type": "ImageObject",
            "url": data.publisher.logo
          }
        },
        "datePublished": data.datePublished,
        "dateModified": data.dateModified,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": data.url
        }
      }
      break
    
    case 'website':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": data.name,
        "description": data.description,
        "url": data.url,
        "author": {
          "@type": "Person",
          "name": data.author.name
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${data.url}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
      break
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}