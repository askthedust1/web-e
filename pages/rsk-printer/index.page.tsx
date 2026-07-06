import { useEffect, FC, useState } from 'react'
import { store } from 'store'
import { observer } from 'mobx-react-lite'
import Container from 'components/Container'
import { GetServerSideProps } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import Button from 'components/Buttons/Button'
import { useTranslation } from 'next-i18next'

interface Props {}

const Printer: FC<Props> = observer(({}) => {
  const { printerPage } = store
  const [isShow, setShow] = useState<boolean>(false)
  const { t } = useTranslation()
  const router = useRouter()
  const printPage = () => {
    setShow(false)
    setTimeout(() => {
      window.print()
    }, 1000)
    setTimeout(() => {
      setShow(true)
    }, 4000)
  }

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 4000)

    if (!printerPage.printPageComponent) {
      router.push('/calculator')
    } else {
      setTimeout(() => {
        window.print()
      }, 1000)
    }
  }, [])

  return (
    <>
      <Container>
        <div style={{ marginTop: '60px' }}>
          {isShow && (
            <Button value={t('setting.button_print')} onClick={printPage} />
          )}
          <div style={{overflow: "hidden"}}>{printerPage.printPageComponent}</div>
        </div>
      </Container>
    </>
  )
})

export default Printer
export const getServerSideProps: GetServerSideProps = async ({
  locale,
}) => {
  const lang: any = locale
  return {
    props: {
      ...(await getTranslations(lang)),
    },
  }
}
