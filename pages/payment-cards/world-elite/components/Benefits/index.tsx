import { useState } from 'react'
import Container from 'components/Container'
import BenefitItem from '../BenefitItem'
import BenefitModal from '../BenefitModal'
import { BENEFITS, Benefit } from './benefits.data'
import style from './benefits.module.scss'

const Benefits = () => {
  const [selected, setSelected] = useState<Benefit | null>(null)

  return (
    <div className={style.wrapper}>
      <Container>
        <p className={`medium-32 ${style.title}`}>
          Преимущества и возможности
        </p>
        {BENEFITS.map((item, index) => (
          <BenefitItem
            key={index}
            icon={item.icon}
            title={item.title}
            desc={item.desc}
            reverse={item.reverse}
            onClick={() => setSelected(item)}
          />
        ))}
      </Container>
      <BenefitModal benefit={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default Benefits
