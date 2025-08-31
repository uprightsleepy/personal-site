import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Henry Phillips - Software Engineer & Cloud Architect',
  description: 'Learn about Henry Phillips, a software engineer specializing in cloud security, microservices architecture, and Fortune 100 enterprise systems. Experience with AWS, GCP, Go, Java, and Python.',
  keywords: ['Henry Phillips', 'Software Engineer Bio', 'Cloud Security Consultant', 'ScaleSec', 'Northwestern Mutual', 'Enterprise Software'],
  openGraph: {
    title: 'About Henry Phillips - Software Engineer & Cloud Architect',
    description: 'Learn about Henry Phillips, a software engineer specializing in cloud security, microservices architecture, and Fortune 100 enterprise systems.',
    url: 'https://henryp.me/about',
  },
}

export default function About() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          About Me
        </h1>
        
        {/* Introduction */}
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                I'm a software engineer who specializes in building secure, scalable systems for enterprise environments. 
                My experience spans cloud architecture, microservices development, and security engineering, with a focus 
                on Fortune 100 financial services organizations.
              </p>
              <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                Currently, I work as a Cloud Security Consultant at ScaleSec, where I help organizations design and 
                implement secure cloud architectures while maintaining my core focus on software engineering and system design.
              </p>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                  <img 
                    src="/headshot.jpg" 
                    alt="Henry Phillips" 
                    className="w-full h-full object-cover"
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
                <span className="text-gray-600 dark:text-gray-400 font-medium">April 2024 – Present</span>
              </div>
              
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Architected enterprise StrongDM access management solutions on Google Cloud Platform, designing secure cloud workflows</p>
                <p>• Built scalable secrets migration architecture for Fortune 100 financial services, migrating 62.8k+ secrets from HashiCorp Vault to AWS Secrets Manager using Lambda, SQS, ECS, and RDS</p>
                <p>• Developed reusable blueprints and automation frameworks adopted by 78+ teams for standardized governance</p>
                <p>• Integrated security solutions into CI/CD workflows using Jenkins for automated deployment practices</p>
                <p>• Implemented CloudWatch logging and metrics for real-time observability and incident response</p>
              </div>
            </div>

            {/* Northwestern Mutual */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Software Engineer</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Northwestern Mutual</p>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">June 2022 – April 2024</span>
              </div>
              
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Developed enterprise microservices serving critical business functions for thousands of users</p>
                <p>• Built e-Signature integration reducing death claims processing time by 78% (36 to 8 days)</p>
                <p>• Led security hardening initiative across 48 services, reducing critical vulnerabilities by 82%</p>
                <p>• Refactored legacy batch processing into modular microservices using Spring Batch and Redis, reducing runtime by 63%</p>
                <p>• Operated as Risk Engineer with enterprise GRC to identify and mitigate security vulnerabilities</p>
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
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/go.svg" alt="Go" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Go</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openjdk.svg" alt="Java" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Java</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg" alt="Python" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Python</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gnubash.svg" alt="Bash" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Bash</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg" alt="SQL" className="w-5 h-5 dark:invert" />
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
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg" alt="AWS" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Amazon Web Services (AWS)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg" alt="GCP" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Google Cloud Platform (GCP)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/awslambda.svg" alt="Lambda" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Lambda, ECS, RDS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazoncloudwatch.svg" alt="CloudWatch" className="w-5 h-5 dark:invert" />
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
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/terraform.svg" alt="Terraform" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Terraform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg" alt="Docker" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Docker</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vault.svg" alt="HashiCorp Vault" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">HashiCorp Vault</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">StrongDM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazoniam.svg" alt="IAM" className="w-5 h-5 dark:invert" />
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
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gitlab.svg" alt="GitLab" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">GitLab CI/CD</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jenkins.svg" alt="Jenkins" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Jenkins</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonsqs.svg" alt="SQS" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">SQS, Lambda</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none">
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
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/spring.svg" alt="Spring" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Spring Batch</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/redis.svg" alt="Redis" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300">Redis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none">
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
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openapiinitiative.svg" alt="OpenAPI" className="w-5 h-5 dark:invert" />
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
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg" alt="AWS" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">AWS Solutions Architect Professional</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg" alt="AWS" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">AWS Security Specialization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/comptia.svg" alt="CompTIA" className="w-5 h-5 dark:invert" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">CompTIA Security+</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 stroke-current dark:stroke-white stroke-2" viewBox="0 0 24 24" fill="none">
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
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Western Governor's University</p>
                    <p className="text-gray-600 dark:text-gray-400">May 2020 – October 2022</p>
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
                    <p className="text-gray-600 dark:text-gray-400">June 2017 – June 2019 • Magna Cum Laude</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                      This design background gives me a unique perspective on user experience and visual communication in software development.
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
                    <p className="text-gray-600 dark:text-gray-400">June 2014 – June 2017</p>
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
              and don't make other developers' lives miserable. Security isn't something you bolt on afterward—it's a 
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