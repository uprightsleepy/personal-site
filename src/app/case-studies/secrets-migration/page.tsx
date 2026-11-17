import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Secrets Migration Case Study: HashiCorp Vault to AWS Secrets Manager',
  description: 'A detailed case study of migrating 62,800+ secrets from HashiCorp Vault to AWS Secrets Manager using Lambda, SQS, DLQ, and ECS for improved fault tolerance.',
  keywords: ['HashiCorp Vault Migration', 'AWS Secrets Manager', 'Cloud Security', 'Lambda Architecture', 'Secret Management', 'Fault Tolerance'],
  openGraph: {
    title: 'Secrets Migration Case Study: 62,800+ Secrets Migrated | Henry Phillips',
    description: 'How we architected and executed a large-scale secrets migration using Lambda, SQS, DLQ, and ECS for improved fault tolerance.',
    url: 'https://henryp.me/case-studies/secrets-migration',
    images: [
      {
        url: '/og/secrets-migration.png',
        width: 1200,
        height: 630,
        alt: 'Secrets Migration Case Study: HashiCorp Vault to AWS Secrets Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secrets Migration Case Study: 62,800+ Secrets Migrated',
    description: 'Large-scale secrets migration using Lambda, SQS, DLQ, and ECS for improved fault tolerance.',
    images: ['/og/secrets-migration.png'],
  },
}

const constraints = [
  ['Scale', '62,800+ secrets across multiple vault namespaces and paths'],
  ['Security', 'Zero-trust requirements with no standing privileges'],
  ['Compliance', 'Highly regulated financial services environment'],
  ['Metadata', 'Existing secrets lacked proper tagging and categorization'],
  ['User knowledge gap', "Many users didn't know what their secrets were used for"],
  ['Code migration', 'Applications needed updates to use AWS SDK instead of Vault API'],
  ['Auditability', 'Every migration action needed to be logged'],
]

const components = [
  [
    'Migration Lambda',
    'Orchestrated the entire migration process with built-in error handling and rollback capabilities.',
  ],
  [
    'Admin role',
    'Granted just-in-time permissions to reader role, self-revoked upon completion/failure.',
  ],
  ['Reader role', 'Received temporary path-specific read access to HashiCorp Vault secrets.'],
  [
    'User intake system',
    'Microservice + SQS queue for user-provided metadata, with white glove support for validation.',
  ],
  [
    'Metadata engine',
    'Combined automated parsing with user input to enhance secret metadata and AWS tags.',
  ],
]

const accessSteps = [
  ['Pre-migration', 'No roles have access to vault paths'],
  ['JIT access grant', 'Admin role grants reader role permission to specific vault path'],
  ['Secret read', 'Lambda uses reader role to access only the designated secret'],
  ['Migration', 'Secret copied to AWS with enhanced metadata and tags'],
  ['Access revocation', 'Reader role permissions immediately revoked from vault path'],
  ['Token cleanup', 'Admin role revokes its own token'],
]

const phases = [
  [
    'Discovery and user engagement (months 1-3)',
    'Catalogued all vault paths, launched user intake system for metadata collection, and provided white glove support helping users identify secret purposes and plan code migrations.',
  ],
  [
    'Pilot and standard migration (months 4-7)',
    'Executed pilot with 500 secrets, then scaled to migrate 85% of all secrets using standard processes. Provided multi-language code examples and migration guidance.',
  ],
  [
    'Complex cases and cleanup (months 8-12)',
    'Developed custom solutions for Active Directory secrets, legacy system integrations, and edge cases. Deleted unused secrets identified during the discovery process.',
  ],
]

const challenges = [
  {
    title: 'Authentication reliability',
    issue:
      'Vault authentication could occasionally fail due to network issues or temporary service unavailability.',
    solution:
      'Implemented custom retry logic with exponential backoff specifically for Vault authentication, ensuring reliable connectivity while maintaining security principles.',
  },
  {
    title: 'User knowledge gap',
    issue: "Many users didn't know what their secrets were used for or how to migrate their code.",
    solution:
      'Built user intake system with SQS queue for metadata collection, provided white glove support with code migration examples across multiple programming languages (Go, Java, Python, Node.js).',
  },
  {
    title: 'Active Directory integration',
    issue: 'AD-related secrets required custom authentication logic and additional security safeguards.',
    solution:
      'Developed specialized migration patterns with enhanced access controls and validation specific to directory service authentication patterns.',
  },
  {
    title: 'Error recovery',
    issue: 'Network failures and API errors required reliable retry mechanisms.',
    solution:
      'Implemented idempotent operations with detailed logging and automated retry logic for transient failures.',
  },
]

const results = [
  ['62,800+', 'Secrets successfully migrated'],
  ['12', 'Months total duration'],
  ['100%', 'Success rate'],
  ['0', 'Security incidents'],
  ['85%', 'Migrated in first 4 months'],
  ['4,600+', 'Engineers supported enterprise-wide'],
]

const businessImpact = [
  [
    'Cost savings',
    'Eliminated expensive HashiCorp Vault licensing fees, saving significant operational costs',
  ],
  [
    'Operational efficiency',
    'Improved secret management with native AWS integration and automated rotation capabilities',
  ],
  [
    'Security posture',
    'Enhanced metadata and tagging enabled better governance and compliance reporting',
  ],
  [
    'Knowledge transfer',
    'White glove support process educated 4,600+ engineers enterprise-wide on modern secret management practices',
  ],
  ['Risk reduction', 'Eliminated dependency on external vendor, improving supply chain security'],
]

const workedWell = [
  'Just-in-time access with single-path isolation eliminated security risks',
  'Security-first design decisions (no multi-threading) proved correct',
  'Pareto Distribution (80/20 rule) guided resource allocation',
  'White glove user support was critical for adoption',
  'User intake system improved metadata quality significantly',
  'Custom solutions for complex cases paid dividends',
]

const futureImprovements = [
  'LLM-powered secret analysis to reduce reliance on user input for metadata',
  'Intelligent pattern recognition to automatically categorize secret types',
  'Real-time progress dashboard for stakeholder visibility',
  'Automated rollback capabilities for failed migrations',
  'Integration with existing CI/CD pipelines for secret updates',
]

const skillsShown = [
  ['Cloud architecture', 'AWS Lambda, IAM roles and policies, Secrets Manager, CloudWatch logging'],
  [
    'Security engineering',
    'Zero-trust architecture, just-in-time access, secret management, compliance frameworks',
  ],
  [
    'System design',
    'Large-scale migration, error handling, rate limit management, monitoring and alerting',
  ],
]

// A two-column table row: term on the left, detail on the right.
function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-10 gap-y-1 border-t border-rule py-4 md:grid-cols-12">
      <dt className="font-semibold md:col-span-4">{term}</dt>
      <dd className="md:col-span-8">{children}</dd>
    </div>
  )
}

