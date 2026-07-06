"use client";

import { FC, memo, useEffect, useRef } from 'react'
import s from "./map.module.scss";
import RskMapMarker from "./Marker";
import {
    Branches,
    ServiceDetailProps,
} from "services/api/BranchesApimodule";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen';
import FullscreenControl from 'components/Map/FullscreenControl/FullscreenControl'

export interface MarkersProps {
    lat: number;
    lng: number;
    slug: string;
    icon: string;
    id: number
}

interface Props {
    setClearMap(e: string | null): void
    data: Branches[]
    detailPoint: ServiceDetailProps | null
    getDetailInfo(slug: string): void,
    clearMap: string | null,
    clearPoint(): void,
    hoveredItemId?: number | null
    center?: [number, number]
}
const SimpleMap: FC<Props> = ({
    data, setClearMap, detailPoint, getDetailInfo, clearMap, clearPoint, hoveredItemId, center
}) => {
  const mapRef = useRef<any>(null);


  const filterMarkers: MarkersProps[] = (data || [])
      .filter((item): item is Branches => !!item && !!item.lat && !!item.lng)
      .map((item) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng),
          slug: item.slug,
          icon: item.icon,
          id: item.id
      }));

  useEffect(() => {
    if (hoveredItemId && mapRef.current) {
      const marker = filterMarkers.find(m => m.id === hoveredItemId);
      if (marker) {
        mapRef.current.flyTo([marker.lat, marker.lng], 15, {
          duration: 0.5
        });
      }
    }
  }, [hoveredItemId, filterMarkers]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, 13, {
        duration: 0.5
      });
    }
  }, [center]);

    return (
      <div className={s.container}>
        <MapContainer center={center}
                      ref={mapRef}
                      zoom={13}
                      scrollWheelZoom={true}
                      style={{ height: "850px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FullscreenControl />
          {

            filterMarkers?.map((item, _index) => (
              <RskMapMarker
                key={item.id}
                clearMap={clearMap}
                data={item}
                detailPoint={detailPoint}
                setClearMap={setClearMap}
                getDetailInfo={getDetailInfo}
                clearPoint={clearPoint}
                isHovered={item.id === hoveredItemId}
              />
            ))
          }
        </MapContainer>,
      </div>
      )
};

export default memo(SimpleMap);
