import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import GridCardThin from 'components/Grids/GridCardThin'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { OtherCreateApi, OtherPageApi } from 'services/api/OtherApi'
import { OverdraftInfo, SalaryProjectPage } from 'services/api/OtherApimodule'
import { ServicePoints } from 'services/api/BranchesApi'
import { Branches, Cities } from 'services/api/BranchesApimodule'
import SalaryProjectForm, {
  SalaryProjectApplication,
} from 'pages/online-service/order-over-draft/salary-project'
import { getReCaptchaKey } from '../../helpers/getReCapthaKey'
import PopUp from 'components/PopUp'
import ResultModal from 'components/ResultModal'
import React from 'react'
import { store } from '../../store'
import { useTranslation } from 'next-i18next'
import Heading from 'components/Heading/Heading'
import style from 'pages/online-service/order-internet-acquiring/order-internet-acquiring.module.scss'
import Image from 'next/image'

interface Props {
  data: SalaryProjectPage
  info: Cities[]
  points: Branches[]
  overdraftInfo: OverdraftInfo
}
const SalaryProject: NextPage<Props> = ({
  data,
  info,
  points,
  overdraftInfo,
}) => {
  const { modals } = store
  const { t } = useTranslation()
  const [loader, setLoader] = React.useState(false)
  const [popUp, setPopUp] = React.useState(false)

  const onSubmitSalary = async (data: SalaryProjectApplication) => {
    setLoader(true)
    const token = await getReCaptchaKey()
    if (!token) {
      setLoader(false)
      modals.openModal({
        body: (
          <ResultModal
            success={false}
            message="Ошибка рекапчи"
            closeModal={() => modals?.resetData()}
          />
        ),
      })
      return null
    }
    const currentData = { ...data, recaptcha: token }
    try {
      await OtherCreateApi.createSalaryProject(currentData)
      setLoader(false)
      setPopUp(true)
    } catch (error) {
      setLoader(false)
      modals.openModal({
        body: (
          <ResultModal
            success={false}
            message={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    }
  }
  return (
    <>
      {popUp && <PopUp href="/" />}

      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ''}
          absolute
          currentPage={{
            title: data.banner_title,
            link: '/salary-project',
          }}
        />
      </Container>
      <Section>
        <Banner
          banner_title_hex={data?.banner_title_hex || ''}
          banner_subtitle_hex={data?.banner_subtitle_hex || ''}
          imagePath={data.banner_image}
          imagePathMobile={data.banner_image_mob}
          link={data.banner_button_link}
          linkText={data.banner_button_text}
          subtitle={data.banner_subtitle}
          title={data.banner_title}
          banner_bg={data?.banner_bg}
          banner_bg_mob={data?.banner_bg_mob}
        />
      </Section>
      <Container>
        {data?.sections?.map((item) => (
          <div key={item.id}>
            {(item.title || item.desc) && (
              <Section>
                <CkEditor title={item.title} description={item.desc} />
              </Section>
            )}

            {item?.caption && (
              <Section>
                <CkEditor caption={item.caption} />
              </Section>
            )}
            {item?.icons.length >= 1 && (
              <Section>
                {' '}
                <GridCardThin data={item?.icons} />{' '}
              </Section>
            )}
          </div>
        ))}
        <section>
          <Heading title={t('salary_project')} />
          <div className={style.container}>
            <div className={style.formSection}>
              <SalaryProjectForm
                info={info}
                points={points}
                overdraftInfoData={overdraftInfo}
                onSubmitSalary={onSubmitSalary}
              />
            </div>

            <div className={style.imageSection}>
              <Image
                src="/images/ph3.png"
                alt="Internet Acquiring"
                width={400}
                height={450}
                priority
              />
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}

export default SalaryProject
export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const lang: any = locale
  const { data } = await OtherPageApi.getSalaryProject(lang)

  const { data: info } = await ServicePoints.getRegions(locale || 'ru')

  const { data: overdraftInfo } = await OtherPageApi.getOwerDraft(
    locale || 'ru'
  )

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
      overdraftInfo,
      ...(await getTranslations(lang)),
    },
  }
}
