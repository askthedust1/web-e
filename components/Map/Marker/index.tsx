import { FC, useEffect, useRef, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { MarkersProps } from 'pages/info/components/MapDefault'
import { ServiceDetailProps } from 'services/api/BranchesApimodule'
import MarkerDetail from '../MarkerDetail'
import s from '../MarkerDetail/marker-detail.module.scss'
import L from 'leaflet'

interface Props {
  getDetailInfo(slug: string | null): void
  setClearMap(slug: string | null): void
  data: MarkersProps
  clearMap: string | null
  detailPoint: ServiceDetailProps | null
  clearPoint(): void
  isHovered?: boolean
}

const RskMapMarker: FC<Props> = ({
                                   data,
                                   setClearMap,
                                   clearMap,
                                   getDetailInfo,
                                   detailPoint,
                                   isHovered,
                                   clearPoint
                                 }) => {
  const markerRef = useRef<any>(null)

  const [isOpen, setIsOpen] = useState(false);
  const getDetailMarker = (slug: string | null) => {
    handleActiveMarker(slug)
    getDetailInfo(slug)
    setIsOpen(true)
  }

  useEffect(() => {
    if (markerRef.current && isHovered) {
      markerRef.current.setZIndexOffset(1000)
      markerRef.current.getElement()?.classList.add('marker-hovered')
    } else if (markerRef.current) {
      markerRef.current.setZIndexOffset(0)
      markerRef.current.getElement()?.classList.remove('marker-hovered')
    }
  }, [isHovered])

  const handleActiveMarker = (marker: string | null) => {
    if (marker === clearMap) return
    setClearMap(marker)
  }

  const createCustomIcon = (iconUrl: string) =>
    new L.Icon({
      iconUrl,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -44],
      className: isHovered ? s.markerHovered : ''
    })

  const position: [number, number] = [data.lat, data.lng]
  const icon = createCustomIcon(data.icon)

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => getDetailMarker(data.slug)
      }}
    >
      {isOpen && detailPoint && clearMap === data.slug && data.slug?.length !== 0 && (
        <Popup
          closeButton={true}
          eventHandlers={{
            remove: () => {
              getDetailMarker(null)
              clearPoint()
              setIsOpen(false)
            }
          }}
        >
          <MarkerDetail info={detailPoint} />
        </Popup>
      )}
    </Marker>
  )
}

export default RskMapMarker

