import Button from 'components/Buttons/Button'
import style from './hero.module.scss'

const Hero = () => {
  return (
    <div className={style.wrapper}>
      <p className={style.label}>премиальная карта</p>
      <h1 className={style.title}>World Elite</h1>
      <p className={style.subtitle}>новый уровень привилегий</p>
      <Button
        value="Заказать карту"
        href="/bank-cards/order-card"
        isBlue
        className={style.button}
      />
    </div>
  )
}

export default Hero
