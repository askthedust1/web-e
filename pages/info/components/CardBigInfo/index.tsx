import clsx from 'clsx'
import CkEditor from 'components/CkEditor'
import Document from 'components/Document'
import HeadingWithNav from 'components/Heading/Heading'
import { FC, Key } from 'react'
import s from './card-big-info.module.scss'
import Button from 'components/Buttons/Button'

import { dowloundAllFiles } from 'helpers/dowloundAllFiles'
import { showButtons } from 'components/TableTender'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import AccordionItemCardBigInfo from 'components/AccordionItemCardBigInfo'
import AppImage from 'components/ui/AppImage'

interface Docs {
  id: number
  title: string
  ext: string
  file: string
}

interface Props {
  files?: {
    ext: string
    file: string
    id: number
    title: string
  }[]
  userToken?: string | boolean | null
  buttons?: boolean
  title?: string
  desc?: string
  docs?: {
    id: number
    title: string
    ext: string
    file: string
  }[]
  groups?:
    | {
        id?: number | any
        title?: string | any
        people?: {
          id?: number | any
          position?: string | any
          fio?: string | any
          cv?: string | null | any
          photo?: string | null
        }[]
      }[]
    | any
}
const CardBigInfo: FC<Props> = ({
  title,
  desc,
  docs,
  groups,
  files,
  userToken,
}) => {
  const router = useRouter()

  const dowloundFiles = () => {
    const urls: Docs[] | any = docs?.map((item) => ({
      link: item?.file,
    }))
    dowloundAllFiles(urls)
  }
  const { t } = useTranslation()

  return (
    <div className={s.wrapper}>
      {title && <HeadingWithNav title={title} />}
      <CkEditor caption={desc} />
      {groups?.title && <HeadingWithNav title={groups?.title} />}
      {groups && (
        <div className={s.shortsWrapper}>
          {groups?.people?.map((item: any, index: Key | null | undefined) => (
            <div key={index} className={s.shorts}>
              <AccordionItemCardBigInfo
                question={
                  <div className={s.data}>
                    {item?.photo && (
                      <div className={s.photoBlock}>
                        <AppImage
                          src={item?.photo || '/default.webp'}
                          alt={item?.fio}
                          className={s.photo}
                          width={240}
                          height={295}
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className={s.text}>
                      <p>
                        <b>{item?.fio}</b>
                      </p>
                      <p
                        style={{
                          fontWeight: 300,
                          color: '#7893b0',
                          fontSize: 14,
                        }}
                      >
                        {item?.position}
                      </p>
                      {item?.reception_schedule && (
                        <p style={{ marginTop: -7 }}>
                          <span
                            style={{
                              fontWeight: 300,
                              color: '#7893b0',
                              fontSize: 14,
                            }}
                          >
                            {t('administration_page.reception_schedule')}
                          </span>{' '}
                          <span
                            style={{
                              fontWeight: 300,
                              color: 'black',
                              fontSize: 14,
                            }}
                          >
                            {item?.reception_schedule}
                          </span>{' '}
                        </p>
                      )}
                    </div>
                  </div>
                }
                answer={item?.desc}
              />
            </div>
          ))}
        </div>
      )}
      {!(router?.query?.type === 'administration_page') && (
        <Document documents={docs} />
      )}

      {files && (
        <div className={s.buttons}>
          <Button
            onClick={dowloundFiles}
            isBlue
            className={clsx(s.button, 'bg-white')}
            value={t('save_files')}
          />
          {files && showButtons(files, userToken as string, s.buttonFile)}
        </div>
      )}
    </div>
  )
}

export default CardBigInfo
