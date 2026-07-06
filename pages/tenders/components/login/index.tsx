import HeadingWithNav from 'components/Heading/Heading'
import { FC, useState } from 'react'
import { RscInput } from 'components/ui/Input'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import Button from 'components/Buttons/Button'
import { UserApi } from 'services/api/UsersApiModule'
import { UserStorage } from 'services/storage/user'
import clsx from 'clsx'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'
import s from './login.module.scss'
import PopUp from 'components/PopUp'
import { store } from 'store'

export interface LoginProps {
  password: string
  username: string
  recaptcha?: string
}

interface Props {
  closePopup(): void

  getUserToken(): void
}

const LoginTender: FC<Props> = ({ closePopup, getUserToken }) => {
  const { modals } = store
  const [popup, setPopup] = useState({ show: false, text: [] })
  const [loader, setLoader] = useState(false)
  const [_reCaptchaToken, _setReCaptchaToken] = useState<string>('')
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    setValue: _setValue,
    formState: { errors },
  } = useForm<LoginProps>({
    mode: 'onChange',
  })

  const onSubmit = async (reg: LoginProps) => {
    setLoader(true)
    const token = await getReCaptchaKey();
    if (!token) {
      setLoader(false)
      modals.openModal({
        body: (
          <PopUp
            text="Ошибка рекапчи"
            closeModal={() => modals?.resetData()}
          />
        ),
      })
      return null
    }
    const currentData = { ...reg, recaptcha: token }
    try {
      setLoader(true)
      const _postUsers = await UserApi.loginUser(currentData).then(
        (response) => {
          UserStorage.setUserToken(response?.data?.auth_token)
          UserStorage.setUserTitle(response?.data?.username)
          getUserToken()
          closePopup()
          setLoader(false)
        },
        (reason) => {
          setLoader(false)
          setPopup({
            show: true,
            text: reason?.response?.data?.non_field_errors || reason?.response?.data?.recaptcha,
          })
        }
      )
    } catch (error: any) {
      setLoader(false)
      setPopup({ show: true, text: error?.response?.data?.non_field_errors })
    }
  }

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.overlay} onClick={() => closePopup()}></div>
        <form className={s.form}>
          <HeadingWithNav title={t('tender_page.login')} />
          <div className={s.input}>
            <RscInput
              {...register('username', {
                required: `${t('forms.card.input')} ${t(
                  'tender_page.login_title'
                )}`,
              })}
              error={errors.username}
              label={t('tender_page.login_title')}
            />
          </div>
          <div className={s.input}>
            <RscInput
              isPasspord
              isAuth={true}
              {...register('password', {
                required: `${t('forms.card.input')} ${t(
                  'tender_page.passwport_title'
                )}`,
              })}
              error={errors.password}
              label={t('tender_page.passwport_title')}
            />
          </div>
          <Button
            isLoading={loader}
            isLong
            value={t('tender_page.login')}
            onClick={handleSubmit(onSubmit)}
          />
          {popup?.show &&
            popup?.text?.map((_item, index) => (
              <p key={index} className={clsx(s.cuption, 'regular-16')}>{popup.text}</p>
            ))}
        </form>
      </div>
    </>
  )
}

export default LoginTender
