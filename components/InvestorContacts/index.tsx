import { FC } from 'react'
import { useTranslation } from 'next-i18next'
import Icon from 'components/Icon'
import AppImage from 'components/ui/AppImage'
import { InvestorContact } from 'services/api/InvestorRelationsApi.models'

interface Props {
  contacts?: InvestorContact[]
}

const InvestorContacts: FC<Props> = ({ contacts }) => {
  const { t } = useTranslation()

  if (!contacts?.length) {
    return null
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 20 }}>
      {contacts.map((c) => (
        <div
          key={c.id}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: 12,
            padding: 20,
            maxWidth: 360,
          }}
        >
          {c.photo && (
            <AppImage
              src={c.photo}
              alt={c.full_name}
              width={96}
              height={96}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <h3 style={{ margin: '12px 0 4px' }}>{c.full_name}</h3>
          <p style={{ color: '#6b7280', margin: '0 0 12px' }}>{c.position}</p>
          {c.phone && (
            <a
              style={{ display: 'block' }}
              href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}
            >
              {c.phone}
            </a>
          )}
          {c.email && (
            <a style={{ display: 'block' }} href={`mailto:${c.email}`}>
              {c.email}
            </a>
          )}
          {c.whatsapp_number && (
            <a
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 12,
              }}
              target="_blank"
              rel="noopener noreferrer"
              href={`https://api.whatsapp.com/send?phone=${c.whatsapp_number.replace(/[^\d]/g, '')}`}
            >
              <Icon id="whatsapp" width={24} height={24} />
              <span>{t('write_to_whatsapp')}</span>
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

export default InvestorContacts
