import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Henry Phillips - Cloud Security Consultant & Software Engineer',
  description: 'Get in touch with Henry Phillips for cloud security consulting, software engineering projects, or technical discussions. Available for organizations of all sizes.',
  keywords: ['Contact Henry Phillips', 'Cloud Security Consultant', 'Software Engineering', 'Secure Architecture', 'Technical Consulting'],
  openGraph: {
    title: 'Contact Henry Phillips - Cloud Security Consultant & Software Engineer',
    description: 'Get in touch with Henry Phillips for cloud security consulting, software engineering projects, or technical discussions.',
    url: 'https://henryp.me/contact',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Henry Phillips - Cloud Security Consultant & Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Henry Phillips - Cloud Security Consultant & Software Engineer',
    description: 'Get in touch for cloud security consulting, software engineering projects, or technical discussions.',
    images: ['/og-contact.jpg'],
  },
}

export default function Contact() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent leading-tight pb-2">
          Contact Me
        </h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Get In Touch</h2>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I&apos;m always interested in discussing software engineering, cloud architecture, 
                and security challenges. Whether you&apos;re looking for consulting, collaboration, 
                or just want to chat about tech, feel free to reach out.
              </p>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Email</h3>
                    <a 
                      href="mailto:henry@henryp.me" 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      henry@henryp.me
                    </a>
                  </div>
                </div>
                
                {/* LinkedIn */}
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl">💼</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">LinkedIn</h3>
                    <a 
                      href="https://www.linkedin.com/in/henryjphillips/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      linkedin.com/in/henryjamesphillips
                    </a>
                  </div>
                </div>
                
                {/* GitHub */}
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl">💻</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">GitHub</h3>
                    <a 
                      href="https://github.com/uprightsleepy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      github.com/uprightsleepy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Send a Message</h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors focus:outline-none"
                  placeholder="Your name"
                  aria-describedby="name-help"
                />
                <span id="name-help" className="sr-only">Enter your full name</span>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors focus:outline-none"
                  placeholder="your.email@example.com"
                  aria-describedby="email-help"
                />
                <span id="email-help" className="sr-only">Enter your email address for replies</span>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors focus:outline-none"
                  placeholder="What's this about?"
                  aria-describedby="subject-help"
                />
                <span id="subject-help" className="sr-only">Brief description of your inquiry</span>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors resize-vertical focus:outline-none"
                  placeholder="Your message..."
                  aria-describedby="message-help"
                />
                <span id="message-help" className="sr-only">Detailed message about your inquiry</span>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                aria-describedby="submit-help"
              >
                Send Message
              </button>
              <span id="submit-help" className="sr-only">Submit your contact form</span>
            </form>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Note: This form is for display purposes. To enable functionality, you&apos;ll need to add a form handler.
            </p>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Let&apos;s Connect</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🤝 Consulting & Collaboration</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Looking for help with cloud architecture, security implementations, or system design? 
                I&apos;m available for consulting projects and technical advisory roles.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">💬 Technical Discussions</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Always happy to discuss emerging technologies, share insights about Fortune 100 
                engineering challenges, or explore interesting technical problems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}