import { format } from 'date-fns'
import { enAU, ru } from 'date-fns/locale'

export default function parseTime(
  time: string,
  formatTime = 'dd MMMM',
  locale?: string
) {
  const langCheck = locale === 'en'
  try {
    return format(new Date(time), formatTime, {
      locale: !langCheck ? ru : enAU,
    })
  } catch (e) {}
}
