import React, { FC } from 'react'
import Image from 'next/image'
import Section from 'components/Section'
import Container from 'components/Container'
import style from './card-payment.module.scss'
import Button from 'components/Buttons/Button'
import { useTranslation } from 'next-i18next'

interface DataProps {
  background: string
  button_link: string
  button_text: string
  id: number
  image: string
  infos: {
    icon: string
    id: number
    title: string
  }[]
  title: string
}

interface CardPaymentProps {
  data: DataProps
}

const CardPayment: FC<CardPaymentProps> = ({ data }: CardPaymentProps) => {
  const { t } = useTranslation()

  return (
    <Section>
      <Container>
        <div className={style.card}>
          <Image
            className={style.bg}
            src={data?.background || '/'}
            fill
            style={{ objectFit: 'cover', objectPosition: '70% 70%' }}
            sizes="100vw"
            alt={data?.title || ''}
          />
          <div className={style.grid}>
            <div className={style.text}>
              <h2 className={`${style.title} medium-32`}>{data?.title}</h2>
              <ul className={style.list}>
                {data?.infos?.map((item) => (
                  <li
                    className={`${style.item} light-16 color-white`}
                    key={item.id}
                  >
                    <Image
                      alt={data?.title || ''}
                      src={item.icon || '/'}
                      width={26}
                      height={26}
                    />
                    {item.title}
                  </li>
                ))}
              </ul>
              <div className={style.button}>
                <Button
                  value={t('setting.button_more')}
                  href={data?.button_link}
                />
              </div>
            </div>
            <div
              className={style.img}
              style={{ display: data?.image ? 'block' : 'none' }}
            >
              <Image
                alt={data?.title || ''}
                src={data?.image || '/'}
                width={393}
                height={300}
                className={style.image}
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default CardPayment
