import { FC } from 'react'
import Heading from 'components/Heading/Heading'
import Section from 'components/Section'
import Container from 'components/Container'
import CardThin from 'components/Cards/CardThin'
import style from './grid-card-thin.module.scss'

interface DataItem {
    id: number,
    title: string,
    icon?: string;
    desc?: string;
    
}
interface GridCardThinProps {
    title?: string,
    data: DataItem[],
    caption?: string,
    subTitle?: string,
}



const GridCardThin: FC<GridCardThinProps> = ({title, data, subTitle: _subTitle, caption: _caption}: GridCardThinProps) => {

    return (
        <Section>
            <Container>
                <Heading title={title}/>
                <div className={style.grid}>
                    {data?.map(item =>
                        <CardThin
                            key={item.id}
                            title={item.title}
                            imagePath={item.icon}
                            isSmallTitle
                            desc={item.desc}
                        />
                    )}
                </div>
            </Container>
        </Section>
    );
};

export default GridCardThin;