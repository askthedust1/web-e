import React, { FC, useRef, useState } from 'react'
import styles from './camera.module.scss'

interface Props {
  handleChange: (file: File) => void
}

function base64ToFile(
  base64: string,
  filename: string,
  mimeType: string = 'image/png'
): File {
  const byteString = window.atob(base64.split(',')[1])
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([arrayBuffer], { type: mimeType })
  return new File([blob], filename, { type: mimeType })
}
const Camera: FC<Props> = ({ handleChange }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Ошибка доступа к камере: ', error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      setIsStreaming(false)
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
        const imageData = canvasRef.current.toDataURL('image/png')
        setPhoto(imageData)
        stopCamera()
      }
    }
  }

  const retakePhoto = () => {
    setPhoto(null)
    startCamera()
  }

  const uploadPhoto = async () => {
    if (photo) {
      const file = base64ToFile(photo, 'image.png')
      handleChange(file)
    }
  }

  return (
    <div className={styles.cameraContainer}>
      {!photo ? (
        <>
          <video
            ref={videoRef}
            className={styles.cameraView}
            autoPlay
            playsInline
            style={{ maxHeight: '100%', objectFit: 'cover' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className={styles.controls}>
            {!isStreaming ? (
              <div onClick={startCamera} className={styles.button}>
                Включить камеру
              </div>
            ) : (
              <div onClick={takePhoto} className={styles.button}>
                Сделать фото
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.photoResult}>
          {/* eslint-disable-next-line no-restricted-syntax -- photo is a canvas toDataURL (data: URL) — next/image cannot optimize data URLs, keep raw img */}
          <img
            src={photo}
            alt="Сделанное фото"
            className={styles.capturedPhoto}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className={styles.retakenPhoto} onClick={retakePhoto}>
              Переснять фото
            </div>
            <div
              className={styles.retakenPhoto}
              onClick={uploadPhoto}
              style={{ backgroundColor: 'green' }}
            >
              Загрузить
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Camera
