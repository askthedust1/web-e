import React, { FC } from 'react'
import AccordionItem from 'components/AccordionItem'
import s from './questions.module.scss'
import GradientBlob from 'components/Vacancies/GradientBlob/GradientBlob'

interface Props {
  vacancies: any
}

const Questions: FC<Props> = ({vacancies}) => {
  return (
    <div className={s.questions}>
      <GradientBlob
        background="linear-gradient(358deg, rgba(8,126,229,0.8) 25%, rgba(95,222,197,0.77) 71%)"
        size={200}
        top="10vh"
        left="45vh"
        blur={150}
        zIndex={-1}
      />
      <h2 className={s.title}>{vacancies?.faq_title}</h2>
      <div className={s.sections_5}>
        {
          vacancies?.faqs?.map((item: any) => {
            return <AccordionItem question={item.question} answer={item.answer} key={item.id} borderColor="#8AE3D4" backgroundColor='linear-gradient(180deg, rgba(205, 224, 246, 0.3) 0%, rgba(138, 193, 227, 0.3) 47%, rgba(129, 200, 227, 0.3) 100%)' />
          })
        }
      </div>
    </div>
  )
}

export default Questions