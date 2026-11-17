This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Content

Site copy that appears on more than one page (work, experience, skills,
certifications, education and articles) lives in `src/lib/site.ts`. Update that
file when the resume changes and the home, About, Case Studies and Writing
pages follow. The secrets migration case study has its own page at
`src/app/case-studies/secrets-migration/page.tsx`.

## Deployment

The site is a static export (`output: 'export'` in `next.config.ts`) served by
[Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).
Cloudflare builds and deploys every push to `main`, and builds a preview for
every pull request.

Pages project settings:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npx next build` |
| Build output directory | `out` |
| Production branch | `main` |

Things that differ from a server-rendered Next.js app:

- **Response headers** (Content Security Policy and the other security
  headers) are set in `public/_headers`, not in `next.config.ts`.
- **Social preview images** are rendered at build time by
  `src/app/og/[slug]/route.tsx` and exported as `/og/*.png`.
- **Node.js version** for Cloudflare builds and CI is pinned in `.node-version`.
- There is no server, so API routes, server actions and `next/image`
  optimization are not available.

To preview the production build locally:

```bash
npm run build
npx serve out
```
