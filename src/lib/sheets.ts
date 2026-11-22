// The pages of the site, numbered like sheets in a drawing set. The footer
// title block, the sheet reference bubbles and the sheet index in the margin
// all read from this list. `short` is a sheet's name where room is tight,
// when its title is too long for that.
export const sheets: { path: string; title: string; short?: string }[] = [
  { path: '/', title: 'Home' },
  { path: '/case-studies', title: 'Work' },
  { path: '/case-studies/secrets-migration', title: 'Secrets migration', short: 'Secrets' },
  { path: '/case-studies/cicd-platform', title: 'CI/CD platform', short: 'CI/CD' },
  { path: '/about', title: 'About' },
  { path: '/blog', title: 'Writing' },
]

export function sheetNumber(path: string): number | null {
  const index = sheets.findIndex((sheet) => sheet.path === path)
  return index === -1 ? null : index + 1
}
