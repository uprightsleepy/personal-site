import type { Metadata } from 'next'
import Link from 'next/link'
import { SheetRef } from '@/components/drafting'
import PipelineDiagram from '@/components/pipeline-diagram'

export const metadata: Metadata = {
  title: 'CI/CD Platform Case Study: Multi-Tenant Pipelines on GCP Cloud Run',
  description:
    'A case study of a multi-tenant CI/CD platform on GCP: Cloud Run jobs in each team’s own project, managed in Terraform, with SonarQube scanning, secret validation and signed production deploys.',
  keywords: [
    'CI/CD Platform',
    'GCP Cloud Run',
    'Terraform',
    'DevSecOps',
    'SonarQube',
    'Platform Engineering',
  ],
  openGraph: {
    title: 'CI/CD Platform Case Study: Onboarding in Five Minutes | Henry Phillips',
    description:
      'How a company new to GCP went from weeks of provisioning tickets to a shared pipeline that a team could join in about five minutes.',
    url: 'https://henryp.me/case-studies/cicd-platform',
    images: [
      {
        url: '/og/cicd-platform.png',
        width: 1200,
        height: 630,
        alt: 'CI/CD Platform Case Study: Multi-Tenant Pipelines on GCP Cloud Run',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CI/CD Platform Case Study: Onboarding in Five Minutes',
    description:
      'A multi-tenant CI/CD platform on GCP Cloud Run with security checks built into every pipeline.',
    images: ['/og/cicd-platform.png'],
  },
}

const constraints = [
  ['Starting point', 'New to GCP, with no cloud environment before it'],
  ['Standards', 'None shared across development teams; each team built and shipped its own way'],
  ['Provisioning', 'Tickets to the platform team, filled by hand over several weeks'],
  ['Tenancy', 'Every team in its own GCP project, with nothing shared between them at run time'],
  ['Languages', 'React, Java, Python and Go applications, plus Terraform'],
  ['Source control', 'Bitbucket, which had to stay the place where a build starts'],
  ['Security', 'Scanning and signing had to come with the pipeline, not be added by each team'],
]

const components = [
  [
    'Bitbucket trigger',
    'A merge request in a team’s repository starts that team’s pipeline. Teams kept the source control they already used.',
  ],
  [
    'Workload Identity Federation',
    'Bitbucket starts builds in GCP through Workload Identity Federation. It proves who it is with a short-lived token, so there is no service account key stored in Bitbucket to leak or rotate.',
  ],
  [
    'Cloud Run jobs',
    'The build, scan and deploy steps run as Cloud Run jobs. Each team has its own set, created in its own GCP project.',
  ],
  [
    'Service accounts',
    'Each team’s jobs run as service accounts that belong to that team’s project and can reach only that project.',
  ],
  [
    'Platform Terraform',
    'The jobs, service accounts and their permissions are all defined in Terraform owned by the platform team. Adding a team is a change to that code.',
  ],
  [
    'Build pipelines',
    'One pipeline shape for React, Java, Python and Go, so a team moving between languages finds the same stages in the same order.',
  ],
  [
    'Terraform pipeline',
    'A separate path for infrastructure changes, with different identities for planning and applying.',
  ],
]

const terraformSteps = [
  ['Plan', 'A plan service account, which can read the environment but not change it, produces the plan.'],
  [
    'Sign',
    'The pipeline signs the plan with a key held in Cloud KMS, so there is a record of exactly what was planned.',
  ],
  [
    'Approve',
    'The merge request is reviewed with the signed plan attached. Nothing is applied until it is approved, and a request that is not approved goes back to the developer.',
  ],
  [
    'Validate',
    'Before anything is applied, the pipeline checks the signature and checks that the environment has not drifted since the plan was made.',
  ],
  [
    'Apply',
    'A separate apply service account applies that plan and nothing else. If the signature or the drift check fails, the apply does not run.',
  ],
]

const checks = [
  [
    'SonarQube scanning',
    'Every build is scanned by a self-hosted SonarQube instance, so code quality and security findings show up in the pipeline and not in a later audit.',
  ],
  [
    'Secret validation',
    'The pipeline checks for credentials committed to the repository before a build can go further.',
  ],
  [
    'Deploy signing',
    'The pipeline signs what it builds with a key held in Cloud KMS, and a production deploy checks that signature first. Only files built by the pipeline can be deployed.',
  ],
]

const rollout = [
  [
    'Pilot with three teams',
    'The first version went to three teams. I worked through their existing builds with them in working sessions to find where the pipeline did not yet match how they shipped.',
  ],
  [
    'Closing the gaps',
    'Each gap the pilot found became a change to the shared pipeline, so the fix reached every team and not only the one that hit it.',
  ],
  [
    'Wider adoption',
    'Teams outside the pilot asked to join. Twelve teams were using the platform by the end of my contract, and none of them had been required to.',
  ],
  [
    'After handover',
    'The platform team carried the rollout on after I left. To my knowledge it now covers all of the company’s development teams, around 30.',
  ],
]

const results = [
  ['3', 'Teams in the pilot'],
  ['12', 'Teams on the platform at the end of my contract'],
  ['~30', 'Teams on it since, to my knowledge'],
  ['5 min', 'To onboard a team'],
  ['Weeks', 'To provision a team before, by ticket'],
  ['5', 'Pipeline types: React, Java, Python, Go and Terraform'],
]

const workedWell = [
  'Putting each team’s jobs and service accounts in its own project kept one team’s pipeline from reaching another team’s environment.',
  'Starting with three teams found the gaps while they were still cheap to fix.',
  'Working sessions with developers showed how teams built in practice, which their documentation did not.',
  'Scanning, secret validation and signing came with the pipeline, so teams got them by joining and did not have to ask.',
  'Workload Identity Federation was new to the platform team. After using it here they extended it across the rest of their platform environment.',
  'Regular syncs with Directors and VPs kept the rollout decisions with the people who could make them.',
]

const skillsShown = [
  [
    'Cloud architecture',
    'GCP projects as tenant boundaries, Cloud Run jobs, service accounts, IAM and Workload Identity Federation',
  ],
  [
    'Infrastructure as code',
    'Terraform for the platform itself, and a plan and apply pipeline with signing and drift validation',
  ],
  [
    'Security engineering',
    'Static analysis, secret validation and Cloud KMS signing built into the delivery path',
  ],
  [
    'Delivery',
    'A pilot, working sessions with development teams, and reporting to Director and VP level',
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

export default function CicdPlatform() {
  return (
    <article className="gutter">
      <header className="relative pb-14 pt-10 md:pb-20 md:pt-20">
        <p className="mb-8">
          <Link href="/case-studies">Back to work</Link>
          <SheetRef path="/case-studies" />
        </p>
        <h1 className="title max-w-[12em]">Multi-tenant CI/CD platform</h1>
        <p className="lead mt-8 max-w-[40ch] text-soft">
          Shared build and deploy pipelines on GCP for a Fortune 250 company that was new to the
          cloud
        </p>
        {/* A finished job: drawings of completed work are stamped "as built" */}
        <p className="stamp mt-10 lg:absolute lg:bottom-28 lg:right-[9%] lg:mt-0">As built</p>
        <dl className="mt-12 max-w-[68ch] border-b border-rule">
          <Row term="Period">2025 to 2026</Row>
          <Row term="Scale">3 pilot teams, 12 at handover, around 30 since</Row>
          <Row term="Stack">GCP Cloud Run, Cloud KMS, Terraform, Bitbucket, SonarQube</Row>
          <Row term="Reading time">5 minutes</Row>
        </dl>
      </header>

      <div className="longform">
        <h2 className="!mt-0">Executive summary</h2>
        <p>
          I architected and built a CI/CD platform on GCP for a Fortune 250 company that had no
          cloud environment before it. The platform is a set of <strong>Cloud Run jobs</strong>,
          started from Bitbucket through Workload Identity Federation and created for each team
          inside that team&rsquo;s own GCP project, with everything defined in Terraform. It builds
          React, Java, Python and Go applications and runs Terraform. Every pipeline includes
          SonarQube scanning and secret validation, and build outputs are signed with Cloud KMS so
          that only what the pipeline built can be deployed to production. A team could be onboarded in{' '}
          <strong>about five minutes</strong>, where provisioning by ticket had taken several
          weeks. Twelve teams adopted it during my contract, and to my knowledge it now serves all
          of the company&rsquo;s development teams.
        </p>

        <h2>The challenge</h2>
        <h3>Business context</h3>
        <p>
          The company was moving into GCP for the first time. Its development teams had no shared
          standards and worked in silos, so each team had its own way of building, testing and
          releasing software. Anything a team needed in the cloud was requested from the platform
          team by ticket, and the platform team created it by hand. A request could take several
          weeks.
        </p>
        <p>
          A new cloud environment was the chance to give every team the same path to production
          before each one invented its own.
        </p>
        <h3>Constraints</h3>
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
          The platform is distributed by design. There is no central build server that every team
          shares. Each team gets its own Cloud Run jobs and its own service accounts, in its own
          GCP project, and the platform team&rsquo;s Terraform is what creates them.
        </p>
        <h4>Core components</h4>
        <dl className="border-b border-rule">
          {components.map(([term, detail]) => (
            <Row key={term} term={term}>
              {detail}
            </Row>
          ))}
        </dl>

        <h3>How a change moves through it</h3>
        <p>
          Both pipelines run on a merge request. The checks run first. The steps that change
          anything, signing a build for production or applying a Terraform plan, wait until the
          merge request is approved. A request that is not approved goes back to the developer.
        </p>
      </div>

      <PipelineDiagram />

      <div className="longform">
        <h3>Isolation between teams</h3>
        <p>
          Because a team&rsquo;s jobs run in that team&rsquo;s project, as service accounts that
          exist only there,{' '}
          <strong>
            a mistake or a compromise in one team&rsquo;s pipeline stays inside that team&rsquo;s
            project
          </strong>
          . The project is the boundary, and it is one GCP already enforces.
        </p>

        <h3>The Terraform pipeline</h3>
        <p>
          Infrastructure changes are the riskiest thing a pipeline does, so the Terraform path
          separates the identity that looks from the identity that changes.
        </p>
        <ol>
          {terraformSteps.map(([step, detail]) => (
            <li key={step}>
              <strong>{step}.</strong> {detail}
            </li>
          ))}
        </ol>
        <p>
          The result is that what gets applied is what was planned, against the environment it was
          planned for.
        </p>

        <h3>Security checks in every pipeline</h3>
        <dl className="border-b border-rule">
          {checks.map(([term, detail]) => (
            <Row key={term} term={term}>
              {detail}
            </Row>
          ))}
        </dl>

        <h3>Keyless builds</h3>
        <p>
          The company had not used Workload Identity Federation before this project. Using it to
          start builds meant the link between Bitbucket and GCP never depended on a long-lived
          credential. The platform team has since extended the same pattern across the rest of
          their platform environment.
        </p>

        <h2>Rollout</h2>
        <ol>
          {rollout.map(([phase, detail]) => (
            <li key={phase}>
              <strong>{phase}.</strong> {detail}
            </li>
          ))}
        </ol>
        <p>
          Throughout, I held regular syncs with Director and VP level stakeholders, so decisions
          about standards and sequencing were made by the people who owned them.
        </p>

        <h2>Results and impact</h2>
        <dl className="border-b border-rule">
          {results.map(([value, label]) => (
            <div
              key={label}
              className="grid grid-cols-12 items-baseline gap-x-3 border-t border-rule py-3 md:gap-x-10"
            >
              <dt className="entry col-span-5 tabular-nums md:col-span-4">{value}</dt>
              <dd className="col-span-7 md:col-span-8">{label}</dd>
            </div>
          ))}
        </dl>

        <h2>Retrospective</h2>
        <h3>What worked well</h3>
        <ul>
          {workedWell.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>What I would change</h3>
        <p>
          The platform took pipeline onboarding from weeks to minutes, but it kept the
          company&rsquo;s existing model for everything else: a team that needed a new resource, or
          a change to its environment, still asked the platform team for it.
        </p>
        <p>
          I would split that ownership. The platform team should own the CI/CD architecture: the
          pipelines, the checks and the guardrails. Each team should own what runs in its own
          environment and change it directly, through the same Terraform pipeline, without a ticket.
          The plan and apply separation, the signing and the drift validation were built to make
          that safe.
        </p>

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
