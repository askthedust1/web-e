import Icon from 'components/Icon'
import style from './accordion-item-card-big-info.module.scss'
import {FC, useState} from "react";
import parse from 'html-react-parser';
import logoSvg from "public/images/logoSvc.png"
import Image from 'next/image'
interface AccordionItemProps {
    question: any,
    answer: any,
}

const AccordionItemCardBigInfo: FC <AccordionItemProps> = ({question, answer}: AccordionItemProps) => {

    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(!isOpen)
    }
 
    return (
        <div className={`${style.wrapper} ${isOpen ? style.active : ''}`}>
            <div className={`${style.head} light-18`} onClick={toggle}>
                {question}
                <div>
                    
                    {
                    answer && 
                <Icon width={24} height={24} id={`${isOpen ? 'arrow-down' : 'arrow-right'}`} className={style.icon} />
                }
                </div>
                <Image src={logoSvg} alt='logoSvg' width={55} height={35} className={style.logo}/>
            </div>
            {
                answer &&
                    isOpen &&
                <div className={style.body}>
                    {parse(answer)}
                </div>
            }
        </div>
    );
};

export default AccordionItemCardBigInfo;
