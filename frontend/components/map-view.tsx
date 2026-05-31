"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AlertCircle } from "lucide-react";

// Retrieve Mapbox token from environment variables
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
const hasValidToken = mapboxToken && mapboxToken.trim() !== "" && mapboxToken !== "your_mapbox_access_token_here";

if (hasValidToken) {
  mapboxgl.accessToken = mapboxToken;
}

interface MapViewProps {
  filteredRestaurants: any[];
  selectedRestaurant: any | null;
  onSelectRestaurant: (res: any) => void;
}

export function MapView({
  filteredRestaurants,
  selectedRestaurant,
  onSelectRestaurant
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const activePopupRef = useRef<mapboxgl.Popup | null>(null);
  const [tokenError, setTokenError] = useState(!hasValidToken);

  // Initialize Mapbox Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !hasValidToken) return;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [106.690, 10.775], // Ho Chi Minh City coordinates [lng, lat]
        zoom: 12,
        attributionControl: false
      });

      // Add standard zoom and navigation controls
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      mapRef.current = map;
    } catch (err) {
      console.error("Lỗi khi khởi tạo bản đồ Mapbox:", err);
      setTokenError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Markers when filteredRestaurants list changes
  useEffect(() => {
    if (!mapRef.current || !hasValidToken) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Render new markers
    filteredRestaurants.forEach((res) => {
      if (!res.lng || !res.lat) return;

      // Create a beautiful premium-looking custom marker element
      const el = document.createElement("div");
      el.className = "w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-md flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95";
      
      const dot = document.createElement("div");
      dot.className = "w-2 h-2 bg-white rounded-full animate-pulse";
      el.appendChild(dot);

      // Create Popup content string
      const createPopupContent = () => `
        <div style="padding: 4px; font-family: var(--font-sans), system-ui, sans-serif; max-width: 160px; color: #0f172a;">
          <h4 style="margin: 0 0 3px; font-size: 11px; font-weight: 800; line-height: 1.3;">${res.name}</h4>
          <p style="margin: 0 0 4px; font-size: 9px; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${res.address}</p>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700;">
            <span style="color: #f59e0b; display: flex; align-items: center;">★ ${res.rating}</span>
            <span style="color: #64748b; font-weight: 500;">(${res.reviews} đánh giá)</span>
          </div>
        </div>
      `;

      // Set up Mapbox Marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([res.lng, res.lat])
        .addTo(map);

      // Marker click event to handle both sidebar selection and map panning/popup display
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRestaurant(res);

        // Smooth panning animation
        map.easeTo({
          center: [res.lng, res.lat],
          zoom: 15,
          duration: 800
        });

        // Close any active popup
        if (activePopupRef.current) {
          activePopupRef.current.remove();
        }

        // Open new popup
        const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
          .setLngLat([res.lng, res.lat])
          .setHTML(createPopupContent())
          .addTo(map);

        activePopupRef.current = popup;
      });

      markersRef.current.push(marker);
    });
  }, [filteredRestaurants, onSelectRestaurant]);

  // Recenter map smoothly and update popup when a restaurant is selected from the sidebar
  useEffect(() => {
    if (!mapRef.current || !selectedRestaurant || !hasValidToken) return;

    const map = mapRef.current;

    // Center map smoothly
    map.easeTo({
      center: [selectedRestaurant.lng, selectedRestaurant.lat],
      zoom: 15,
      duration: 1000
    });

    // Automatically trigger and display Popup for the selected restaurant
    if (activePopupRef.current) {
      activePopupRef.current.remove();
    }

    const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
      .setLngLat([selectedRestaurant.lng, selectedRestaurant.lat])
      .setHTML(`
        <div style="padding: 4px; font-family: var(--font-sans), system-ui, sans-serif; max-width: 160px; color: #0f172a;">
          <h4 style="margin: 0 0 3px; font-size: 11px; font-weight: 800; line-height: 1.3;">${selectedRestaurant.name}</h4>
          <p style="margin: 0 0 4px; font-size: 9px; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${selectedRestaurant.address}</p>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700;">
            <span style="color: #f59e0b; display: flex; align-items: center;">★ ${selectedRestaurant.rating}</span>
            <span style="color: #64748b; font-weight: 500;">(${selectedRestaurant.reviews} đánh giá)</span>
          </div>
        </div>
      `)
      .addTo(map);

    activePopupRef.current = popup;
  }, [selectedRestaurant]);

  if (tokenError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20 p-6 z-0">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground">Yêu cầu cấu hình Mapbox</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vui lòng cập nhật biến môi trường <code className="bg-secondary px-1.5 py-0.5 rounded font-mono text-[10px] text-primary">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> với khóa truy cập Mapbox hợp lệ trong tệp <code className="bg-secondary px-1.5 py-0.5 rounded font-mono text-[10px] text-primary">.env.local</code> (hoặc <code className="bg-secondary px-1.5 py-0.5 rounded font-mono text-[10px] text-primary">.env</code>) ở thư mục frontend, sau đó khởi động lại máy chủ phát triển.
            </p>
          </div>
          <div className="pt-3 text-[10px] text-muted-foreground/60 border-t border-border">
            Bạn có thể đăng ký tài khoản miễn phí tại <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">mapbox.com</a> để nhận Access Token.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainerRef} className="h-full w-full z-0 bg-muted/10" />
  );
}

