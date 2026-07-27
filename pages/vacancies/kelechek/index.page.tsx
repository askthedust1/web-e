import React, { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import s from './kelechek.module.scss'

interface Direction {
  id: number
  title: string
  subtitle: string
  description: string
  variant: 'blue' | 'green'
}

interface Story {
  id: number
  name: string
  text: string
  featured?: boolean
}

interface Product {
  id: number
  label: string
  short: string
}

interface Faq {
  id: number
  question: string
  answer: string
}

const navLinks = [
  { href: '#hero', label: 'Главная' },
  { href: '#about', label: 'О нас' },
  { href: '#advantages', label: 'Наши преимущества' },
  { href: '#directions', label: 'Открытие направления' },
  { href: '#faq', label: 'FAQ' },
]

const directions: Direction[] = [
  {
    id: 1,
    title: 'Инженерия',
    subtitle: 'Центр управления сетями',
    description:
      'Интерес к технической стороне вопроса — главный признак того, что ты обязательно во драйвери. Здесь ты узнаешь, как обеспечивается стабильная скорость мобильного интернета.',
    variant: 'blue',
  },
  {
    id: 2,
    title: 'Маркетинг',
    subtitle: 'Служба маркетинга',
    description:
      'Маркетинг: приставляем поисковики и умеем с высокого маркетинга — базовым навыком хорошего маркетолога. Выбирая маркетинг, ты научишься глубже понимать, что хотят потребители.',
    variant: 'green',
  },
  {
    id: 3,
    title: 'Биллинг',
    subtitle: 'Служба поддержки биллинговых систем',
    description:
      'Служба администрирования Linux/Unix и щелым слоями специализированных программного обеспечения и технологий.',
    variant: 'blue',
  },
]

const stories: Story[] = [
  {
    id: 1,
    name: 'Харитонова Анастасия',
    text: 'На стажировке я познакомилась с классными ребятами, приняла участие в интересном проекте и получила массу навыков. Меня продвинула команда, работать с нами было одно удовольствие.',
  },
  {
    id: 2,
    name: 'Саубанова Сабина',
    text: 'На стажировке я познакомилась с классными ребятами, приняла участие в интересном проекте и получила массу навыков. Меня продвинула команда, работать с нами было одно удовольствие.',
  },
  {
    id: 3,
    name: 'Харитонова Анастасия',
    text: 'На стажировке я познакомилась с классными ребятами, приняла участие в интересном проекте и получила массу навыков. Меня продвинула команда, работать с нами было одно удовольствие.',
  },
  {
    id: 4,
    name: 'Харитонова Анастасия',
    text: 'На стажировке я познакомилась с классными ребятами, приняла участие в интересном проекте и получила массу навыков. Меня продвинула команда, работать с нами было одно удовольствие.',
    featured: true,
  },
]

const products: Product[] = [
  { id: 1, label: 'Мой Beeline', short: 'B' },
  { id: 2, label: 'Balance', short: 'C' },
  { id: 3, label: 'Укмуш ТВ', short: 'TV' },
  { id: 4, label: 'Укмуш ТВ', short: 'TV' },
  { id: 5, label: 'Укмуш ТВ', short: 'TV' },
  { id: 6, label: 'Укмуш ТВ', short: 'TV' },
  { id: 7, label: 'Укмуш ТВ', short: 'TV' },
]

const faqs: Faq[] = [
  {
    id: 1,
    question: 'Период стажировки',
    answer:
      'Стажировка длится от 2 до 3 месяцев с возможностью дальнейшего трудоустройства в команду Beeline и Eldik.',
  },
  {
    id: 2,
    question: 'Способ подачи заявки',
    answer:
      'Заполни короткую форму на этой странице — наши HR-специалисты свяжутся с тобой в ближайшее время.',
  },
  {
    id: 3,
    question: 'Можно ли совмещать с учебой?',
    answer:
      'Да, мы формируем гибкий график, чтобы стажировку можно было совмещать с учёбой в университете.',
  },
  {
    id: 4,
    question: 'Этапы приема на стажировку',
    answer:
      'Подача заявки → знакомство с HR → техническое собеседование → оффер и выход на стажировку.',
  },
]

const advantages = [
  {
    id: 1,
    title: 'Оплачиваемая стажировка',
    text: 'Интерес к технической стороне вопроса — главный признак того, что ты обязательно во драйвери.',
  },
  {
    id: 2,
    title: 'Реальные бизнес задачи',
    text: 'Интерес к технической стороне вопроса — главный признак того, что ты обязательно во драйвери.',
  },
  {
    id: 3,
    title: 'Крутые менторы',
    text: 'Интерес к технической стороне вопроса — главный признак того, что ты обязательно во драйвери.',
  },
]

const FaqItem: React.FC<{ faq: Faq }> = ({ faq }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${s.faqItem} ${open ? s.faqItemOpen : ''}`}>
      <button className={s.faqHead} onClick={() => setOpen((v) => !v)}>
        <span>{faq.question}</span>
        <span className={s.faqArrow}>→</span>
      </button>
      {open && <div className={s.faqBody}>{faq.answer}</div>}
    </div>
  )
}

const Kelechek: NextPage = () => {
  return (
    <div className={s.page}>
      {/* ================= HERO ================= */}
      <section id="hero" className={s.hero}>
        <div className={s.heroShapes} aria-hidden>
          <span className={`${s.shape} ${s.shapeStar} ${s.starYellow}`} />
          <span className={`${s.shape} ${s.shapeStar} ${s.starGreen}`} />
          <span className={`${s.shape} ${s.shapeBlue}`} />
          <span className={`${s.shape} ${s.shapeYellowSquare}`} />
        </div>

        <header className={s.topbar}>
          <nav className={s.topNav}>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className={s.topNavLink}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className={s.topRight}>
            <a href="#advantages" className={s.participateBtn}>
              Участвуй!
            </a>
            <div className={s.langSwitch}>
              <span className={s.langActive}>RU</span>
              <span>KY</span>
            </div>
          </div>
        </header>

        <div className={s.heroLogos}>
          <span className={s.eldikLogo}>ЭЛДИК БАНК</span>
          <span className={s.logoCross}>×</span>
          <span className={s.beelineLogo}>Beeline</span>
        </div>

        <div className={s.heroContent}>
          <span className={s.heroBadge}>
            KELE
            <br />
            CHEK
          </span>
          <h1 className={s.heroTitle}>
            KELECHEK
            <span className={s.heroYear}>2026</span>
          </h1>

          <div className={s.heroMeta}>
            <span className={s.metaPill}>
              <span className={s.metaIcon}>25</span> Сентября
            </span>
            <span className={s.metaPill}>
              <span className={s.metaIcon}>◷</span> 10:00–17:00
            </span>
            <span className={s.metaPill}>
              <span className={s.metaIcon}>◉</span> Novotel Bishkek
            </span>
          </div>
        </div>
      </section>

      {/* ================= ABOUT / INTERNSHIP ================= */}
      <section id="about" className={s.about}>
        <div className={s.aboutInner}>
          <div className={s.aboutLeft}>
            <h2 className={s.sectionTitleDark}>СТАЖИРОВКА</h2>
            <p className={s.aboutLead}>Beeline + Eldik!</p>
            <p className={s.aboutText}>
              Мечтаешь, но всё никак не решишься? Хочешь получить практический
              опыт, развить навыки, узнать, раскрыть свой потенциал и построить
              карьеру? Тогда Beeline Kelechek — для тебя!
            </p>
            <p className={s.aboutText}>
              Регистрируйся, знакомься с командой Beeline Kyzmatkeri, учись у
              лучших специалистов и сделай уверенный шаг к своему
              профессиональному будущему.
            </p>

            <div className={s.joinCard}>
              <span className={`${s.joinBlob} ${s.joinBlobTop}`} />
              <span className={`${s.joinBlob} ${s.joinBlobBottom}`} />
              <p className={s.joinLabel}>УЧАСТВУЙ ЕСЛИ ТЫ:</p>
              <p className={s.joinTitle}>
                <span className={s.joinHighlight}>СТУДЕНТ</span> ИЛИ
                <br />
                ВЫПУСКНИК
              </p>
            </div>
          </div>

          <div className={s.aboutRight}>
            <div className={s.collage}>
              <div className={s.collagePhoto}>
                <span>KELECHEK 2026</span>
              </div>
              <span className={s.inspired}>
                INSPIRED <span className={s.learnBadge}>LEARN</span>
              </span>
            </div>

            <ul className={s.advantagesList}>
              {advantages.map((a) => (
                <li key={a.id} className={s.advItem}>
                  <p className={s.advTitle}>{a.title}</p>
                  <p className={s.advText}>{a.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a href="#directions" className={s.registerBtn}>
          Регистрируйся
        </a>
      </section>

      {/* ================= DIRECTIONS ================= */}
      <section id="directions" className={s.directions}>
        <div className={s.directionsInner}>
          <div className={s.directionsHead}>
            <h2 className={s.sectionTitleLight}>НАШИ НАПРАВЛЕНИЯ</h2>
            <a href="#directions" className={s.seeAllBtn}>
              Смотреть все
            </a>
          </div>

          <div className={s.directionsGrid}>
            {directions.map((d) => (
              <article
                key={d.id}
                className={`${s.dirCard} ${
                  d.variant === 'green' ? s.dirCardGreen : s.dirCardBlue
                }`}
              >
                <h3 className={s.dirTitle}>{d.title}</h3>
                <div className={s.dirBody}>
                  <p className={s.dirSubtitle}>{d.subtitle}</p>
                  <p className={s.dirDesc}>{d.description}</p>
                  <a href="#faq" className={s.dirLink}>
                    Подробнее →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className={s.marquee}>
        <div className={s.marqueeTrack}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className={s.marqueeItem}>
              KELECHEK 2026 <span className={s.marqueeDot}>●</span> Регистрируйся!
              <span className={s.marqueeDot}>●</span>
            </span>
          ))}
        </div>
      </div>

      {/* ================= STORIES ================= */}
      <section id="stories" className={s.stories}>
        <div className={s.storiesInner}>
          <h2 className={s.sectionTitleDark + ' ' + s.storiesTitle}>
            ИСТОРИИ СОТРУДНИКОВ
          </h2>
          <div className={s.storiesGrid}>
            {stories.map((story) => (
              <article
                key={story.id}
                className={`${s.storyCard} ${
                  story.featured ? s.storyCardFeatured : ''
                }`}
              >
                <div className={s.storyText}>
                  <h4 className={s.storyName}>{story.name}</h4>
                  <p className={s.storyBody}>{story.text}</p>
                  {!story.featured && (
                    <a href="#stories" className={s.storyLink}>
                      Подробнее →
                    </a>
                  )}
                </div>
                {!story.featured && <div className={s.storyPhoto} />}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className={s.products}>
        <h2 className={s.productsTitle}>
          НАШИ СТАЖЕРЫ БУДУТ РАБОТАТЬ С{' '}
          <span className={s.productsHighlight}>ПРОДУКТАМИ</span> БРЕНДА BEELINE
          И ELDIK
        </h2>
        <div className={s.productsRow}>
          {products.map((p) => (
            <div key={p.id} className={s.productItem}>
              <span className={s.productLogo}>{p.short}</span>
              <span className={s.productLabel}>{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className={s.faq}>
        <div className={s.faqInner}>
          <h2 className={s.faqTitle}>FAQ</h2>
          <div className={s.faqList}>
            {faqs.map((faq) => (
              <FaqItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={s.footer}>
        <div className={s.footerShapes} aria-hidden>
          <span className={`${s.shape} ${s.footerGreen1}`} />
          <span className={`${s.shape} ${s.footerGreen2}`} />
        </div>
        <div className={s.footerTop}>
          <h2 className={s.footerHeading}>
            НАПИШИ, ЕСЛИ
            <br />
            ОСТАЛИСЬ ВОПРОСЫ
          </h2>
          <a href="mailto:dreamteam@beeline.kg" className={s.footerMail}>
            DREAMTEAM@BEELINE.KG
          </a>
        </div>
        <div className={s.footerCols}>
          {[0, 1, 2].map((col) => (
            <ul key={col} className={s.footerCol}>
              <li className={s.footerColHead}>Главное</li>
              <li>О нас</li>
              <li>Наши преимущества</li>
              <li>Открытые направления</li>
            </ul>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default Kelechek

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await getTranslations(locale || 'ru')),
    },
  }
}
