'use client'

import { FC, memo } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import s from './map.module.scss'
import Offices from '/public/images/office/Bank.png'

export interface MarkersProps {
  lat: number
  lng: number
  slug: string
  icon: string
}

interface Props {
  centerLocation: {
    lat: number
    lng: number
  }
}

const MapDefault: FC<Props> = ({ centerLocation }) => {
  const position: [number, number] = [centerLocation.lat, centerLocation.lng]

  const customIcon = new L.Icon({
    iconUrl: Offices.src,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -60],
    className: ''
  })

  return (
    <div className={s.container}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}/>
      </MapContainer>
    </div>
  )
}

export default memo(MapDefault)

