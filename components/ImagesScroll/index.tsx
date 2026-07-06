import Container from 'components/Container'
import AppImage from 'components/ui/AppImage'
import s from './images-scroll.module.scss'
import { FC } from 'react'

interface Props {
  data: {
    id: number
    image: string
  }[]
}
const ImagesScroll: FC<Props> = ({ data }) => {
  return (
    <Container>
      <div className={s.wrapper}>
        {data?.map((item) => (
          <div key={item.id} className={s.imgWrapper}>
            <AppImage alt="" src={item.image} width={500} height={500} />
          </div>
        ))}
      </div>
    </Container>
  )
}

export default ImagesScroll
