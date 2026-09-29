import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const parseCoord = (coord) => {
  if (!coord) return null;
  if (typeof coord === 'number') return coord;
  const parsed = parseFloat(String(coord).replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
};

function RecenterMap({ position, inDesfasurare, allPins, hasRoute, cityCoords }) {
  const map = useMap();

  useEffect(() => {
    if (!inDesfasurare) {
      map.closePopup();
    }

    if (!hasRoute && cityCoords && !inDesfasurare) {
      map.flyTo(cityCoords, 13, { animate: true, duration: 2 });
    }
    else if (hasRoute && !inDesfasurare && allPins && allPins.length > 0) {
      const bounds = L.latLngBounds(allPins.map(p => p.coords));
      map.flyToBounds(bounds, { padding: [70, 70], animate: true, duration: 1.5 });
    }
    else if (inDesfasurare && position) {
      map.flyTo(position, 16, { animate: true, duration: 1.5 });
    }
  }, [position, inDesfasurare, allPins, hasRoute, cityCoords, map]);

  return null;
}

const Harta = ({ traseu, currentStep = 0, inDesfasurare = false, cityCoords = null }) => {
  const centrulClujului = [46.7712, 23.5900];
  let lastValidCoords = null; 
  
  const markerRefs = useRef([]);

  const pins = traseu?.places && traseu.places.length > 0
    ? traseu.places.map((place, index) => {
        const rawLat = place.lat || place.latitudine || place.latitude;
        const rawLng = place.lng || place.longitudine || place.longitude;
        const lat = parseCoord(rawLat);
        const lng = parseCoord(rawLng);

        let coords;
        if (lat !== null && lng !== null) {
          coords = [lat, lng];
          lastValidCoords = coords;
        } else {
          const baseLat = cityCoords ? cityCoords[0] : centrulClujului[0];
          const baseLng = cityCoords ? cityCoords[1] : centrulClujului[1];
          coords = [
            baseLat + (index * 0.008),
            baseLng + (index * 0.008)
          ];
        }

        return {
          id: index,
          name: typeof place === 'string' ? place : (place.nume_locatie || place.nume || 'Atracție'),
          coords: coords,
          descriere: typeof place === 'string' ? 'Locație din itinerariu' : (place.descriere || ''),
          tip: place.tip || 'Atracție'
        };
      })
    : []; 

  const hasRoute = pins.length > 0;
  
  let focusPosition = cityCoords || centrulClujului;
  if (hasRoute && inDesfasurare) {
    focusPosition = pins[currentStep]?.coords || cityCoords || centrulClujului;
  }

  useEffect(() => {
    if (inDesfasurare && markerRefs.current[currentStep]) {
      setTimeout(() => {
        if(markerRefs.current[currentStep]) {
          markerRefs.current[currentStep].openPopup();
        }
      }, 1500); 
    }
  }, [currentStep, inDesfasurare]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl">
      <MapContainer
        center={centrulClujului} 
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0" 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap 
          position={focusPosition} 
          inDesfasurare={inDesfasurare}
          allPins={pins}
          hasRoute={hasRoute}
          cityCoords={cityCoords}
        />

        {hasRoute && pins.map((pin, index) => (
          <Marker 
            key={pin.id} 
            position={pin.coords}
            ref={(ref) => markerRefs.current[index] = ref}
          >
            <Popup>
              <div className="text-sm font-semibold text-slate-900 min-w-[150px]">
                <p className="font-bold text-base">{pin.name}</p>
                {pin.descriere && <p className="text-slate-600 text-xs mt-1">{pin.descriere}</p>}
                <p className="text-blue-600 text-xs font-semibold mt-2 border-t pt-2">
                  Tip: <span className="capitalize">{pin.tip}</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Harta;