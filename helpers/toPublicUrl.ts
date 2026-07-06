const SITE = 'https://eldik.kg'

export function toPublicUrl(url: string | null | undefined): string {
  if (!url) return ''
  const match = url.match(/\/media\/(.+)/)
  if (match) return `${SITE}/media/${match[1]}`
  if (url.startsWith('http')) return url
  return `${SITE}${url}`
}
