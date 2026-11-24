import { articles, certifications, education, experience, profile, skills, work } from '@/lib/site'

export const dynamic = 'force-static'

// /llms.txt: the site as one plain Markdown file, for AI assistants and
// other programs that read pages on someone's behalf. It follows the
// llms.txt convention (a title, a one-paragraph summary, then sections of
// links) and is written from the same data as the pages, so it cannot say
// anything they do not.
export function GET() {
  const link = (href: string) => (href.startsWith('http') ? href : `${profile.url}${href}`)
  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.description}`,
    '',
    `${profile.name} is currently a ${experience[0].title} at ${experience[0].company}. Focus: ${profile.focus}. Location: ${profile.location}. This file summarises ${profile.url} for programs that read it on someone's behalf. Every page is static HTML and can be read without running scripts.`,
    '',
    '## Pages',
    '',
    `- [Home](${profile.url}): who he is, an index of his work, and his experience at a glance`,
    `- [About](${profile.url}/about): background, full experience, skills, certifications and education`,
    `- [Work](${profile.url}/case-studies): case studies and personal projects`,
    `- [Writing](${profile.url}/blog): published articles`,
    '',
    '## Work',
    '',
    ...work.map((item) => `- [${item.title}](${item.link ? link(item.link.href) : profile.url}): ${item.kind}, ${item.period}. ${item.summary}`),
    '',
    '## Writing',
    '',
    ...articles.map((article) => `- [${article.title}](${article.url}): ${article.publisher}, ${article.year}. ${article.summary}`),
    '',
    '## Experience',
    '',
    ...experience.map((role) => `- ${role.title}, ${role.company} (${role.period})`),
    '',
    '## Skills',
    '',
    ...skills.map((group) => `- ${group.group}: ${group.items.join(', ')}`),
    '',
    '## Certifications and education',
    '',
    ...certifications.map((name) => `- ${name}`),
    ...education.map((item) => `- ${item.degree}, ${item.school}, ${item.year}`),
    '',
    '## Contact',
    '',
    `- [LinkedIn](${profile.linkedin})`,
    `- [GitHub](${profile.github})`,
    ...(profile.resume ? [`- [Résumé (PDF)](${profile.url}${profile.resume})`] : []),
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
