import HeadingWithNav from 'components/Heading/Heading'
import style from './check-user.module.scss'
import { useTranslation } from 'next-i18next'
import CardInfoBig, { DocumentProps } from 'components/Cards/CardInfoBig'
import React, { FC } from 'react'
import InputRadio from 'components/Input/InputRadio'
import Button from 'components/Buttons/Button'

export enum UserTypeArray {
  AllReadyClient = 1,
  NotEat = 2,
}
interface Props {
  message?: string
  documents: DocumentProps[]
  userType: number
  setUserType(id: number): void
  onSumbitTypeUser(id: number): void
}

const CheckUser: FC<Props> = ({
  message,
  documents,
  userType,
  setUserType,
  onSumbitTypeUser,
}) => {
  const { t } = useTranslation()
  const userTypeArray = [
    {
      name: t('rsk_client'),
      id: 1,
    },
    // {
    //     name: t("not_rsk_client"),
    //     id: 2,
    // }
  ]

  return (
    <div className={style.container}>
      <div className={style.part}>
        <HeadingWithNav title={t('forms.card.title')} />
        <div className={style.block}>
          <InputRadio
            value={userType}
            name="currencies"
            onClick={setUserType}
            labelArray={userTypeArray}
          />
        </div>
        <div className={style.buttonWrapper}>
          <Button
            value={t('forms.card.continue')}
            onClick={() => onSumbitTypeUser(userType)}
          />
        </div>
      </div>
      <div className={style.part}>
        <div>
          <CardInfoBig info={message} documents={documents} isCardOrder />
        </div>
      </div>
    </div>
  )
}

export default CheckUser