export default function SecretsMigration() {
  return (
    <article className="gutter">
      <header className="pb-14 pt-10 md:pb-20 md:pt-20">
        <p className="mb-8">
          <Link href="/case-studies">Back to work</Link>
        </p>
        <h1 className="title max-w-[12em]">Large-scale secrets migration</h1>
        <p className="lead mt-8 max-w-[40ch] text-soft">
          HashiCorp Vault to AWS Secrets Manager for a Fortune 100 financial services institution
        </p>
        <dl className="mt-12 max-w-[68ch] border-b border-rule">
          <Row term="Duration">12 months total (4 months core migration)</Row>
          <Row term="Scale">62,800+ secrets</Row>
          <Row term="Stack">AWS Lambda, HashiCorp Vault, IAM</Row>
          <Row term="Reading time">8 minutes</Row>
        </dl>
      </header>

      <div className="longform">
        <h2 className="!mt-0">Executive summary</h2>
        <p>
          Architected and implemented the core Lambda migration system that successfully transferred{' '}
          <strong>62,800+ secrets</strong> from HashiCorp Vault to AWS Secrets Manager for a Fortune
          100 financial services institution. The project followed the Pareto Distribution: 85% of
          secrets were migrated in 4 months using standard processes, while the remaining 15%
          required custom solutions for complex scenarios like Active Directory authentication. The
          solution included white glove user support for secret identification, code migration
          assistance, and just-in-time access controls with zero standing privileges.
        </p>

        <h2>The challenge</h2>
        <h3>Business context</h3>
        <p>
          A Fortune 100 financial services institution needed to migrate away from HashiCorp Vault
          due to financial concerns with their operating model. The organization faced a strict
          12-month timeline to complete the migration to AWS Secrets Manager.
        </p>
        <h3>Technical constraints</h3>
        <dl className="border-b border-rule">
          {constraints.map(([term, detail]) => (
            <Row key={term} term={term}>
              {detail}
            </Row>
          ))}
        </dl>

        <h2>Technical solution</h2>
        <h3>Architecture overview</h3>
        <p>
          We designed a <strong>just-in-time access Lambda architecture</strong> that ensured zero
          standing privileges while maintaining security and auditability throughout the migration
          process.
        </p>
        <h4>Core components</h4>
        <dl className="border-b border-rule">
          {components.map(([term, detail]) => (
            <Row key={term} term={term}>
              {detail}
            </Row>
          ))}
        </dl>

        <h3>Security model</h3>
        <h4>Zero standing privileges architecture</h4>
        <ol>
          {accessSteps.map(([step, detail]) => (
            <li key={step}>
              <strong>{step}.</strong> {detail}
            </li>
          ))}
        </ol>
        <p>
          This approach ensured that{' '}
          <strong>
            even if a bad actor gained access to the Lambda or its roles, they could not re-access
            previously migrated vault paths
          </strong>
          , as permissions were permanently revoked after each migration.
        </p>

        <h2>Implementation strategy</h2>
        <h3>Phased approach and the Pareto Distribution</h3>
        <h4>The 80/20 rule in action</h4>
        <p>
          Our migration exemplified the Pareto Distribution: 80% of secrets followed standard
          patterns and were migrated in 5 months, 15% required custom solutions for complex
          scenarios like Active Directory authentication, and 5% needed white glove support for
          tricky migrations.
        </p>
        <dl className="border-b border-rule">
          <Row term="80%">Standard (5 months)</Row>
          <Row term="15%">Hard cases (3 months)</Row>
          <Row term="5%">White glove support</Row>
        </dl>
        <ol>
          {phases.map(([phase, detail]) => (
            <li key={phase}>
              <strong>{phase}.</strong> {detail}
            </li>
          ))}
        </ol>

        <h3>Technical challenges overcome</h3>
        <h4>Single-threaded by design</h4>
        <p>
          Multi-threading was intentionally avoided to maintain JIT access principles. We required
          that the Lambda execution role never have access to multiple vault paths simultaneously,
          ensuring perfect isolation and minimizing blast radius of any potential compromise.
        </p>
        {challenges.map((challenge) => (
          <div key={challenge.title}>
            <h4>{challenge.title}</h4>
            <p>{challenge.issue}</p>
            <p>{challenge.solution}</p>
          </div>
        ))}

        <h2>Results and impact</h2>
        <dl className="border-b border-rule">
          {results.map(([value, label]) => (
            <div
              key={label}
              className="grid grid-cols-12 items-baseline gap-x-10 border-t border-rule py-3"
            >
              <dt className="entry col-span-5 tabular-nums md:col-span-4">{value}</dt>
              <dd className="col-span-7 md:col-span-8">{label}</dd>
            </div>
          ))}
        </dl>
        <h3>Business impact</h3>
        <dl className="border-b border-rule">
          {businessImpact.map(([term, detail]) => (
            <Row key={term} term={term}>
              {detail}
            </Row>
          ))}
        </dl>

        <h2>Retrospective</h2>
        <h3>What worked well</h3>
        <ul>
          {workedWell.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>Future improvements</h3>
        <ul>
          {futureImprovements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3>Technical skills demonstrated</h3>
        <dl className="border-b border-rule">
          {skillsShown.map(([term, detail]) => (
            <Row key={term} term={term}>
              {detail}
            </Row>
          ))}
        </dl>

        <p className="mt-12">
          <Link href="/case-studies">Back to work</Link>
        </p>
      </div>
    </article>
  )
}
