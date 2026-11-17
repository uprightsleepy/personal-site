// The pages of the site, numbered like sheets in a drawing set. The footer
// title block and the sheet reference bubbles both read from this list.
export const sheets = [
  { path: '/', title: 'Home' },
  { path: '/case-studies', title: 'Work' },
  { path: '/case-studies/secrets-migration', title: 'Secrets migration' },
  { path: '/about', title: 'About' },
  { path: '/blog', title: 'Writing' },
]

export function sheetNumber(path: string): number | null {
  const index = sheets.findIndex((sheet) => sheet.path === path)
  return index === -1 ? null : index + 1
}
