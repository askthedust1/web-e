import { useTranslation } from 'next-i18next'
import s from './islamic-window-branches.module.scss'
import { IslamicWindowBranchesResponse } from 'services/api/IslamicWindowModule'

interface Props {
  data: IslamicWindowBranchesResponse | null
}

const IslamicWindowBranches = ({ data }: Props) => {
  const { t } = useTranslation()

  if (!data || !data.regions || data.regions.length === 0) {
    return <div className={s.empty}>{t('islamic_addresses.empty')}</div>
  }

  return (
    <div className={s.wrapper}>
      {data.regions.map((region) => (
        <div key={region.region_id} className={s.regionGroup}>
          <h3 className={s.regionName}>{region.region_name}</h3>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>{t('islamic_addresses.col_num')}</th>
                  <th>{t('islamic_addresses.col_branch')}</th>
                  <th>{t('islamic_addresses.col_address')}</th>
                </tr>
              </thead>
              <tbody>
                {region.branches.map((b, idx) => (
                  <tr key={b.id}>
                    <td data-label={t('islamic_addresses.col_num')}>
                      {idx + 1}
                    </td>
                    <td data-label={t('islamic_addresses.col_branch')}>
                      {b.name}
                    </td>
                    <td data-label={t('islamic_addresses.col_address')}>
                      {b.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

export default IslamicWindowBranches
