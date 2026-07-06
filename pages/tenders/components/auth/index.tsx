import { FC, useMemo, useState } from 'react'
import s from './authentication.module.scss'
import Icon from 'components/Icon'
import Button from 'components/Buttons/Button'
import clsx from 'clsx'
import { UserStorage } from 'services/storage/user'
import RegistrationForm from '../registration'
import LoginTender from '../login'
import { useTranslation } from 'next-i18next'

interface Props {
  token: string | boolean | null
  getUserToken(): void
  slugName?: string
  userName?: string
  loginNmae?: string
}
const Authentication: FC<Props> = ({
  token,
  getUserToken,
  slugName: _slugName,
  userName,
  loginNmae,
}) => {
  const { t } = useTranslation()
  const [authState, setAuthState] = useState({
    reg: false,
    login: false,
  })

  const login = () => {
    setAuthState((prev) => ({ ...prev, login: true }))
  }
  const registration = () => {
    setAuthState((prev) => ({ ...prev, reg: true }))
  }

  const logoutUser = () => {
    UserStorage.logoutUser()
    UserStorage.logoutTilte()
    getUserToken()
  }

  const userCheck = useMemo(
    function callback() {
      if (token) {
        return (
          <div className={s.wrapper}>
            <div className={s.authWrapper}>
              <Icon id="auth" width={44} height={44} className={s.authIcon} />
              <div className={s.content}>
                <p className={clsx(s.title, 'light-14')}>
                  {t('tender_page.logined')}
                </p>
                <p className={clsx(s.subtutle, 'regular-16')}>{userName}</p>
                <p className={clsx(s.subtutle, 'regular-16')}>{loginNmae}</p>
              </div>
            </div>
            <div className={s.buttonWhite}>
              <Button
                onClick={() => logoutUser()}
                className={s.button}
                value={t("tender_page.leave")}
              />
            </div>
          </div>
        )
      } else {
        return (
          <div className={s.wrapper}>
            <div className={s.authWrapper}>
              <div>
                {' '}
                <Icon
                  id="auth"
                  width={44}
                  height={44}
                  className={s.loginIcon}
                />
              </div>

              <div className={s.content}>
                <p className={clsx(s.subtutle, 'regular-16')}>
                  {t('tender_page.cuption_auth')}
                </p>
              </div>
            </div>
            <div className={s.buttonsWrapper}>
              <Button
                className={clsx(s.buttonsReg)}
                value={t('tender_page.register')}
                onClick={() => registration()}
              />
              <Button
                className={clsx(s.buttonOutline)}
                isOutline
                value={t('tender_page.login')}
                onClick={() => login()}
              />
            </div>
          </div>
        )
      }
    },
    [token, userName]
  )

  return (
    <>
      {authState.reg && (
        <RegistrationForm
          loginShow={login}
          getUserToken={getUserToken}
          closePopup={() => setAuthState((prev) => ({ ...prev, reg: false }))}
        />
      )}
      {authState.login && (
        <LoginTender
          getUserToken={getUserToken}
          closePopup={() => setAuthState((prev) => ({ ...prev, login: false }))}
        />
      )}
      {userCheck}
    </>
  )
}

export default Authentication
