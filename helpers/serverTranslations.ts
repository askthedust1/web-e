import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getTranslations = (locale: string, ns: string[] = ['common']) =>
  serverSideTranslations(locale, ns, null, [locale])
