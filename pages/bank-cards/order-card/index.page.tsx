import Container from 'components/Container'
import { GetServerSideProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import { CardOrderApi, CardsApi } from 'services/api/CardsApi'
import { OrderCardInfoProps } from 'services/api/CardsApModule'
import DeliverCard, { FormSecondStep } from './DeliverCard'
import DeteilCard, { FormThirdStep } from './DeteilCard'
import SelectCard from './SelectCard'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import PopUp from 'components/PopUp'
import { getTranslations } from 'helpers/serverTranslations'
import CheckUser, { UserTypeArray } from './CheckUser'
import { useTranslation } from 'next-i18next'
import { store } from 'store'
import Loader from 'components/Loader'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'

interface SelectCardProps {
  card: number
  currencies: number[]
  services: number[]
  recaptcha: string
}
interface Props {
  info: OrderCardInfoProps
}

enum CardOrderSteps {
  SelectCard,
  Deliver,
  Deteil,
}
export interface CurrentDataFirstStep {
  card: number
  currencies: number[][]
  services: number[]
  id?: number
  recaptcha: string
}
export interface FirstStepResponse {
  card: number
  currencies: number[]
  services: number[]
  id: number
}
const OrderCard: NextPage<Props> = ({ info }) => {
  const router = useRouter()
  const [cardInfo, _setCardInfo] = useState<OrderCardInfoProps | null>(
    info || null
  )
  const { modals } = store
  const [userType, setUserType] = useState<number>(1)
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(CardOrderSteps.SelectCard)
  const [applicationId, setApplicationId] = useState<number | any>(0)
  const [popUp, setPopUp] = useState(false)
  const [reCaptchaToken, setReCaptchaToken] = useState<string>('')
  const [cardSlug, setCardSlug] = useState<string | null>(null)

  const goToNext = () => {
    setCurrentStep((prev) => prev + 1)
  }
  const goBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const formatDayMonth = (date: Date) => {
    return format(new Date(date), 'yyyy-MM-dd')
  }

  const onSumbitTypeUser = (id: number) => {
    if (id === UserTypeArray.AllReadyClient) {
      router.push(
        `/bank-cards/order-card?for_who=${
          router.query.for_who || 'individual'
        }&type=${router.query.type || ''}&card=1`
      )
      renderSteps()
    } else if (id === UserTypeArray.NotEat) {
      router.push('/online-service/order-identification')
    } else {
      return null
    }
  }

  const routerParams = () => {
    router.push(
      {
        pathname: router?.pathname,
        query: {
          ...router.query,
          step: currentStep + 1,
        },
      },
      undefined,
      { shallow: true }
    )
  }

  // * Первый шаг: выбор карты
  const onSubmitSelectCard = async (info: SelectCardProps) => {
    routerParams()

    const selectedCard = cardInfo?.cards?.find((card) => card.id === info.card)

    setCardSlug(selectedCard?.slug || null)

    const array = []
    array.push(info?.currencies)
    const currentData: CurrentDataFirstStep = {
      card: info.card,
      currencies: array,
      services: info.services,
      recaptcha: reCaptchaToken,
    }

    try {
      setPopUp(true)
      const { data }: any =
        await CardOrderApi.createCardOrderFirsStep(currentData)
      setApplicationId(data.id)
      goToNext()
      setPopUp(false)
    } catch (error) {
      setPopUp(false)
      modals.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setPopUp(false)
    }
  }
  // * Второй шаг: Адрес доставки
  const onSubmitDeliver = async (data: FormSecondStep) => {
    routerParams()
    setPopUp(true)
    try {
      await CardOrderApi.updateDeliver(applicationId, data)
      setPopUp(false)
      goToNext()
    } catch (error) {
      setPopUp(false)
      modals.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setPopUp(false)
    }
  }

  //* Третий шаг: Детальная форма заявки
  const onSubmitDetails = async (data: FormThirdStep) => {
    setPopUp(true)
    const currentData: any = {
      ...data,
      passport_from: formatDayMonth(data.passport_from),
      passport_till: formatDayMonth(data.passport_till),
    }

    const formData = new FormData()

    Object.keys(currentData).forEach((key) => {
      formData.append(key, currentData[key])
    })

    try {
      await CardOrderApi.updateDeteil(applicationId, formData).then((_res) => {
        routerParams()
        setPopUp(false)
        modals.openModal({
          body: <PopUp href="/" closeModal={() => modals?.resetData()} />,
        })
      })
    } catch (error) {
      setPopUp(false)
      modals.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setPopUp(false)
    }
  }

  const STEPS = [
    t('forms.steps.card'),
    t('forms.steps.deliver'),
    t('forms.steps.passport'),
  ]
  const MESSAGE_INFO = info?.page?.application_caption
  const DOCUMENTS = info?.page?.docs
  const personalData = info?.page?.personal_data_processing
  const resolvedCardSlug =
    cardSlug ||
    cardInfo?.cards?.find(
      (card) => String(card.id) === String(router.query.type)
    )?.slug ||
    null

  const renderSteps = () => {
    switch (currentStep) {
      case CardOrderSteps.SelectCard: {
        return (
          <SelectCard
            goBack={goBack}
            message={MESSAGE_INFO}
            documents={DOCUMENTS}
            current={currentStep + 1}
            allCard={cardInfo?.cards}
            onSubmitHandler={onSubmitSelectCard}
            steps={STEPS}
          />
        )
      }

      case CardOrderSteps.Deliver: {
        return (
          <DeliverCard
            delivery_methods={info?.delivery_methods}
            delivery_branches={info?.delivery_branches}
            goBack={goBack}
            message={MESSAGE_INFO}
            documents={DOCUMENTS}
            steps={STEPS}
            current={currentStep + 1}
            cities={cardInfo?.delivery_cities}
            onSubmitHandler={onSubmitDeliver}
            regions={info?.regions}
            delivery_cities={info?.delivery_cities}
            cardSlug={resolvedCardSlug}
          />
        )
      }
      case CardOrderSteps.Deteil: {
        return (
          <DeteilCard
            goBack={goBack}
            message={MESSAGE_INFO}
            documents={DOCUMENTS}
            steps={STEPS}
            current={currentStep + 1}
            countries={cardInfo?.countries}
            onSubmitHandler={onSubmitDetails}
            personalData={personalData}
            cardSlug={resolvedCardSlug}
          />
        )
      }
    }
  }

  const getToken = async () => {
    const token = await getReCaptchaKey()

    if (!token) {
      getToken()
    }

    if (token) {
      setReCaptchaToken(token)
    }
  }
  useEffect(() => {
    getToken()
  }, [])

  return (
    <>
      {popUp && <Loader />}
      {!reCaptchaToken.length && <Loader />}
      <Container>
        {router.query.card === String(UserTypeArray.AllReadyClient) ? (
          renderSteps()
        ) : (
          <CheckUser
            onSumbitTypeUser={onSumbitTypeUser}
            userType={userType}
            setUserType={setUserType}
            documents={DOCUMENTS}
            message={MESSAGE_INFO}
          />
        )}
      </Container>
    </>
  )
}

export default OrderCard
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const lang: any = locale
  const { data } = await CardsApi.getOrderCardInfo(locale || 'ru')
  return {
    props: {
      info: data,
      ...(await getTranslations(lang)),
    },
  }
}
