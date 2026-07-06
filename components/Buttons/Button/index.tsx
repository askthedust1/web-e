import Link from 'next/link'
import style from '../button.module.scss'

interface Button {
  disabled?: boolean
  value: string
  className?: string
  onOtherPage?: boolean
  href?: string
  isOutline?: boolean
  isSmall?: boolean
  isMedium?: boolean
  isLarge?: boolean
  isLong?: boolean
  isBlue?: boolean
  isLoading?: boolean
  loadingText?: string
  onClick?: (e?: any) => void
  isGray?: boolean
  color?: string
  hrefLink?:
  | {
    pathname: string
    query: { type: string; for_who: string }
  }
  | any
}

const Button = ({
  disabled = false,
  isBlue,
  value,
  className,
  href,
  isOutline,
  isSmall,
  color,
  isMedium: isMediumProp,
  isLarge,
  onClick,
  isLong,
  isGray,
  hrefLink,
  isLoading = false,
  loadingText = 'Загрузка...',
  onOtherPage = false,
}: Button) => {
  const sizeClass = isLarge
    ? style.large
    : isSmall
      ? style.small
      : style.medium
  const routerCheck = hrefLink ? hrefLink : href
  const stopPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }
  return (
    <>
      {href || hrefLink ? (
        <Link legacyBehavior href={routerCheck}>
          <a
            onClick={(e) => {
              stopPropagation(e)
            }}
            target={onOtherPage ? '_blank' : ''}
            style={{ backgroundColor: color }}
            className={`
                            border-black
                            regular-18
                            ${className}
                            ${style.default}
                            ${isOutline ? style.outline : ''}
                            ${sizeClass}
                            ${isLong ? style.isLong : ''}
                            ${isGray ? style.isGray : ''}
                            ${isBlue ? style.isBlue : ''}
                            ${disabled && style.disabled}
                        `}
          >
            {value}
          </a>
        </Link>
      ) : (
        <button
          type="button"
          disabled={disabled}
          aria-disabled={disabled}
          aria-busy={isLoading}
          className={`
                        border-black
                        regular-18
                        ${className}
                        ${style.default}
                        ${isOutline ? style.outline : ''}
                        ${sizeClass}
                        ${isLong ? style.isLong : ''}
                        ${isGray ? style.isGray : ''}
                        ${isBlue ? style.isBlue : ''}
                      ${isLoading && style.loading}
                      ${disabled && style.disabled}
                    `}
          onClick={onClick}
          style={{ backgroundColor: color }}
        >
          {isLoading ? loadingText : value}
        </button>
      )}
    </>
  )
}

export default Button
