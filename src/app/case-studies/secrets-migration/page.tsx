import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Secrets Migration Case Study: HashiCorp Vault to AWS Secrets Manager | Henry Phillips',
  description: 'A detailed case study of migrating 68,000+ secrets from HashiCorp Vault to AWS Secrets Manager using Lambda, SQS, DLQ, and ECS for improved fault tolerance.',
  keywords: ['HashiCorp Vault Migration', 'AWS Secrets Manager', 'Cloud Security', 'Lambda Architecture', 'Secret Management', 'Fault Tolerance'],
  openGraph: {
    title: 'Secrets Migration Case Study: 68,000+ Secrets Migrated | Henry Phillips',
    description: 'How we architected and executed a large-scale secrets migration using Lambda, SQS, DLQ, and ECS for improved fault tolerance.',
    url: 'https://henryp.me/case-studies/secrets-migration',
    images: [
      {
        url: '/api/og?title=Secrets Migration Case Study&subtitle=68,000+ Secrets Migrated&type=case-study',
        width: 1200,
        height: 630,
        alt: 'Secrets Migration Case Study: HashiCorp Vault to AWS Secrets Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secrets Migration Case Study: 68,000+ Secrets Migrated',
    description: 'Large-scale secrets migration using Lambda, SQS, DLQ, and ECS for improved fault tolerance.',
    images: ['/api/og?title=Secrets Migration Case Study&subtitle=68,000+ Secrets Migrated&type=case-study'],
  },
}

export default function SecretsMigration() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            href="/case-studies"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            <span>←</span>
            <span>Back to Case Studies</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent leading-tight pb-2">
            Large-Scale Secrets Migration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            HashiCorp Vault to AWS Secrets Manager for a Fortune 100 Financial Services Institution
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <span>📅 Duration: 12 months total (4 months core migration)</span>
            <span>📊 Scale: 62,800+ secrets</span>
            <span>⏱️ 8 min read</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['AWS Lambda', 'HashiCorp Vault', 'Security', 'Enterprise', 'Migration', 'IAM'].map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          
          {/* Executive Summary */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Executive Summary</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                Architected and implemented the core Lambda migration system that successfully transferred <strong>62,800+ secrets</strong> from HashiCorp Vault to AWS Secrets Manager for a Fortune 100 financial services institution. The project followed the <strong>Pareto Distribution</strong>—85% of secrets were migrated in 4 months using standard processes, while the remaining 15% required custom solutions for complex scenarios like Active Directory authentication. The solution included <strong>white glove user support</strong> for secret identification, code migration assistance, and just-in-time access controls with zero standing privileges.
              </p>
            </div>
          </section>

          {/* Challenge */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">The Challenge</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Business Context</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                A Fortune 100 financial services institution needed to migrate away from HashiCorp Vault due to 
                <strong> financial concerns with their operating model</strong>. The organization faced a strict 
                <strong> 12-month timeline</strong> to complete the migration to AWS Secrets Manager.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Technical Constraints</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Scale:</strong> 62,800+ secrets across multiple vault namespaces and paths</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Security:</strong> Zero-trust requirements with no standing privileges</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Compliance:</strong> Highly regulated financial services environment</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Metadata:</strong> Existing secrets lacked proper tagging and categorization</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>User Knowledge Gap:</strong> Many users didn&apos;t know what their secrets were used for</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Code Migration:</strong> Applications needed updates to use AWS SDK instead of Vault API</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Auditability:</strong> Every migration action needed comprehensive logging</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Solution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Technical Solution</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Architecture Overview</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                We designed a <strong>just-in-time access Lambda architecture</strong> that ensured zero standing 
                privileges while maintaining security and auditability throughout the migration process.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Core Components</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Migration Lambda</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Orchestrated the entire migration process with built-in error handling and rollback capabilities.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Admin Role</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Granted just-in-time permissions to reader role, self-revoked upon completion/failure.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Reader Role</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Received temporary path-specific read access to HashiCorp Vault secrets.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">User Intake System</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Microservice + SQS queue for user-provided metadata, with white glove support for validation.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Metadata Engine</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Combined automated parsing with user input to enhance secret metadata and AWS tags.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Security Model</h3>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-4">🔒 Zero Standing Privileges Architecture</h4>
                <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li><strong>1. Pre-migration:</strong> No roles have access to vault paths</li>
                  <li><strong>2. JIT Access Grant:</strong> Admin role grants reader role permission to specific vault path</li>
                  <li><strong>3. Secret Read:</strong> Lambda uses reader role to access only the designated secret</li>
                  <li><strong>4. Migration:</strong> Secret copied to AWS with enhanced metadata and tags</li>
                  <li><strong>5. Access Revocation:</strong> Reader role permissions immediately revoked from vault path</li>
                  <li><strong>6. Token Cleanup:</strong> Admin role revokes its own token</li>
                </ol>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This approach ensured that <strong>even if a bad actor gained access to the Lambda or its roles, 
                they could not re-access previously migrated vault paths</strong>, as permissions were permanently 
                revoked after each migration.
              </p>
            </div>
          </section>

          {/* Implementation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Implementation Strategy</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Phased Approach & The Pareto Distribution</h3>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">📊 The 80/20 Rule in Action</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Our migration exemplified the <strong>Pareto Distribution</strong>: 85% of secrets followed standard patterns and 
                  were migrated quickly, while 15% required custom solutions for complex scenarios like Active Directory 
                  authentication and legacy system integrations.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                    85% Standard (4 months)
                  </span>
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full">
                    15% Custom (8 months)
                  </span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Discovery & User Engagement (Months 1-3)</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Catalogued all vault paths, launched user intake system for metadata collection, and provided 
                      white glove support helping users identify secret purposes and plan code migrations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Pilot & Standard Migration (Months 4-7)</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Executed pilot with 500 secrets, then scaled to migrate 85% of all secrets using standard processes. 
                      Provided multi-language code examples and migration guidance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Complex Cases & Cleanup (Months 8-12)</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Developed custom solutions for Active Directory secrets, legacy system integrations, and edge cases. 
                      Deleted unused secrets identified during the discovery process.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Technical Challenges Overcome</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Design Decision: Single-Threaded by Design</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>Security Requirement:</strong> Multi-threading was intentionally avoided to maintain JIT access principles.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>Rationale:</strong> We required that the Lambda execution role never have access to multiple vault paths 
                    simultaneously, ensuring perfect isolation and minimizing blast radius of any potential compromise.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Challenge: Authentication Reliability</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>Issue:</strong> Vault authentication could occasionally fail due to network issues or temporary service unavailability.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>Solution:</strong> Implemented custom retry logic with exponential backoff specifically for Vault authentication, ensuring robust connectivity while maintaining security principles.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Challenge: User Knowledge Gap</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>Issue:</strong> Many users didn&apos;t know what their secrets were used for or how to migrate their code.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>Solution:</strong> Built user intake system with SQS queue for metadata collection, provided white glove support 
                    with code migration examples across multiple programming languages (Go, Java, Python, Node.js).
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Challenge: Active Directory Integration</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>Issue:</strong> AD-related secrets required custom authentication logic and additional security safeguards.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>Solution:</strong> Developed specialized migration patterns with enhanced access controls and validation 
                    specific to directory service authentication patterns.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Challenge: Error Recovery</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>Issue:</strong> Network failures and API errors required robust retry mechanisms.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>Solution:</strong> Implemented idempotent operations with comprehensive logging and automated retry logic for transient failures.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Results & Impact</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">62,800+</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Secrets Successfully Migrated</div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">12</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Months Total Duration</div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Success Rate</div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">0</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Security Incidents</div>
              </div>
              
              <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">85%</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Migrated in First 4 Months</div>
              </div>
              
              <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">4,600+</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Engineers Supported Enterprise-Wide</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Business Impact</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Cost Savings:</strong> Eliminated expensive HashiCorp Vault licensing fees, saving significant operational costs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Operational Efficiency:</strong> Improved secret management with native AWS integration and automated rotation capabilities</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Security Posture:</strong> Enhanced metadata and tagging enabled better governance and compliance reporting</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Knowledge Transfer:</strong> White glove support process educated 4,600+ engineers enterprise-wide on modern secret management practices</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                  <span><strong>Risk Reduction:</strong> Eliminated dependency on external vendor, improving supply chain security</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Lessons Learned */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Key Learnings & Takeaways</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">✅ What Worked Well</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Just-in-time access with single-path isolation eliminated security risks</li>
                  <li>• Security-first design decisions (no multi-threading) proved correct</li>
                  <li>• Pareto Distribution (80/20 rule) guided resource allocation</li>
                  <li>• White glove user support was critical for adoption</li>
                  <li>• User intake system improved metadata quality significantly</li>
                  <li>• Custom solutions for complex cases paid dividends</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-600 dark:text-orange-400">🔄 Future Improvements</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• <strong>LLM-powered secret analysis</strong> to reduce reliance on user input for metadata</li>
                  <li>• Intelligent pattern recognition to automatically categorize secret types</li>
                  <li>• Real-time progress dashboard for stakeholder visibility</li>
                  <li>• Automated rollback capabilities for failed migrations</li>
                  <li>• Integration with existing CI/CD pipelines for secret updates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Skills Demonstrated */}
          <section className="mb-12">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Technical Skills Demonstrated</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Cloud Architecture</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• AWS Lambda</li>
                    <li>• IAM Roles & Policies</li>
                    <li>• Secrets Manager</li>
                    <li>• CloudWatch Logging</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Security Engineering</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Zero-trust Architecture</li>
                    <li>• Just-in-time Access</li>
                    <li>• Secret Management</li>
                    <li>• Compliance Frameworks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">System Design</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Large-scale Migration</li>
                    <li>• Error Handling</li>
                    <li>• Rate Limit Management</li>
                    <li>• Monitoring & Alerting</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <Link 
            href="/case-studies"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            <span>←</span>
            <span>Back to Case Studies</span>
          </Link>
          
          <Link 
            href="/contact"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
          >
            <span>Discuss This Project</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}