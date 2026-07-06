import style from './video-block.module.scss'

const VideoBlock = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.play}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M8 5 L19 12 L8 19 Z" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  )
}

export default VideoBlock
