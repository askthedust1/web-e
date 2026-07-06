import React from 'react'
import AppImage from 'components/ui/AppImage'
import s from '../../../pages/vacancies/components/successStories/successStories.module.scss'
import { useRouter } from 'next/router'

interface Props {
  slug: string
  image: string
  title: string
}

const StoriesCardBig: React.FC<Props> = ({ image, title, slug }) => {
  const router = useRouter()

  const handleClick = () => {
    const forWho = router?.query?.for_who
    const query = forWho === 'legal' ? { for_who: 'legal' } : {}

    router.push({
      pathname: `/vacancies/stories/${slug}`,
      query,
    })
  }
  return (
    <div
      className={s.largeCard}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={s.imageWrapperLarge}>
        <AppImage
          src={image}
          alt={title}
          width={700}
          height={400}
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '20px',
          }}
        />
      </div>
      <h3>{title}</h3>
    </div>
  )
}

export default StoriesCardBig
