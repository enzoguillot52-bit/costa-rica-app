import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PARKS, PARK_REGIONS } from "../../data/parks.js";

function markerIcon(park, active) {
  const r = PARK_REGIONS[park.region];
  const size = active ? 34 : 28;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${r.color};border:2px solid rgba(255,255,255,.9);
      display:flex;align-items:center;justify-content:center;
      font-size:${active ? 15 : 13}px;box-shadow:0 2px 8px rgba(0,0,0,.5);
    ">${park.emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function ParksMap({ selectedId, onSelect }) {
  const icons = useMemo(() => PARKS.map((p) => markerIcon(p, p.id === selectedId)), [selectedId]);

  return (
    <MapContainer
      center={[9.85, -84.3]}
      zoom={8}
      scrollWheelZoom={false}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#0A2E3D" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {PARKS.map((p, i) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={icons[i]} eventHandlers={{ click: () => onSelect(p) }}>
          <Popup>{p.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
