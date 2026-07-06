import { FC } from 'react'
import Heading from 'components/Heading/Heading'
import Section from 'components/Section'
import Container from 'components/Container'
import CardNumber from 'components/Cards/CardNumber'
import clsx from 'clsx'
import style from './grid-card-number.module.scss'

interface DataItem {
  id: number
  desc: string
  order?: number
}

interface GridCardNumberProps {
  data: DataItem[]
  title?: string
}

const GridCardNumber: FC<GridCardNumberProps> = ({
  data,
  title,
}: GridCardNumberProps) => {
  return (
    <Section>
      <Container>
        <Heading title={title} />
        <div className={clsx(style.grid)}>
          {data?.map((item, index) => (
            <CardNumber key={item.id} title={item.desc} step={index + 1} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default GridCardNumber
