import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Khắc phục lỗi hiển thị icon marker của Leaflet trong môi trường Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ lat, lng, onLocationChange }) => {
  const initialPosition = useMemo(() => {
    const parsedLat = parseFloat(lat || '');
    const parsedLng = parseFloat(lng || '');
    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return null;
    return [parsedLat, parsedLng];
  }, [lat, lng]);

  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  useMapEvents({
    click(e) {
      const nextLat = e.latlng.lat.toFixed(6);
      const nextLng = e.latlng.lng.toFixed(6);
      setPosition([parseFloat(nextLat), parseFloat(nextLng)]);
      onLocationChange(nextLat, nextLng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const Recenter = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    const parsedLat = parseFloat(lat || '');
    const parsedLng = parseFloat(lng || '');
    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return;
    map.setView([parsedLat, parsedLng], map.getZoom());
  }, [lat, lng, map]);

  return null;
};

export default function MapPicker({ lat, lng, onChange }) {
  const defaultCenter = [10.8231, 106.6297]; // TP.HCM
  const center = (lat && lng) ? [parseFloat(lat), parseFloat(lng)] : defaultCenter;

  return (
    <div className="h-[350px] w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={lat} lng={lng} />
        <LocationMarker lat={lat} lng={lng} onLocationChange={onChange} />
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[1000] bg-white px-2 py-1 rounded shadow text-xs text-slate-500 font-medium">
        Nhấp vào bản đồ để chọn vị trí
      </div>
    </div>
  );
}