import Container from 'components/Container'
import Section from 'components/Section'
import { FC } from 'react'
import s from "./iframe.module.scss"

interface Props {
    link: string,

}
const IframeCustom: FC<Props> = ({ link }) => {
    return (
        <Section>
            <Container>
                <iframe src={link} className={s.iframe}></iframe>
            </Container>

        </Section>
    )
}

export default IframeCustom