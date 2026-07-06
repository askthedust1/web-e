import Image, { ImageProps } from 'next/image'

// API media URLs come already percent-encoded; decode once so next/image does
// not double-encode them into an over-long /_next/image URL (HTTP 414).
const decodeMediaUrl = (url: string) => {
  try {
    return decodeURIComponent(url)
  } catch {
    return url
  }
}

type AppImageProps = Omit<ImageProps, 'loader'>

const AppImage = ({ src, alt = '', ...props }: AppImageProps) => {
  if (!src) return null

  return (
    <Image
      src={typeof src === 'string' ? decodeMediaUrl(src) : src}
      alt={alt}
      {...props}
    />
  )
}

export default AppImage
