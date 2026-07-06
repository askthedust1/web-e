import Icon from 'components/Icon'
import style from './accordion-item.module.scss'
import {FC, useState} from "react";
import parse from 'html-react-parser';

interface AccordionItemProps {
    question: any;
    answer: string;
    backgroundColor?: string;
    borderColor?: string;
    iconColor?: string;
    iconActiveColor?: string;
}

const AccordionItem: FC<AccordionItemProps> = ({
                                                   question,
                                                   answer,
                                                   backgroundColor,
                                                   borderColor,
                                                   iconColor: _iconColor,
                                                   iconActiveColor: _iconActiveColor
                                               }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
      <div
        className={`${style.wrapper} ${isOpen ? style.active : ''}`}
        style={{
            background: backgroundColor,
            border: `1px solid ${borderColor}`
        }}
      >
          <div className={`${style.head} light-18`} onClick={toggle}>
              {question}
              <Icon
                width={24}
                height={24}
                id={isOpen ? 'minus-around-fill' : 'plus-around-fill'}
                className={style.icon}
              />
          </div>
          {isOpen && (
            <div className={style.body}>
                {parse(answer)}
            </div>
          )}
      </div>
    );
};


export default AccordionItem;
