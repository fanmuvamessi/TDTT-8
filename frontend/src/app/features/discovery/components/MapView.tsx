import { useEffect } from 'react'; // Import useEffect từ react để theo dõi thay đổi tọa độ
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { Shop } from '../discovery-services';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface MapViewProps {
  shops: Shop[];
  center: [number, number];
  radius: number;
}

// Cải tiến: Đồng bộ camera mượt mà bằng hiệu ứng lướt lướt (flyTo) khi tọa độ GPS thay đổi
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    // flyTo giúp góc nhìn lướt mượt mà tới vị trí GPS thực tế vừa quét được
    map.flyTo(center, 15, {
      animate: true,
      duration: 1.5 
    });
  }, [center, map]);

  return null;
}

export default function MapView({ shops, center, radius }: MapViewProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%" }}
      zoomControl={false} // Ẩn mặc định để dùng ZoomControl góc dưới phải của bạn
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ZoomControl position="bottomright" />
      <RecenterMap center={center} />

      {/* Vòng tròn bán kính bao quanh tọa độ GPS người dùng */}
      <Circle 
        center={center} 
        radius={Number(radius) * 1000} // Ép kiểu số an toàn với TypeScript toán tử số học
        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
      />

      {/* Marker đánh dấu chính xác vị trí thực tế của người dùng */}
      <Marker position={center}>
        <Popup>Vị trí ghim tìm kiếm hiện tại của bạn</Popup>
      </Marker>

      {/* Vòng lặp kết xuất tập hợp các tọa độ ghim (Marker) của các quán ăn gần sát vách */}
      {shops.map((shop) => (
        <Marker key={shop.id} position={[shop.lat, shop.lng]}>
          <Popup>
            <div style={{ fontFamily: 'sans-serif' }}>
              <strong style={{ color: '#ff6b35', fontSize: '13px' }}>{shop.name}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b' }}>
                Tọa độ: {shop.lat.toFixed(4)}, {shop.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}