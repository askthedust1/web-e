import clsx from 'clsx'
import Button from 'components/Buttons/Button'
import { useTranslation } from 'next-i18next'
import AppImage from 'components/ui/AppImage'
import { FC } from 'react'
import s from './pop-up-two-buttons.module.scss'
import popUpImages from '/public/images/popUp.png'
interface Props {
  closeModal(): void
  leftButton(): void
  rigthButton(): void
  leftButtonText?: string
  rigthButtonText?: string
  text?: string
  title?: string
  isImage?: boolean
}
const PopUpTwoButtons: FC<Props> = ({
  closeModal,
  text,
  leftButton,
  rigthButton,
  leftButtonText,
  rigthButtonText,
  isImage = true,
  title,
}) => {
  const { t: _t } = useTranslation()

  return (
    <div>
      <div className={s.wrapper}>
        <div onClick={closeModal} className={s.overlay}></div>
        <div className={s.popUp}>
          {isImage && (
            <AppImage
              alt=""
              className={s.image}
              src={popUpImages.src}
              width={160}
              height={160}
            />
          )}
          <h2 className={clsx(s.mainTitle, 'medium-28')}>{title}</h2>
          <p className={clsx(s.title, 'regular-18')}>{text}</p>
          <div className={s.buttonWrapper}>
            <Button
              isOutline
              className={s.button}
              value={leftButtonText as string}
              onClick={leftButton}
            />
            <Button
              isOutline
              className={s.button}
              value={rigthButtonText as string}
              onClick={rigthButton}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopUpTwoButtons
