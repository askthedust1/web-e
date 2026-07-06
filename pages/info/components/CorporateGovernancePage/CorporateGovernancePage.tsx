import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import styles from './сorporateGovernancePage.module.scss'
import Container from 'components/Container'
import Icon from 'components/Icon'
import AppImage from 'components/ui/AppImage'
import style from 'components/Document/document.module.scss'
import { OtherPageApi } from 'services/api/OtherApi'
import { ISectionEldikGreenDeteil } from 'pages/sustainable-development/index.page'

interface Document {
  title: string
  file: string
  type: string
  size?: string
}

interface Principle {
  id: number
  title: string
  description: string
  icon: string
}

interface Committee {
  id: number
  type: string
  title: string
  description: string
}

interface Block {
  type: string
  title?: string
  description?: string
  principles?: Principle[]
  committees?: Committee[]
  functions?: string[]
  responsibilities?: string[]
  approaches?: string[]
  elements?: string[]
  documents?: Document[]
  link?: string
  link_text?: string
}

interface CorporateGovernancePageProps {
  data: {
    title?: string
    hero_description?: string
    blocks?: Block[]
  }
}

const CorporateGovernancePage: React.FC<CorporateGovernancePageProps> = ({
  data,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router
  const [activeNav, setActiveNav] = useState<string>('principles')
  const [apiDocuments, setApiDocuments] = useState<
    ISectionEldikGreenDeteil['documents']
  >([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await OtherPageApi.getSustainableDetailClient(
          'korporativnye-esg-dokumenty',
          locale || 'ru'
        )

        if (response.data && Array.isArray(response.data.documents)) {
          setApiDocuments(response.data.documents)
        } else {
          setApiDocuments([])
        }
      } catch (err) {
        setError('Не удалось загрузить документы')
        setApiDocuments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [locale])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setActiveNav(sectionId)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'principles',
        'board',
        'committees',
        'management',
        'secretary',
        'esg',
        'sharia',
        'documents',
      ]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })
      if (currentSection) {
        setActiveNav(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const renderPrinciples = (
    principles: Principle[],
    width: string,
    height: string
  ) => (
    <div className={styles.principlesGrid}>
      {principles.map((principle) => (
        <div key={principle.id} className={styles.principleCard}>
          <div className={styles.principleIcon}>
            {/* eslint-disable-next-line no-restricted-syntax -- CSS-string sizing (width 100% / height 150px) — next/image needs numeric dims or fill; faithful conversion would require SCSS layout changes. */}
            {principle.icon === 'transparency' && (
              <img
                width={width}
                height={height}
                src="/images/about/ic1.png"
                alt={'ic1'}
              />
            )}
            {/* eslint-disable-next-line no-restricted-syntax */}
            {principle.icon === 'responsibility' && (
              <img
                width={width}
                height={height}
                src="/images/about/ic3.png"
                alt={'ic2'}
              />
            )}
            {/* eslint-disable-next-line no-restricted-syntax */}
            {principle.icon === 'control' && (
              <img
                width={width}
                height={height}
                src="/images/about/ic2.png"
                alt={'ic3'}
              />
            )}
            {/* eslint-disable-next-line no-restricted-syntax */}
            {principle.icon === 'ethics' && (
              <img
                width={width}
                height={height}
                src="/images/about/ic6.png"
                alt={'ic4'}
              />
            )}
            {/* eslint-disable-next-line no-restricted-syntax */}
            {principle.icon === 'esg' && (
              <img
                width={width}
                height={height}
                src="/images/about/ic5.png"
                alt={'ic5'}
              />
            )}
            {/* eslint-disable-next-line no-restricted-syntax */}
            {principle.icon === 'protection' && (
              <img
                width={width}
                height={height}
                src="/images/about/ic4.png"
                alt={'ic6'}
              />
            )}
          </div>
          <h3 className={styles.principleTitle}>{principle.title}</h3>
          <p className={styles.principleDescription}>{principle.description}</p>
        </div>
      ))}
    </div>
  )

  const renderList = (items: string[]) => (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={index} className={styles.listItem}>
          {item}
        </li>
      ))}
    </ul>
  )

  const renderCommittees = (committees: Committee[]) => (
    <div className={styles.committeesGrid}>
      {committees.map((committee) => (
        <div key={committee.id} className={styles.committeeCard}>
          <div className={styles.committeeIcon}>
            {committee.type === 'audit' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#156CE6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            )}
            {committee.type === 'risk' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#156CE6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="M12 12v3" />
                <path d="M12 7v1" />
              </svg>
            )}
            {committee.type === 'hr' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#156CE6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            )}
            {committee.type === 'nomination' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#156CE6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
            )}
            {committee.type === 'sustainability' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#156CE6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            )}
          </div>
          <h3 className={styles.committeeTitle}>{committee.title}</h3>
          <p className={styles.committeeDescription}>{committee.description}</p>
        </div>
      ))}
    </div>
  )

  type ApiDocument = {
    title: string
    file: string
    type?: string
    size?: string
    [key: string]: any
  }

  const renderDocuments = (documentsToRender: ApiDocument[]) => (
    <div className={styles.documentsGrid}>
      {documentsToRender.length === 0 ? (
        <p className={styles.noDocuments}>Документы отсутствуют</p>
      ) : (
        documentsToRender.map((doc, index) => (
          <a
            key={index}
            href={doc.file}
            className={styles.documentCard}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <div className={styles.documentIcon}>
              <Icon id="pdf" width={32} height={32} className={style.icon} />
            </div>
            <div className={styles.documentInfo}>
              <h3 className={styles.documentTitle}>{doc.title}</h3>
              {doc.size && (
                <span className={styles.documentSize}>{doc.size}</span>
              )}
            </div>
            <div className={styles.downloadButton}>
              <span>Скачать</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 11L3 6L4.4 4.6L7 7.2V1H9V7.2L11.6 4.6L13 6L8 11Z"
                  fill="currentColor"
                />
                <path
                  d="M14 9V13H2V9H0V13C0 14.1 0.9 15 2 15H14C15.1 15 16 14.1 16 13V9H14Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </a>
        ))
      )}
    </div>
  )

  const getDocumentsFromData = (): Document[] => {
    const documentsBlock = data.blocks?.find(
      (block) => block.type === 'documents'
    )
    return documentsBlock?.documents || []
  }

  const allDocuments = [...getDocumentsFromData(), ...apiDocuments]

  return (
    <div className={styles.page}>
      <nav className={styles.navigation}>
        <Container>
          <div className={styles.navWrapper}>
            <button
              className={`${styles.navLink} ${activeNav === 'principles' ? styles.active : ''}`}
              onClick={() => scrollToSection('principles')}
            >
              {t('corporateGovernance.nav.principles')}
            </button>

            <button
              className={`${styles.navLink} ${activeNav === 'board' ? styles.active : ''}`}
              onClick={() => scrollToSection('board')}
            >
              {t('corporateGovernance.nav.board')}
            </button>

            <button
              className={`${styles.navLink} ${activeNav === 'committees' ? styles.active : ''}`}
              onClick={() => scrollToSection('committees')}
            >
              {t('corporateGovernance.nav.committees')}
            </button>

            <button
              className={`${styles.navLink} ${activeNav === 'management' ? styles.active : ''}`}
              onClick={() => scrollToSection('management')}
            >
              {t('corporateGovernance.nav.management')}
            </button>

            <button
              className={`${styles.navLink} ${activeNav === 'secretary' ? styles.active : ''}`}
              onClick={() => scrollToSection('secretary')}
            >
              {t('corporateGovernance.nav.secretary')}
            </button>

            <button
              className={`${styles.navLink} ${activeNav === 'esg' ? styles.active : ''}`}
              onClick={() => scrollToSection('esg')}
            >
              {t('corporateGovernance.nav.esg')}
            </button>

            <button
              className={`${styles.navLink} ${activeNav === 'sharia' ? styles.active : ''}`}
              onClick={() => scrollToSection('sharia')}
            >
              {t('corporateGovernance.nav.sharia')}
            </button>

            <button
              className={`${styles.navLink} ${activeNav === 'documents' ? styles.active : ''}`}
              onClick={() => scrollToSection('documents')}
            >
              {t('corporateGovernance.nav.documents')}
            </button>
          </div>
        </Container>
      </nav>

      <section className={styles.hero}>
        <Container>
          <div className={styles.corporateGovernanceWrapper}>
            <div>
              <h1 className={styles.heroTitle}>
                {data.title || 'Корпоративное управление'}
              </h1>
              <p className={styles.heroDescription}>
                {data.hero_description ||
                  'Банк выстраивает систему корпоративного управления в соответствии с лучшими международными практиками, законодательством Кыргызской Республики и внутренними нормативными документами.'}
              </p>
            </div>
            <div className={styles.heroIllustration}>
              <AppImage
                src="/images/CorporateGovernance.png"
                alt="Corporate Governance"
                width={400}
                height={400}
                sizes="(max-width: 992px) 300px, 400px"
              />
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <section id="principles" className={styles.section}>
          {data.blocks?.map(
            (block, index) =>
              block.type === 'principles' && (
                <div key={index}>
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  {block.principles &&
                    renderPrinciples(block.principles, '100%', '150px')}
                </div>
              )
          )}
        </section>

        <section id="board" className={styles.section}>
          {data.blocks?.map(
            (block, index) =>
              block.type === 'board_of_directors' && (
                <div key={index}>
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  <p className={styles.sectionDescription}>
                    {block.description}
                  </p>
                  {block.functions && renderList(block.functions)}
                  {block.link && (
                    <a href={block.link} className={styles.linkButton}>
                      {block.link_text || 'Подробнее'}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M1 6H11"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M6 1L11 6L6 11"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )
          )}
        </section>

        <section id="committees" className={styles.section}>
          {data.blocks?.map(
            (block, index) =>
              block.type === 'committees' && (
                <div key={index}>
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  <p className={styles.sectionDescription}>
                    {block.description}
                  </p>
                  {block.committees && renderCommittees(block.committees)}
                </div>
              )
          )}
        </section>

        <section id="management" className={styles.section}>
          {data.blocks?.map(
            (block, index) =>
              block.type === 'management_board' && (
                <div key={index}>
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  <p className={styles.sectionDescription}>
                    {block.description}
                  </p>
                  {block.responsibilities && renderList(block.responsibilities)}
                  {block.link && (
                    <a href={block.link} className={styles.linkButton}>
                      {block.link_text || 'Подробнее'}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M1 6H11"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M6 1L11 6L6 11"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )
          )}
        </section>

        <section id="secretary" className={styles.section}>
          {data.blocks?.map(
            (block, index) =>
              block.type === 'corporate_secretary' && (
                <div key={index}>
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  <p className={styles.sectionDescription}>
                    {block.description}
                  </p>
                  {/* eslint-disable-next-line no-restricted-syntax -- Inline width 100% + CSS object-fit cover at fixed 500px height; next/image needs a positioned/sized wrapper (fill) or numeric dims — faithful conversion requires SCSS changes. */}
                  <img
                    width={'100%'}
                    className={styles.corporateSecretaryImg}
                    src="/images/picture1.jpg"
                    alt="Corporate"
                  />
                </div>
              )
          )}
        </section>

        <section id="esg" className={styles.section}>
          {data.blocks?.map(
            (block, index) =>
              block.type === 'esg' && (
                <div key={index} className={styles.esgSection}>
                  <div className={styles.esgContent}>
                    <h2 className={styles.sectionTitle}>{block.title}</h2>
                    <p className={styles.sectionDescription}>
                      {block.description}
                    </p>
                    {block.approaches && renderList(block.approaches)}
                    {block.link && (
                      <a href={block.link} className={styles.linkButton}>
                        {block.link_text || 'Подробнее'}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M1 6H11"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M6 1L11 6L6 11"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                  <div className={styles.esgDocuments}></div>
                </div>
              )
          )}
        </section>

        <section id="sharia" className={styles.section}>
          {data.blocks?.map(
            (block, index) =>
              block.type === 'sharia_management' && (
                <div key={index}>
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  <p className={styles.sectionDescription}>
                    {block.description}
                  </p>

                  {block.elements && renderList(block.elements)}

                  {block.link && (
                    <a href={block.link} className={styles.linkButton}>
                      {block.link_text || 'Подробнее о руководстве'}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M1 6H11"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M6 1L11 6L6 11"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )
          )}
        </section>

        <section className={styles.section}>
          {data.blocks?.map(
            (block, index) =>
              block.type === 'transparency' && (
                <div key={index} className={styles.transparencySection}>
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  <p className={styles.transparencyDescription}>
                    {block.description}
                  </p>
                </div>
              )
          )}
        </section>

        <section id="documents" className={styles.section}>
          <h2 className={styles.sectionTitle}>Документы</h2>

          {loading ? (
            <div className={styles.loading}>
              Загрузка дополнительных документов...
            </div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            apiDocuments.length > 0 && (
              <div className={styles.documentsSection}>
                {renderDocuments(allDocuments)}
              </div>
            )
          )}
        </section>
      </Container>
    </div>
  )
}

export default CorporateGovernancePage
