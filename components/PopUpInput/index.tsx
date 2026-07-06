import clsx from 'clsx'
import s from './pop-up-input.module.scss'
import { RscInput } from 'components/ui/Input'
import Button from 'components/Buttons/Button'
import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

interface Props {
  value: string
  onChange(e: string): void
  onSumbit(): void
  resetOtpCode(): void
  error: string
  isEmail?: boolean
}
const PopUpInput: FC<Props> = ({
  value,
  onChange,
  onSumbit,
  resetOtpCode,
  error,
  isEmail
}) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(true)
  const showButton = () => {
    resetOtpCode()
    setShow(false)
  }

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 60000)
  }, [show])

  return (
    <div>
      <div className={s.wrapper}>
        <div className={s.overlay}></div>
        <div className={s.popUp}>
          <p className={clsx(s.title, 'medium-28')}>{isEmail ? "Введите код подтверждения, который вы получили на электронную почту" : t("code_from_sms")}</p>
          <div className={clsx(s.subtitle, 'light-16')}>
            <div className={s.input}>
              <RscInput
                type="number"
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(e?.target?.value)
                }
                label="0000"
                isSmall
              />
            </div>

            <div className={s.buttonWrapper}>
              <Button
                isLong
                onClick={onSumbit}
                className={s.buttonSubmit}
                value={t("submit")}
              />
              {show && (
                <Button
                  isLong
                  onClick={showButton}
                  className={s.buttonSubmit}
                  isOutline
                  value={t("again_code")}
                />
              )}
              {error && <p className={s.error}>{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopUpInput
