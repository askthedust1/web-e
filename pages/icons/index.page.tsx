import Head from 'next/head'
import Section from 'components/Section'
import Heading from 'components/Heading/Heading'
import Container from 'components/Container'
import IconExample from 'components/IconExample'
import style from './icons.module.scss'
interface Icons {
  item: string
  text: string
  array: []
}
const Icons = () => {
  const array = [
    'europa',
    'kazakhstan',
    'russian',
    'usa',
    'call',
    'headphone',
    'whatsapp',
    'info-circle',
    'info-circle-fill',
    'arrow-left',
    'arrow-right',
    'arrow-right-small',
    'arrow-down',
    'facebook',
    'instagram',
    'telegram',
    'twitter',
    'plus-around-fill',
    'minus-around-fill',
    'pdf',
    'phone',
    'sms',
    'search',
    'service',
    'cross',
    'ellipse',
    'phone-thin',
    'pin-location',
    'arrow-up-thin',
    'arrow-down-thin',
    'calendar',
    'fillter',
    'location',
    'kyg',
    'russ',
    'usa',
    'auth',
    'folder-upload',
    'cross-around',
    'edit',
    'delete',
    'eye',
  ]

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Section className={style.wrapper}>
      <Container>
        <Heading title="Все иконки"></Heading>
        <div className={style.grid}>
          {array.map((item, index) => (
            <IconExample item={item} key={index} />
          ))}
        </div>
      </Container>
    </Section>
    </>
  )
}

export default Icons
