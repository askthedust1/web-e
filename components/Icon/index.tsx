import style from './icon.module.scss'

interface CardProps {
    className?: string;
    width?: number;
    height?: number;
    id?: string;
}

const Icon = ({className, width, height, id}: CardProps) => (
    <svg width={width} height={height} className={`${style.icon} ${className}`}>
        <use xlinkHref={`/sprite.svg#${id}`}/>
    </svg>
)

export default Icon;