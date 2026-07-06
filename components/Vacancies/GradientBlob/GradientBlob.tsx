import React from 'react'
import styles from './gradientBlob.module.scss'

type Props = {
  background: string
  size?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  opacity?: number
  blur?: number
  zIndex?: number
}

const GradientBlob = ({
                        background,
                        size = 400,
                        top,
                        left,
                        right,
                        bottom,
                        opacity = 1,
                        blur = 120,
                        zIndex = 0,
                      }: Props) => {
  const style: React.CSSProperties = {
    background,
    width: size,
    height: size,
    top,
    left,
    right,
    bottom,
    opacity,
    filter: `blur(${blur}px)`,
    zIndex,
  }

  return <div className={styles.blob} style={style} />
}

export default GradientBlob
