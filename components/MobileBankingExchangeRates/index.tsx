import CardMobileBanking from "components/Cards/CardMobileBanking";
import CardExchangeRates from "components/Cards/CardExchangeRates";
import Section from "components/Section";
import Container from "components/Container";
import style from './mobile-banking-exchange-rates.module.scss'

import { ExchangeProps } from "services/api/MainModule";
interface Array {
    title: string;
    id: number;
    icon: string;
}

interface dataProps {
    title: string
    app_store_link: string;
    background: string;
    google_play_link: string;
    id: number;
    image: string;
    infos: Array[];

}
interface MobileBankingExchangeRatesProps {
    data: dataProps
    exchange: ExchangeProps
}

const MobileBankingExchangeRates = ({ data, exchange }: MobileBankingExchangeRatesProps) => {
    return (
        <Section>
            <Container>
                <div className={style.grid}>
                    <CardMobileBanking data={data} />
                    <CardExchangeRates data={exchange} />
                </div>
            </Container>
        </Section>
    );
};

export default MobileBankingExchangeRates;