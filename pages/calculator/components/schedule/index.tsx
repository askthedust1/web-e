import clsx from "clsx";
import Button from "components/Buttons/Button";
import Container from "components/Container";
import HeadingWithNav from "components/Heading/Heading";
import Icon from "components/Icon";
import React from "react";
import STYLE_SCHEDULE from "./schedule.module.scss";
import { FC } from "react"
import { TableProps } from "services/api/CalculatorModuleApi";
import TableCalculator from "../table-calculator";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { NumericFormat } from "react-number-format";
import { store } from "store";


interface Props {
    data: TableProps
    onClick(): void;
    timeFormat: string
}



const Schedule: FC<Props> = ({ data, onClick, timeFormat }) => {
    const Router = useRouter()
    const { printerPage } = store
    const printSchedule = () => {
        printerPage.printPage(<TableCalculator data={data} timeFormat={timeFormat} />)
        Router.push("rsk-printer")

    }
    const { t } = useTranslation()

    return (
        <>
            <div>
                <div className={STYLE_SCHEDULE.headerWrapper}>
                    <Container>
                        <div className={STYLE_SCHEDULE.header}>
                            <HeadingWithNav title={t("result")} />
                            <div onClick={onClick}>
                                <Icon
                                    className={STYLE_SCHEDULE.icon}
                                    id="cross"
                                    width={15}
                                    height={15}
                                />
                            </div>
                        </div>
                    </Container>
                </div>
                <Container>
                    <div className={STYLE_SCHEDULE.infoWrapper}>
                        <div className={STYLE_SCHEDULE.info}>
                            <p className={clsx(STYLE_SCHEDULE.key, "light-14")}>
                                {t('calculator.procent_added')}
                            </p>
                            <p className={clsx(STYLE_SCHEDULE.value, "regular-32 ")}>
                                <NumericFormat value={data?.added_one_perc || 0}
                                    displayType={'text'}
                                    decimalScale={2}
                                />
                            </p>
                        </div>
                        <div className={STYLE_SCHEDULE.info}>
                            <p className={clsx(STYLE_SCHEDULE.key, "light-14")}>
                                {t("calculator.credit_interest_rate")}
                            </p>
                            <p className={clsx(STYLE_SCHEDULE.value, "regular-32 ")}>
                                <NumericFormat value={data?.perc ? data.perc + "%" : "0%"}
                                    displayType={'text'}
                                    decimalScale={2}
                                />

                            </p>
                        </div>
                        <div className={STYLE_SCHEDULE.info}>
                            <p className={clsx(STYLE_SCHEDULE.key, "light-14")}>
                            {t('payment_summ')}

                            </p>
                            <p className={clsx(STYLE_SCHEDULE.value, "regular-32 ")}>
                                <NumericFormat value={data?.added_full_perc || "0"}
                                    displayType={'text'}
                                    decimalScale={2}
                                />

                            </p>
                        </div>
                        <div className={STYLE_SCHEDULE.button}>
                            <Button className={STYLE_SCHEDULE.buttonText} onClick={printSchedule} value={t("setting.button_print")} />
                        </div>
                    </div>
                    <TableCalculator timeFormat={timeFormat} data={data} />
                </Container>
            </div>
        </>
    );
};

export default Schedule;
