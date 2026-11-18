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

## Design

The site prints in one ink. By default it is a blueprint: white on a single
blue. The "Paper" theme swaps the two (next-themes calls Blueprint `dark` and
Paper `light`; the `paper:` Tailwind variant targets Paper). The colors and
type sizes are defined once in `src/app/globals.css`. Hierarchy comes from the
size, weight and width of one typeface, Archivo, which is self-hosted from
`@fontsource-variable/archivo`. There are no cards, gradients or second
colors, so new sections should reuse the existing classes (`display`, `title`,
`entry`, `lead`).

The site icon is the north arrow: `src/app/icon.svg`, with `favicon.ico` and
`apple-icon.png` beside it rendered from the same drawing.

Embellishments, all defined at the end of `globals.css`:

- Work index rows fill with diagonal hatching on hover or keyboard focus.
  Every row does this under the mouse, including work with no page to link to.
- The word "Secrets" in the first index title loads redacted and the bar wipes
  away once. It is skipped when the visitor asks for reduced motion.
- The blueprint sheet has a faint drafting grid.
- On wide screens the viewport has a drawing frame with zone references
  (`src/components/sheet-frame.tsx`), and the zone under the mouse is marked.
- The footer has a drawing title block (`src/components/title-block.tsx`) with
  the sheet number, the ink, the commit the site was built from and the date
  of the last build, plus a "Not for construction" stamp.
- The portrait on the About page has crop marks.
- Switching between Blueprint and Paper wipes the new sheet in. It is skipped
  for reduced motion and in browsers without view transitions.
- Unknown addresses get a 404 page in the same design (`src/app/not-found.tsx`),
  stamped "Void".
- Drafting symbols from `src/components/drafting.tsx`: a circled sheet number
  beside links to other pages (numbers come from `src/lib/sheets.ts`), a
  leader arrow beside links that leave the site, and a north arrow in the
  footer that links back to the top.
- The footer opens with a dimension line that measures its own width
  (`src/components/dimension-line.tsx`) and carries a list of general notes.
- The title block also names what checked the sheet (the CodeQL workflow) and
  has a 100 pixel graphic scale.
- The "Now" section on the home page sits in a revision cloud
  (`src/components/revision-cloud.tsx`).
- The case study is stamped "As built".
- The home page opens with a poster statement (`src/components/poster.tsx`):
  each line is set in a different width of Archivo and sized to fill the
  measure, and alternate lines are outlines. The lines and their widths are
  listed at the top of `src/app/page.tsx`.
- Work index titles widen under the mouse, letter by letter, along Archivo's
  width axis (`src/components/lens-title.tsx`). It is skipped on touch
  screens and for reduced motion.
- The dates beside the work titles are set on their side, and the footer
  sentence is outlined with its two links inked in.

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
