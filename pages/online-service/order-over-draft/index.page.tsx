import React from 'react'
import style from './get-ower-drafr.module.scss'
import Heading from 'components/Heading/Heading'
import { OtherCreateApi, OtherPageApi } from 'services/api/OtherApi'
import { OverdraftInfo } from 'services/api/OtherApimodule'
import { GetServerSideProps, NextPage } from 'next'
import PopUp from 'components/PopUp'
import Container from 'components/Container'
import SalaryProject, { SalaryProjectApplication } from './salary-project'
import { useTranslation } from 'next-i18next'
import Loader from 'components/Loader'
import { store } from 'store'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'
import { ServicePoints } from 'services/api/BranchesApi'
import { Branches, Cities } from 'services/api/BranchesApimodule'
import { getTranslations } from 'helpers/serverTranslations'

interface Props {
  data: OverdraftInfo
  info: Cities[]
  points: Branches[]
}

const GetOwerDraft: NextPage<Props> = ({ data, info, points }) => {
  const { t } = useTranslation()
  const [loader, setLoader] = React.useState(false)
  const [popUp, setPopUp] = React.useState(false)
  const { modals } = store

  const onSubmitSalary = async (formData: SalaryProjectApplication) => {
    setLoader(true)
    const token = await getReCaptchaKey()
    if (!token) {
      setLoader(false)
      modals.openModal({
        body: (
          <PopUp text="Ошибка рекапчи" closeModal={() => modals?.resetData()} />
        ),
      })
      return null
    }
    const currentData = { ...formData, recaptcha: token }
    try {
      await OtherCreateApi.createSalaryProject(currentData)
      setLoader(false)
      setPopUp(true)
    } catch (error) {
      setLoader(false)
      modals.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    }
  }

  return (
    <>
      {loader && <Loader />}
      {popUp && <PopUp href="/" />}
      <Container>
        <div className={style.part}>
          <div className={style.block}>
            <Heading title={t('overdraft')} />
            <SalaryProject
              data={data}
              info={info}
              points={points}
              onSubmitSalary={onSubmitSalary}
            />
          </div>
        </div>
      </Container>
    </>
  )
}

export default GetOwerDraft

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const lang: any = locale
  const { data } = await OtherPageApi.getOwerDraft(locale || 'ru')

  const { data: info } = await ServicePoints.getRegions(locale || 'ru')

  const { data: points } = await ServicePoints.getAllPoints(
    locale || 'ru',
    'branches',
    {
      city: query?.city,
      mode: query?.mode,
      branch_type: query?.branch_type,
    }
  )
  return {
    props: {
      data,
      info,
      points,
      ...(await getTranslations(lang)),
    },
  }
}
