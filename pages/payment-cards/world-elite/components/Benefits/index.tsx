import Container from 'components/Container'
import BenefitItem from '../BenefitItem'
import {
  LoungeIcon,
  FastTrackIcon,
  CashbackIcon,
  RoamingIcon,
  MedicalIcon,
  LocationIcon,
} from '../BenefitItem/icons'
import style from './benefits.module.scss'

const BENEFITS = [
  {
    icon: <LoungeIcon />,
    title: 'Безлимитный доступ в бизнес-залы LoungeKey',
    desc: 'До 500 000 сомов + грайс период 45 дней',
  },
  {
    icon: <FastTrackIcon />,
    title: 'Fast Track без ограничений',
    desc: 'Приоритетное прохождение предполетного контроля в аэропортах без очереди',
    reverse: true,
  },
  {
    icon: <CashbackIcon />,
    title: 'Cashback 2%',
    desc: 'Получайте 2% cashback за покупки в торговых точках и оплату товаров и услуг в интернете',
  },
  {
    icon: <RoamingIcon />,
    title: 'Бесплатный роуминг данных по всему миру',
    desc: 'До 3 ГБ мобильного интернета в год через Flexiroam для устройств с поддержкой eSIM',
    reverse: true,
  },
  {
    icon: <MedicalIcon />,
    title: 'Медицинское страхование',
    desc: 'во время поездок до 500 000 долларов США. Расширенное страхование путешествий и защита багажа',
  },
  {
    icon: <LocationIcon />,
    title: 'Обслуживание без очереди',
    desc: 'во всех областных филиалах Элдик Банка',
    reverse: true,
  },
]

const Benefits = () => {
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
          />
        ))}
      </Container>
    </div>
  )
}

export default Benefits
