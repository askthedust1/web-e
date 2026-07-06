import Icon from 'components/Icon'
import style from './message.module.scss'
import parse from 'html-react-parser'
import clsx from 'clsx'

interface Message {
  success?: boolean
  danger?: boolean
  warning?: boolean
  good?: boolean
  title?: string
  color?: string
  desc?: string
}

const Message = ({
  success,
  danger,
  warning,
  title,
  color,
  good,
  desc,
}: Message) => {

  if(!title){
    return null
  }
  return (
    <div
      className={`${style.wrapper} ${
        success || color === 'green' ? style.success : ''
      } ${danger || color === 'red' ? style.danger : ''}  
        ${warning || color === 'grey' ? style.warning : ''}
        ${good || color === 'yellow' ? style.good : ''}`}
    >
      <div className={`${style.title} regular-16 forVisual`}>
        <Icon
          className={style.icon}
          width={24}
          height={24}
          id={`${success || color == 'green' ? 'info-circle-fill' : ''}${
            danger || color == 'red' ? 'info-circle-fill' : ''
          }${warning || color == 'grey' ? 'info-circle-fill' : ''}
                ${good || color == 'yellow' ? 'info-circle-fill' : ''}
                `}
        />
        {title && parse(title)}
      </div>
      {desc && (
        <div className={clsx(style.desc, 'forVisual')}> {parse(desc)}</div>
      )}
    </div>
  )
}

export default Message
