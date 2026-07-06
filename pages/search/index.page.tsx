import { useEffect, useState } from 'react'
import Section from 'components/Section'
import Container from 'components/Container'
import { clientApi } from 'services/api/apiService'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import { getTranslations } from 'helpers/serverTranslations'
import { GetServerSideProps } from 'next'
import { useDebounce } from 'helpers/debounce'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useTranslation } from 'next-i18next'
import SelectFilter from 'components/Select'
import { SearchResultProps } from 'services/api/SearchProps'
import clsx from 'clsx'
import s from './search.module.scss'
import CkEditor from 'components/CkEditor'
import { linkPath } from 'helpers/changeTypeOfUse'

const SearchPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const SELECT_FILTERS = [
    {
      name: t('filter'),
      id: '',
    },
    {
      name: t('search_page.by_news'),
      id: 'news',
    },
    {
      name: t('search_page.by_credit'),
      id: 'credits',
    },
    {
      name: t('search_page.by_deposit'),
      id: 'deposits',
    },
    {
      name: t('cards.payment_card_title'),
      id: 'cards',
    },
    {
      name: t('service_point_service.branches'),
      id: 'branches',
    },
    {
      name: t('service_point_service.bankomats'),
      id: 'bankomats',
    },
  ]
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [result, setResult] = useState<SearchResultProps | null>(null)
  const { locale } = useRouter()
  const debouncedValue = useDebounce(search, 1500)

  const handleSearch = async () => {
    if (search.length !== 0) {
      const resultApi = await clientApi.get(
        `/main_page/search?search=${search || null}&entities=${filter}`,
        {
          headers: {
            'Accept-Language': locale || 'ru',
          },
        }
      )
      setResult(resultApi?.data)
    }
  }

  const onKeyDown = (e: KeyboardEvent | MouseEvent | any) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }
  useEffect(() => {
    handleSearch()

    return () => {}
  }, [debouncedValue, filter])
  return (
    <Section className={s.wrapper}>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('search.search'),
            link: '/search',
          }}
        />
      </Container>
      <Container>
        <form action="" className={s.form}>
          <input
            onKeyDown={onKeyDown}
            type="text"
            className={s.input}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SelectFilter
            classItem={s.selectItem}
            value={filter}
            selectOption={setFilter}
            optionList={SELECT_FILTERS}
            classNameSelect={s.select}
            classNameBlock={s.selectWrapper}
          />
          <button
            onKeyDown={onKeyDown}
            onClick={handleSearch}
            type={'button'}
            className={`${s.button}`}
            disabled={search.length === 0}
          >
            {t('search.search')}
          </button>
        </form>
        {result?.credits?.length === 0 &&
          result?.deposits?.length === 0 &&
          result?.branches?.length === 0 &&
          result?.bankomats?.length === 0 &&
          result?.cards?.length === 0 &&
          result?.news?.length === 0 &&
          result?.pages?.length === 0 && (
            <div className={s.empty}>{t('search.not_found')}</div>
          )}
        <div className={s.result}>
          {result?.credits?.map((item: any) => (
            <div className={s.resultItem} key={item.id}>
              <h2 className={s.resultItemTitle}>{item.name}</h2>
              <div className={s.resultItemDesc}>{parse(item.short_desc)}</div>
              <a
                target="_blank"
                href={`credits/${item.slug}`}
                rel="noopener noreferrer"
                className={s.resultItemLink}
              >
                {t('search.go')}
              </a>
            </div>
          ))}
          {result?.deposits?.map((item) => (
            <div className={s.resultItem} key={item.id}>
              <h2 className={s.resultItemTitle}>{item.name}</h2>
              <div className={s.resultItemDesc}>{parse(item.short_desc)}</div>
              <a
                target="_blank"
                href={`depozits/${item.slug}`}
                rel="noopener noreferrer"
                className={s.resultItemLink}
              >
                {t('search.go')}
              </a>
            </div>
          ))}
          {result?.news?.map((item) => (
            <div className={s.resultItem} key={item.id}>
              <h2 className={s.resultItemTitle}>{item.title}</h2>
              <div className={s.resultItemDesc}>{parse(item.short_desc)}</div>
              <a
                target="_blank"
                href={`news/${item.slug}`}
                rel="noopener noreferrer"
                className={s.resultItemLink}
              >
                {t('search.go')}
              </a>
            </div>
          ))}
          {result?.cards?.map((item) => (
            <div className={s.resultItem} key={item.id}>
              <h2 className={s.resultItemTitle}>{item.name}</h2>
              <div className={s.resultItemDesc}>{parse(item.short_desc)}</div>
              <a
                target="_blank"
                href={
                  item.payment_system
                    ? `payment-cards/${item.slug}`
                    : `bank-cards/${item.slug}`
                }
                rel="noopener noreferrer"
                className={s.resultItemLink}
              >
                {t('search.go')}
              </a>
            </div>
          ))}
          {result?.branches?.map((item) => (
            <div className={s.resultItem} key={item.id}>
              <p className={s.type}>{t('service_point_service.branches')}</p>
              <h2 className={s.resultItemTitle}>{item?.name}</h2>
              <p className={'regular-20'}>{item.address}</p>
              <div className={s.phoneWrapper}>
                {item?.phones?.map((item) => (
                  <a
                    key={item?.phone}
                    className={clsx('light-16')}
                    href={`tel:+${item?.phone}`}
                  >
                    {item?.phone}
                  </a>
                ))}
              </div>
              <p className={clsx(s.status, 'regular-16')}>{item.status}</p>
              <a
                target="_blank"
                href="/points"
                rel="noopener noreferrer"
                className={s.resultItemLink}
              >
                {t('search.go')}
              </a>
            </div>
          ))}
          {result?.bankomats?.map((item) => (
            <div className={s.resultItem} key={item.id}>
              <p className={s.type}>{t('service_point_service.bankomats')}</p>
              <h2 className={s.resultItemTitle}>{item?.name}</h2>
              <p className={'regular-20'}>{item.address}</p>
              <div className={s.phoneWrapper}>
                {item?.phones?.map((item) => (
                  <a
                    key={item?.phone}
                    className={clsx('light-16')}
                    href={`tel:+${item?.phone}`}
                  >
                    {item?.phone}
                  </a>
                ))}
              </div>
              <p className={clsx(s.status, 'regular-16')}>{item.status}</p>
              <a
                target="_blank"
                href="/points"
                rel="noopener noreferrer"
                className={s.resultItemLink}
              >
                {t('search.go')}
              </a>
            </div>
          ))}

          {result?.pages?.map((item, index) => (
            <div
              onClick={() => router.push(linkPath(item.url, router))}
              className={s.resultItem}
              key={index}
            >
              <h2 className={s.resultItemTitle}>{item?.title}</h2>
              <CkEditor description={item?.body} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default SearchPage
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await getTranslations(locale as string)),
    },
  }
}
