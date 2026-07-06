import clsx from 'clsx'
import Section from 'components/Section'
import { useTranslation } from 'next-i18next'
import { FC } from 'react'
import { TableProps } from 'services/api/CalculatorModuleApi'
import STYLE_SCHEDULE from "../../components/schedule/schedule.module.scss"

interface Props {
    data: TableProps,
    timeFormat: string
}


const TableCalculator: FC<Props> = ({ data, timeFormat }) => {
    const { t } = useTranslation()
    return (
        <Section className={STYLE_SCHEDULE.print}>
            <table id="print" className={STYLE_SCHEDULE.table}>
                <thead className={STYLE_SCHEDULE.thead}>
                    <tr className={STYLE_SCHEDULE.tr}>
                        <th className={clsx(STYLE_SCHEDULE.th, "light-16")}>{t("month_one")}</th>
                        <th className={clsx(STYLE_SCHEDULE.th, "light-16")}>
                            {t("remainder_of_main_debt")}
                        </th>
                        <th className={clsx(STYLE_SCHEDULE.th, "light-16")}>
                            {t("main_debt")}
                        </th>
                        <th className={clsx(STYLE_SCHEDULE.th, "light-16")}>
                            {t("added_procet")}
                        </th>
                        <th className={clsx(STYLE_SCHEDULE.th, "light-16")}>
                            {t("payment_amount")}
                        </th>
                    </tr>
                </thead>
                <tbody className={STYLE_SCHEDULE.tbody}>
                    {data?.results?.map((item) => (
                        <tr key={item?.month} className={STYLE_SCHEDULE.tr}>
                            <td className={clsx(STYLE_SCHEDULE.td, "ligth-16")}>
                                {item?.month} {" "} {timeFormat}
                            </td>
                            <td className={clsx(STYLE_SCHEDULE.td, "ligth-16")}>
                                {item?.main_rest}
                            </td>
                            <td className={clsx(STYLE_SCHEDULE.td, "ligth-16")}>
                                {item?.main_debt}
                            </td>
                            <td className={clsx(STYLE_SCHEDULE.td, "ligth-16")}>
                                {item?.added_perc}
                            </td>
                            <td className={clsx(STYLE_SCHEDULE.td, "ligth-16")}>
                                {item?.pay}
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </Section>
    )
}

export default TableCalculator