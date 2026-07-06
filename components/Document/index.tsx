import Container from 'components/Container'
import Section from 'components/Section'
import React from 'react'
import Heading from 'components/Heading/Heading'
import Icon from 'components/Icon'
import Modal from 'components/ui/Modal'
import style from './document.module.scss'
interface documentsItems {
  id: number
  title?: string
  file: string
  ext?: string
  desc?: string
  slug?: string
}
interface DocumentProps {
  documents?: documentsItems[]
  title?: string
}
const Document: React.FC<DocumentProps> = ({
  documents,
  title,
}: DocumentProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentFile, setCurrentFile] = React.useState<{
    url: string
    title?: string
  } | null>(null)

  const openDocument = (e: React.MouseEvent, item: documentsItems) => {
    const url = item.file
    if (!url) return

    const pathname = url.split('?')[0]
    const ext = pathname.split('.').pop()?.toLowerCase() || ''

    const officeExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf']

    if (ext === 'pdf') {
      e.preventDefault()
      setCurrentFile({ url, title: item.title })
      setIsOpen(true)
      return
    }

    if (officeExts.includes(ext)) {
      e.preventDefault()
      ;(async () => {
        try {
          const resp = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          })

          if (!resp.ok) {
            // fallback: open in new tab
            window.open(url, '_blank')
            return
          }

          const blob = await resp.blob()
          const downloadName = item.title
            ? `${item.title.replace(/\s+/g, '_')}.${ext}`
            : pathname.split('/').pop()
          const objectUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = objectUrl
          a.download = downloadName as string
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(objectUrl)
        } catch (err) {
          window.open(url, '_blank')
        }
      })()
      return
    }
  }

  return (
    <Section>
      <Container>
        <Heading title={title} />
        {documents &&
          documents?.map((item) => (
            <a
              href={item.file}
              className={`${style.wrapper} light-18`}
              key={item.id}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => openDocument(e, item)}
            >
              <div>
                <Icon id="pdf" width={32} height={32} className={style.icon} />
              </div>
              <span>{item.title}</span>
            </a>
          ))}

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} width="95%">
          {currentFile && (
            <div style={{ width: '100%', height: '100%', padding: 20 }}>
              <h3 style={{ margin: '0 0 12px 0' }}>{currentFile.title}</h3>
              <div style={{ width: '100%', height: '70vh', maxHeight: '80vh' }}>
                <iframe
                  title={currentFile.title}
                  src={currentFile.url}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </Section>
  )
}

export default Document
