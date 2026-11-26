// Content for the site, kept in one place so the home page, About, Case
// Studies and Writing pages stay in agreement. Update this file when the
// resume changes. RiscPoint (Senior Security Engineer, February to May 2026)
// is on the résumé and is left off the site on purpose.

export const profile = {
  name: 'Henry Phillips',
  role: 'Security and platform engineer',
  // The role as it appears in page titles.
  shortRole: 'Security & Platform Engineer',
  focus: 'Security, platform and software engineering',
  location: 'Greater Milwaukee area or remote',
  // The résumé in /public. This is the copy made for the site: it carries the
  // email address and the site, LinkedIn and GitHub links, and leaves out the
  // phone number, so replace it with a copy that does the same. Set this to
  // null to show a placeholder on the About page and drop the link from
  // /llms.txt.
  resume: '/henry-phillips-resume.pdf' as string | null,
  // About the person: structured data and /llms.txt use this one.
  description:
    'Henry Phillips is a software and security engineer working on cloud infrastructure, distributed systems, platform engineering and security automation.',
  // About the site: the home page's description in search results and link previews.
  siteDescription:
    'Software and security engineer specializing in cloud infrastructure, distributed systems, platform engineering, and security automation. Explore enterprise engineering case studies and independent software projects.',
  url: 'https://henryp.me',
  linkedin: 'https://www.linkedin.com/in/henryjphillips/',
  github: 'https://github.com/uprightsleepy',
  repo: 'https://github.com/uprightsleepy/personal-site',
}

export type WorkItem = {
  slug: string
  kind: string
  period: string
  // Compact years shown beside the display title, e.g. "2024–25"
  years: string
  // Short form of the title for large display type
  display: string
  title: string
  summary: string
  tags: string[]
  link?: { href: string; label: string; external: boolean }
}

export const work: WorkItem[] = [
  {
    slug: 'secrets-migration',
    kind: 'Case study',
    period: '2024 to 2025',
    years: '2024–25',
    display: 'Secrets migration',
    title: 'Engineering a large-scale secrets migration platform',
    summary:
      'Developed an event-driven Go application on AWS Lambda, SQS and ECS that migrated 62,800+ secrets from HashiCorp Vault to AWS Secrets Manager for a Fortune 100 enterprise. 85% of the migration was done in four months.',
    tags: ['Go', 'AWS Lambda', 'SQS', 'ECS', 'AWS Secrets Manager', 'HashiCorp Vault'],
    link: {
      href: '/case-studies/secrets-migration',
      label: 'Read the case study',
      external: false,
    },
  },
  {
    slug: 'cicd-platform',
    kind: 'Case study',
    period: '2025 to 2026',
    years: '2025–26',
    display: 'CI/CD platform',
    title: 'Building a secure, multi-tenant CI/CD platform',
    summary:
      'Designed and implemented a multi-tenant software delivery platform on GCP for a Fortune 250 enterprise, with scanning, secret validation, keyless authentication and signed production deploys built in. Twelve teams adopted it voluntarily, and onboarding a team went from weeks of tickets to about five minutes.',
    tags: ['GCP', 'Cloud Run', 'GKE', 'Cloud KMS', 'Terraform', 'Bitbucket', 'SonarQube'],
    link: {
      href: '/case-studies/cicd-platform',
      label: 'Read the case study',
      external: false,
    },
  },
  {
    slug: 'spawnpointed',
    kind: 'Project',
    period: '2026',
    years: '2026',
    display: 'Spawnpointed',
    title: 'Spawnpointed',
    summary:
      'A daily GeoGuessr-style game for video games. It is an edge-hosted React app with tiled map imagery, HMAC-signed play state, passkey and OAuth sign-in, and a Discord Activity integration. Delivery is secured with Gitleaks history scanning, zizmor workflow linting and a blocking npm audit gate.',
    tags: ['React', 'Cloudflare Workers', 'D1', 'R2', 'GitHub Actions'],
    link: {
      href: 'https://spawnpointed.com',
      label: 'spawnpointed.com',
      external: true,
    },
  },
  {
    slug: 'badger-politics',
    kind: 'Project',
    period: '2026',
    years: '2026',
    display: 'Badger Politics',
    title: 'Badger Politics',
    summary:
      'An open-source Wisconsin transparency site. A Python pipeline loads bills, votes, campaign finance and elections into SQLite and publishes a static Astro site with a keyless JSON API. Releases use Terraform-managed GCP Workload Identity Federation and least-privilege service accounts.',
    tags: ['Python', 'Astro', 'SQLite', 'Terraform', 'GCP'],
    link: {
      href: 'https://badgerpolitics.org',
      label: 'badgerpolitics.org',
      external: true,
    },
  },
]

export type Role = {
  title: string
  company: string
  companyNote?: string
  period: string
  years: string
  location: string
  summary: string
  bullets: string[]
}

