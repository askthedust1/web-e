const SITE_URL = 'https://eldik.kg'

/**
 * Возвращает canonical URL для текущей страницы.
 * - Убирает query-параметры (?for_who=legal, ?page=2 и т.д.)
 * - Для дефолтной локали (ru) не добавляет префикс
 * - Для остальных локалей (ky, en) добавляет /<locale>
 */
export function getCanonicalUrl(locale: string, pathname: string): string {
  const cleanPath = pathname.split('?')[0]
  const localePath = locale === 'ru' ? '' : `/${locale}`
  return `${SITE_URL}${localePath}${cleanPath}`
}
