import clsx from 'clsx'
import parse from 'html-react-parser'
import Container from 'components/Container'
import Section from 'components/Section'
import style from './islamic-conditions-table.module.scss'

interface Short {
  id: number
  key: string
  value: string
}

interface IslamicConditionsTableProps {
  shorts: Short[]
  title?: string
}

const isShariaRow = (key: string) => key.toLowerCase().includes('шариат')

const IslamicConditionsTable = ({ shorts, title }: IslamicConditionsTableProps) => {
  if (!shorts?.length) return null

  const conditionRows = shorts.filter((s) => !isShariaRow(s.key))
  const shariaRow = shorts.find((s) => isShariaRow(s.key))

  return (
    <Section>
      <Container>
        {title && <p className={style.sectionTitle}>{title}</p>}

        <div className={style.wrapper}>
          <table className={style.table}>
            <tbody>
              {conditionRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={clsx(style.row, index % 2 === 0 ? style.even : style.odd)}
                >
                  <td className={style.label}>{row.key}</td>
                  <td className={style.value}>{parse(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {shariaRow && (
          <div className={style.shariaDisclaimer}>
            <span className={style.shariaIcon}>✓ {shariaRow.key}</span>
            <p className={style.shariaText}>{parse(shariaRow.value)}</p>
          </div>
        )}
      </Container>
    </Section>
  )
}

export default IslamicConditionsTable
