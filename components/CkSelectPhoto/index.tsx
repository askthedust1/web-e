import clsx from 'clsx'
import Button from 'components/Buttons/Button'
import Icon from 'components/Icon'
import React, { FC } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import {
  DeepRequired,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form'
import style from './ck-select-photo.module.scss'
import { useTranslation } from 'next-i18next'
import Drawer from 'components/ui/DrawerUI'
import Camera from 'components/Camera'
import { useRouter } from 'next/router'
const _fileTypes = ['JPG', 'PNG', 'GIF']

interface Props {
  label: string
  fileTypes: string[]
  maxSize?: number
  onChangeFiles?(files: File): void
  error?: Merge<FieldError, FieldErrorsImpl<DeepRequired<File>>> | any
  url?: string
}

const CkSelectPhoto: FC<Props> = ({
  label,
  fileTypes,
  maxSize = 10,
  onChangeFiles,
  error,
  url: _url,
}) => {
  const [preview, setPreview] = React.useState<string>('')
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const handleChange = (file: File) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
    onChangeFiles?.(file)
  }
  React.useEffect(() => {
    return () => URL.revokeObjectURL(preview)
  }, [])

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <FileUploader
          hoverTitle="Перетащите сюда"
          handleChange={handleChange}
          types={fileTypes}
          maxSize={maxSize}
        >
          <div className={style.loaderWrapper}>
            {!preview ? (
              <div className={style.loader}>
                <div className={style.icon}>
                  <Icon id="imgHendler" width={33} height={34} />
                </div>

                <div className={clsx(style.title, 'light-16')}>{label}</div>
                <div className={clsx(style.subtitle, 'light-12')}>
                  <p className={style.paragraf}>
                    {t('forms.card.format_file')}{' '}
                  </p>{' '}
                  {fileTypes?.map((item, index) => (
                    <div key={index} className={style.format}>
                      {item},
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={style.imgWrapper}>
                {/* eslint-disable-next-line no-restricted-syntax -- preview is a createObjectURL (blob: URL) from a user-selected file — next/image cannot optimize blob URLs, keep raw img */}
                <img className={style.image} src={preview} />
              </div>
            )}
          </div>
          <div className={clsx(style.button, 'light-14')}>
            <Button value={t('forms.card.image_loader2')} isOutline isLong />
          </div>
        </FileUploader>
        {router?.asPath?.includes('savings-mortgage') && (
          <div className={clsx(style.button)} style={{ marginTop: -5 }}>
            <Button
              value={t('Камера')}
              isOutline
              isLong
              onClick={() => setOpen(!open)}
            />
          </div>
        )}

        <div>
          <p className={clsx(style.error, 'light-12')}> {error?.message}</p>
        </div>
      </div>
      <Drawer onClose={() => setOpen(false)} isOpen={open} width="100%">
        <Camera
          handleChange={(file) => {
            handleChange(file)
            setOpen(false)
          }}
        />
      </Drawer>
    </div>
  )
}

export default CkSelectPhoto