export const experience: Role[] = [
  {
    title: 'Solutions Consultant',
    company: 'Google',
    companyNote: 'Wiz, acquired by Google',
    period: 'May 2026 to present',
    years: '2026 to now',
    location: 'Remote',
    summary:
      'Hands-on technical work on the Wiz cloud security platform: Terraform sandbox environments, security policies and detection rules, and reference architectures.',
    bullets: [
      'Develop Terraform-based sandbox environments that reproduce enterprise cloud architectures for technical validation, security demonstrations and investigation of cloud security scenarios.',
      'Configure and customize cloud security policies, detection rules and platform integrations across AWS, GCP and Azure.',
      'Develop reusable reference architectures, remediation workflows and technical runbooks addressing cloud misconfigurations, vulnerabilities, identity risks and attack paths.',
      'Provide technical security guidance across 16 enterprise customers.',
    ],
  },
  {
    title: 'Cloud Security Consultant',
    company: 'RKON',
    companyNote: 'RKON acquired ScaleSec',
    period: 'May 2025 to February 2026',
    years: '2025 to 2026',
    location: 'Remote',
    summary:
      'Designed and implemented a multi-tenant CI/CD platform on GCP that 12 engineering teams adopted voluntarily.',
    bullets: [
      'Designed and implemented a multi-tenant GCP CI/CD platform for a Fortune 250 enterprise using Cloud Build, Bitbucket, Artifact Registry, Terraform and Kubernetes. Twelve engineering teams adopted it voluntarily.',
      'Implemented software supply chain security controls using SonarQube, Snyk, Cloud KMS-backed artifact signing, Binary Authorization and keyless authentication through Workload Identity Federation.',
      'Engineered auditable Terraform deployment workflows with isolated plan and apply identities, encrypted plan storage, artifact integrity validation and automated security gates.',
      'Developed reusable pipeline templates and deployment automation supporting container images, Maven, Gradle, NPM, Cloud Run and GKE workloads.',
    ],
  },
  {
    title: 'Cloud Security Engineer',
    company: 'ScaleSec',
    period: 'April 2024 to May 2025',
    years: '2024 to 2025',
    location: 'Remote',
    summary:
      'Built the event-driven Go application that migrated 62,800+ secrets from HashiCorp Vault to AWS Secrets Manager for a Fortune 100 enterprise.',
    bullets: [
      'Developed an event-driven Go application using AWS Lambda, SQS and ECS to migrate more than 62,800 secrets from HashiCorp Vault to AWS Secrets Manager for a Fortune 100 enterprise.',
      'Engineered fault-tolerant migration workflows with metadata enrichment, dead-letter queues, retry mechanisms and auditability, supporting adoption by more than 78 engineering teams.',
      'Implemented automated blue-green secret rotation and rehydration workflows, reducing incident recovery time by approximately 32%.',
      'Designed and implemented privileged access infrastructure using StrongDM, GCP and least-privilege access policies for secure infrastructure and database access.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Northwestern Mutual',
    companyNote: 'Started as an intern, June to October 2022',
    period: 'June 2022 to April 2024',
    years: '2022 to 2024',
    location: 'Franklin, WI (hybrid)',
    summary:
      'Java and Spring Boot microservices for an electronic signature workflow, and the AWS infrastructure under them.',
    bullets: [
      'Developed Java and Spring Boot microservices supporting an electronic signature workflow that reduced death claims processing time from 34 days to 2.5 days.',
      'Designed and maintained AWS infrastructure supporting production applications, including Amazon EKS and DynamoDB.',
      'Implemented security remediation across 48 services, reducing critical vulnerabilities by 82%.',
      'Refactored legacy application components into reusable Spring Batch workflows with Redis-backed caching to improve maintainability and modularity.',
    ],
  },
]

// Grouped by engineering discipline, as on the résumé.
export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Programming',
    items: ['Go', 'Python', 'Java', 'TypeScript', 'SQL', 'Bash'],
  },
  {
    group: 'Cloud and infrastructure',
    items: ['AWS', 'Google Cloud', 'Azure', 'Terraform', 'CloudFormation', 'Kubernetes', 'Docker'],
  },
  {
    group: 'Software engineering',
    items: [
      'Spring Boot',
      'REST APIs',
      'distributed systems',
      'event-driven architecture',
      'automated testing',
      'relational and NoSQL databases',
    ],
  },
  {
    group: 'Platform engineering',
    items: [
      'Cloud Build',
      'Jenkins',
      'GitHub Actions',
      'Bitbucket',
      'Artifact Registry',
      'Helm',
      'CI/CD',
    ],
  },
  {
    group: 'Security engineering',
    items: [
      'IAM',
      'Workload Identity Federation',
      'secrets management',
      'software supply chain security',
      'vulnerability management',
      'policy enforcement',
      'Snyk',
      'SonarQube',
      'Binary Authorization',
    ],
  },
]

export const certifications = [
  'AWS Certified Solutions Architect - Professional',
  'AWS Certified Security - Specialty',
  'CompTIA Security+',
  'StrongDM Architect',
]

export const education = [
  {
    degree: 'B.S. Software Development',
    school: 'Western Governors University',
    year: '2022',
  },
  {
    degree: 'B.A. Graphic Design, Magna Cum Laude',
    school: 'California State University, San Bernardino',
    year: '2019',
  },
]

export type Article = {
  title: string
  summary: string
  publisher: string
  year: string
  tags: string[]
  url: string
}

export const articles: Article[] = [
  {
    title: "MCP Servers: AI's New Attack Surface",
    summary:
      'Model Context Protocol servers and the security problems they introduce as AI agents gain broader system access. Covers attack vectors, privilege escalation risks and practical security frameworks for deployment.',
    publisher: 'ScaleSec',
    year: '2025',
    tags: ['AI security', 'MCP', 'Attack vectors'],
    url: 'https://scalesec.com/blog/mcp-server-security-best-practices',
  },
  {
    title: 'Local Intelligence: Open-Weight Models for Enterprise',
    summary:
      'How open-weight models let an organization run AI entirely inside its own infrastructure and keep its data there. Covers deployment strategies and compliance considerations.',
    publisher: 'ScaleSec',
    year: '2025',
    tags: ['AI', 'Privacy', 'Compliance', 'Infrastructure'],
    url: 'https://www.linkedin.com/pulse/open-weight-ai-ready-you-scalesec-yjtzc/',
  },
]
