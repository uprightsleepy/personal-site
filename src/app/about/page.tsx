import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Henry Phillips - Cloud Security Consultant & Software Engineer',
  description: 'Learn about Henry Phillips, a Cloud Security Consultant & Software Engineer specializing in secure cloud architectures. From graphic design to software engineering, helping organizations build secure, usable systems.',
  keywords: ['Henry Phillips', 'Cloud Security Consultant', 'Software Engineer', 'ScaleSec', 'Secure Cloud Architecture', 'Design to Engineering'],
  openGraph: {
    title: 'About Henry Phillips - Cloud Security Consultant & Software Engineer',
    description: 'Learn about Henry Phillips, a Cloud Security Consultant & Software Engineer specializing in secure cloud architectures. From graphic design to software engineering.',
    url: 'https://henryp.me/about',
    images: [
      {
        url: '/api/og?title=About Henry Phillips&subtitle=From Design to Software Engineering',
        width: 1200,
        height: 630,
        alt: 'About Henry Phillips - Cloud Security Consultant & Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Henry Phillips - Cloud Security Consultant & Software Engineer',
    description: 'Learn about Henry Phillips, specializing in secure cloud architectures. From graphic design to software engineering.',
    images: ['/api/og?title=About Henry Phillips&subtitle=From Design to Software Engineering'],
  },
}

export default function About() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent leading-tight pb-2">
          About Me
        </h1>
        
        {/* Introduction */}
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                I&apos;m a Cloud Security Consultant at ScaleSec specializing in secure cloud architectures and software engineering. 
                I love helping organizations of all sizes build better, more secure systems.
              </p>
              <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                What sets me apart is my unique journey from graphic design to software engineering. This design background 
                deeply informs my approach to system architecture, helping me build solutions that are secure, scalable, 
                and genuinely usable.
              </p>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                  <Image
                    src="/headshot.jpg"
                    alt="Professional headshot of Henry Phillips, Software Engineer and Cloud Security Consultant"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Experience</h2>
          
          <div className="space-y-8">
            {/* ScaleSec */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Cloud Security Consultant</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">ScaleSec</p>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">May 2025 – Present</span>
              </div>
              
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Designed and implemented a secure, cloud-native CI/CD platform on GCP using Cloud Build, Deploy, and ArgoCD; enforced least-privilege access via custom IAM roles, improving release control for a Fortune 250 client</p>
                <p>• Develop reusable IAM frameworks, secure serverless patterns (Lambda, API Gateway), and CI/CD pipelines using Terraform, reducing manual config errors and boosting deployment consistency</p>
                <p>• Advise engineering leads and product stakeholders on threat modeling and cloud security, influencing architecture decisions and reducing exposure to identity-related risks</p>
                <p>• Lead vulnerability remediation and secure workload migrations, improving client compliance scores and strengthening overall GCP security posture</p>
              </div>
            </div>

            {/* Cloud Security Engineer */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Cloud Security Engineer</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">ScaleSec</p>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">April 2024 – May 2025</span>
              </div>
              
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Migrated ~62,800 secrets from Vault to AWS Secrets Manager using Lambda, SQS, DLQ, and ECS, improving fault tolerance for a Fortune 100 client</p>
                <p>• Collaborated with app teams to secure containerized apps, proactively remediating vulnerabilities and strengthening runtime defenses in AWS ECS and Lambda environments</p>
              </div>
            </div>

            {/* Northwestern Mutual */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Software Engineer</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Northwestern Mutual</p>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">October 2022 – April 2024</span>
              </div>
              
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Delivered a secure eSignature product for life claims, reducing average beneficiary response time from 34 days to 2.5 days</p>
                <p>• Developed and deployed secure microservices on AWS (DynamoDB, SQS, S3), improving data integrity and supporting faster claims processing</p>
                <p>• Served as Risk Engineer in coordination with GRC, reducing threat exposure by identifying and mitigating vulnerabilities across cloud-based applications</p>
              </div>
            </div>

            {/* Software Engineering Intern */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Software Engineering Intern</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Northwestern Mutual</p>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">June 2022 – October 2022</span>
              </div>
              
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Integrated Spring Batch, Redis, and micro-threading to cut report generation time by 60%; supported agile backend delivery with QA collaboration</p>
              </div>
            </div>

            {/* Graphic Designer */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Graphic Designer</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Beaver Freight Inc.</p>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">August 2021 – May 2022</span>
              </div>
              
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Designed packaging, branding, and product photography while managing social media accounts (83% follower growth, 212% increased engagement)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Technical Skills</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Languages
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/go.svg" alt="Go programming language logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Go</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openjdk.svg" alt="Java programming language logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Java</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg" alt="Python programming language logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Python</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gnubash.svg" alt="Bash shell scripting logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Bash</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg" alt="SQL database query language logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">SQL</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Cloud Platforms
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg" alt="Amazon Web Services (AWS) logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Amazon Web Services (AWS)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg" alt="Google Cloud Platform (GCP) logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Google Cloud Platform (GCP)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/awslambda.svg" alt="AWS Lambda serverless computing logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Lambda, ECS, RDS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazoncloudwatch.svg" alt="Amazon CloudWatch monitoring logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">CloudWatch</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Infrastructure & Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/terraform.svg" alt="Terraform infrastructure as code logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Terraform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg" alt="Docker containerization platform logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Docker</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vault.svg" alt="HashiCorp Vault secrets management logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">HashiCorp Vault</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none" role="img" aria-label="StrongDM access management icon">
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">StrongDM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazoniam.svg" alt="AWS Identity and Access Management (IAM) logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">IAM</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                CI/CD & DevOps
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gitlab.svg" alt="GitLab CI/CD platform logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">GitLab CI/CD</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jenkins.svg" alt="Jenkins automation server logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Jenkins</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonsqs.svg" alt="Amazon Simple Queue Service (SQS) logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">SQS, Lambda</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none" role="img" aria-label="Load balancing network icon">
                    <circle cx="12" cy="6" r="3"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="18" r="3"/>
                    <path d="M9 9l6 6"/>
                    <path d="M15 9l-6 6"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Load Balancing</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Frameworks & Tools
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/spring.svg" alt="Spring Framework logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Spring Batch</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/redis.svg" alt="Redis in-memory data store logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Redis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none" role="img" aria-label="Microservices architecture icon">
                    <rect x="3" y="3" width="6" height="6" rx="1"/>
                    <rect x="9" y="3" width="6" height="6" rx="1"/>
                    <rect x="15" y="3" width="6" height="6" rx="1"/>
                    <rect x="3" y="9" width="6" height="6" rx="1"/>
                    <rect x="9" y="9" width="6" height="6" rx="1"/>
                    <rect x="15" y="9" width="6" height="6" rx="1"/>
                    <rect x="3" y="15" width="6" height="6" rx="1"/>
                    <rect x="9" y="15" width="6" height="6" rx="1"/>
                    <rect x="15" y="15" width="6" height="6" rx="1"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Microservices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openapiinitiative.svg" alt="OpenAPI Specification logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">OpenAPI Specification</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Certifications
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg" alt="AWS certification logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">AWS Solutions Architect Professional</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg" alt="AWS" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">AWS Security – Specialty</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/comptia.svg" alt="CompTIA Security+ certification logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">CompTIA Security+</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/comptia.svg" alt="CompTIA A+ certification logo" width={20} height={20} className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">CompTIA A+</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none" role="img" aria-label="ITIL Foundation certification icon">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">ITIL Foundation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none" role="img" aria-label="StrongDM Architect certification icon">
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">StrongDM Architect</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Background */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Education & Background</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <span className="text-4xl">💻</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bachelor of Science in Software Development</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Western Governor&apos;s University</p>
                    <p className="text-gray-600 dark:text-gray-400">2020 – 2022</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <span className="text-4xl">🎨</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bachelor of Arts in Graphic Design</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">California State University, San Bernardino</p>
                    <p className="text-gray-600 dark:text-gray-400">2017 – 2019 • Magna Cum Laude</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                      This design background gives me a unique perspective on user experience and visual communication in software development. 
                      I approach problems with both aesthetic sensibility and technical rigor, understanding that great software is as much 
                      about the user&apos;s journey as it is about the underlying architecture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <span className="text-4xl">🖼️</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Associate of Arts in Fine Art</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Victor Valley Community College</p>
                    <p className="text-gray-600 dark:text-gray-400">2014 – 2017</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy/Approach */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Approach</h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>
              I believe great software engineering means building systems that are secure by design, perform well under load, 
              and don&apos;t make other developers&apos; lives miserable. Security isn&apos;t something you bolt on afterward—it&apos;s a 
              fundamental part of good architecture.
            </p>
            <p>
              My experience with Fortune 100 companies has taught me the importance of building systems that can scale 
              both technically and organizationally. The best solutions are often the simplest ones that solve real problems.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}