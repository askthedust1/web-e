import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

import 'leaflet';
import L from 'leaflet'

declare module 'leaflet' {
  namespace control {
    function fullscreen(options?: any): Control;
  }
}

const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    L.control.fullscreen({
      position: 'topright',
      title: 'Полноэкранный режим',
    }).addTo(map);
  }, [map]);

  return null;
};

export default FullscreenControl;
