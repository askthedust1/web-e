import React, { FC } from 'react'
import Container from 'components/Container'
import Section from 'components/Section'
import style from './card-text.module.scss'
import parse from 'html-react-parser'
interface infoText {
  id: number
  // key: string,
  // value: string;
  title?: string
  desc?: string
  key?: string
  value?: string
}
interface CardTextProps {
  info: infoText[]
}
const CardText: FC<CardTextProps> = ({ info }) => {
  if (info?.length === 0) {
    return null
  }

  return (
    <Section>
      <Container>
        <div className={style.grid}>
          {info?.map((item, index) => (
            <div className={style.card} key={index}>
              <p className={`${style.title} light-14`}>
                {item.key && parse(item.key)}
              </p>
              <div className="light-18">
                {item?.value && parse(item?.value)}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default CardText
