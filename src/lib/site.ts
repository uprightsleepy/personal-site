// Content for the site, kept in one place so the home page, About, Case
// Studies and Writing pages stay in agreement. Update this file when the
// resume changes.

export const profile = {
  name: 'Henry Phillips',
  role: 'Application and cloud security engineer',
  shortRole: 'Cloud Security Engineer',
  description:
    'Henry Phillips is an application and cloud security engineer working on DevSecOps, CI/CD platform engineering, IAM and secrets management across AWS and GCP.',
  url: 'https://henryp.me',
  linkedin: 'https://www.linkedin.com/in/henryjphillips/',
  github: 'https://github.com/uprightsleepy',
}

export type WorkItem = {
  slug: string
  kind: string
  period: string
  title: string
  summary: string
  stat: { value: string; label: string }
  tags: string[]
  link?: { href: string; label: string; external: boolean }
}

export const work: WorkItem[] = [
  {
    slug: 'secrets-migration',
    kind: 'Case study',
    period: '2024 to 2025',
    title: 'Secrets migration for a Fortune 100 firm',
    summary:
      'Designed and built the core Go Lambda that migrated 62,800+ secrets from HashiCorp Vault to AWS Secrets Manager. 85% of the migration was done in four months.',
    stat: { value: '62,800+', label: 'secrets migrated' },
    tags: ['Go', 'AWS Lambda', 'AWS Secrets Manager', 'HashiCorp Vault'],
    link: {
      href: '/case-studies/secrets-migration',
      label: 'Read the case study',
      external: false,
    },
  },
  {
    slug: 'cicd-platform',
    kind: 'Platform',
    period: '2025 to 2026',
    title: 'Multi-tenant CI/CD platform on GCP',
    summary:
      'Architected a CI/CD platform on Cloud Run with self-hosted SonarQube static analysis built in. Twelve teams adopted it voluntarily, and pipeline onboarding dropped from hours to minutes.',
    stat: { value: '12', label: 'teams adopted it' },
    tags: ['GCP', 'Cloud Run', 'SonarQube'],
  },
  {
    slug: 'spawnpointed',
    kind: 'Project',
    period: '2026',
    title: 'Spawnpointed',
    summary:
      'A daily GeoGuessr-style game for video games. It is an edge-hosted React app with tiled map imagery, HMAC-signed play state, passkey and OAuth sign-in, and a Discord Activity integration. Delivery is secured with Gitleaks history scanning, zizmor workflow linting and a blocking npm audit gate.',
    stat: { value: '5', label: 'rounds a day' },
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
    title: 'Badger Politics',
    summary:
      'An open-source Wisconsin transparency site. A Python pipeline loads bills, votes, campaign finance and elections into SQLite and publishes a static Astro site with a keyless JSON API. Releases use Terraform-managed GCP Workload Identity Federation and least-privilege service accounts.',
    stat: { value: '$2', label: 'about what it costs to host each month' },
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
      'Technical account management for 16 enterprise customers on the Wiz cloud security platform.',
    bullets: [
      'Manage 16 enterprise customers across AWS, GCP and Azure.',
      'Build Terraform sandboxes that replicate customer cloud architectures for repeatable, technically accurate Wiz demonstrations.',
      'Customize security policies and rules, lead cloud integrations, and develop customer runbooks and reference architectures.',
      'Advise engineers through CISOs on misconfiguration remediation, vulnerability prioritization and toxic combinations.',
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
      'Built a multi-tenant CI/CD platform on GCP that 12 teams adopted voluntarily.',
    bullets: [
      'Architected a multi-tenant GCP CI/CD platform on Cloud Run with integrated self-hosted SonarQube static analysis. Twelve teams adopted it voluntarily, and pipeline onboarding dropped from hours to minutes.',
      'Developed Python automation for GCP resource validation, pipeline health monitoring and compliance reporting.',
      'Implemented auditable Terraform workflows with KMS encryption, checksum validation and least-privilege service accounts.',
    ],
  },
  {
    title: 'Cloud Security Engineer',
    company: 'ScaleSec',
    period: 'April 2024 to May 2025',
    years: '2024 to 2025',
    location: 'Remote',
    summary:
      'Migrated 62,800+ secrets from HashiCorp Vault to AWS Secrets Manager for a Fortune 100 firm.',
    bullets: [
      'Migrated 62,800+ secrets from HashiCorp Vault to AWS Secrets Manager for a Fortune 100 firm, with 85% completed in four months.',
      'Designed and built the core Go Lambda for secret transfer, metadata retrieval, status tracking and job orchestration.',
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
      'Java and Spring Boot microservices for a secure eSignature platform.',
    bullets: [
      'Developed Java and Spring Boot microservices for a secure eSignature platform, reducing claims cycle time from 34 days to 2.5 days.',
      'Implemented event-driven AWS services using SQS, DynamoDB and S3 to coordinate processing and persist workflow data.',
      'Modernized legacy batch jobs with Spring Batch, Redis and multithreading, and contributed tooling and CI automation.',
    ],
  },
]

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Languages and frameworks',
    items: ['Go', 'Java', 'Spring Boot', 'Spring Batch', 'Python', 'JavaScript', 'SQL', 'Bash'],
  },
  {
    group: 'Cloud platforms',
    items: [
      'AWS Lambda',
      'S3',
      'DynamoDB',
      'AWS Secrets Manager',
      'GCP Cloud Run',
      'Firestore',
      'Cloud KMS',
      'Workload Identity',
    ],
  },
  {
    group: 'CI/CD and DevOps',
    items: [
      'GitHub Actions',
      'GitLab CI',
      'Bitbucket',
      'Cloud Build',
      'Terraform',
      'CloudFormation',
      'Docker',
      'Kubernetes',
    ],
  },
  {
    group: 'Application and cloud security',
    items: [
      'SonarQube (SAST)',
      'Trivy (SCA, containers)',
      'Gitleaks',
      'Wiz (CSPM)',
      'Secrets management',
    ],
  },
]

export const certifications = [
  'AWS Certified Solutions Architect - Professional',
  'AWS Certified Security - Specialty',
  'CompTIA Security+',
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
    title: 'Jules and the Rise of Agentic AI',
    summary:
      "A hands-on evaluation of Google's Jules, an agentic AI that writes code, runs tests and opens pull requests on its own. The tests include Go unit tests and a CLI tool.",
    publisher: 'ScaleSec',
    year: '2025',
    tags: ['Agentic AI', 'Go', 'Testing', 'Automation'],
    url: 'https://scalesec.com/blog/jules-agentic-ai',
  },
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
