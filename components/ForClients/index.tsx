import Section from "components/Section";
import Container from "components/Container";
import Heading from "components/Heading/Heading";
import CardThin from "components/Cards/CardThin";
import style from './for-clients.module.scss'
import { FC } from "react";
interface Array{
    id: number,
    icon: string,
    title: string,
    link: string,
}
interface ForClientsProps {
    title?: string
    data: Array[]
}
const ForClients: FC<ForClientsProps> = ({title, data}: ForClientsProps) => {
    
    return (
        <Section>
            <Container>
                <Heading title={title}/>
                <div className={style.grid}>
                    {data?.map(item => (
                        <CardThin
                            key={item.id}
                            title={item.title}
                            imagePath={item.icon}
                            href={item.link}
                            isIcon
                            isRevert={false}
                        />
                    ))}                   
                </div>
            </Container>
        </Section>
    );
};

export default ForClients;