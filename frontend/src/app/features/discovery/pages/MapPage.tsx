import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Box, 
  TextField, 
  InputAdornment, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip,
  Slider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Search, LocationOn, DirectionsWalk, GpsFixed, Restaurant } from "@mui/icons-material"; 
import MapView from "../components/MapView";
import { filterShopsByRadius, calculateDistance, Shop } from "../discovery-services";

const MOCK_SHOPS: Shop[] = [
  { id: "1", name: "Quán ăn A", lat: 10.7769, lng: 106.7009 },
  { id: "2", name: "Coffee B", lat: 10.7800, lng: 106.7050 }
];

export default function MapPage() {
  const [radius, setRadius] = useState<number>(7);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Trạng thái kiểm soát việc ẩn/hiển thị bảng danh sách gợi ý
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Khởi tạo tâm mặc định ban đầu của bạn
  const [center, setCenter] = useState<[number, number]>([10.7769, 106.7009]);

  // Hàm lấy chính xác tọa độ GPS (High Accuracy) của thiết bị
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]); 
        },
        (error) => {
          console.error("Lỗi định vị:", error);
          alert("Không thể quét được GPS. Vui lòng bật Vị trí (Location) trên thiết bị và cho phép trình duyệt truy cập.");
        },
        {
          enableHighAccuracy: true, 
          timeout: 10000,           
          maximumAge: 0             
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ tính năng định vị.");
    }
  };

  // Danh sách quán ăn lọc theo bán kính (Dùng cho các Marker và List phía dưới)
  const filteredShops = useMemo(() => {
    return MOCK_SHOPS.filter(shop => 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      calculateDistance(center[0], center[1], shop.lat, shop.lng) <= radius
    );
  }, [radius, searchTerm, center]);

  // Danh sách các quán ăn gợi ý (Chỉ lọc theo từ khóa chữ gõ vào, không phụ thuộc bán kính để người dùng dễ tìm kiếm)
  const suggestedShops = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return MOCK_SHOPS.filter(shop => 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Đóng danh sách gợi ý khi người dùng nhấp chuột ra ngoài thanh tìm kiếm
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý khi người dùng chọn một quán ăn từ danh sách gợi ý
  const handleSelectShop = (shop: Shop) => {
    setSearchTerm(shop.name); // Điền tên quán vào thanh tìm kiếm
    setCenter([shop.lat, shop.lng]); // Đưa bản đồ bay tới quán được chọn
    setShowSuggestions(false); // Ẩn danh sách gợi ý đi
  };

  return (
    <Box 
      sx={{ 
        position: "relative", 
        width: "100%", 
        height: "calc(100vh - 56px)", 
        overflow: "hidden", 
        bgcolor: "#f8fafc",
        "& .leaflet-top.leaflet-left": {
          display: "none !important"
        }
      }}
    >
      
      {/* 1. MAP VIEW BACKGROUND */}
      <Box 
        sx={{ 
          width: "100%", 
          height: "100%", 
          position: "absolute", 
          top: 0, 
          left: 0, 
          zIndex: 1,
          "& .leaflet-container": { height: "100% !important", width: "100% !important" }
        }}
      >
        <MapView shops={filteredShops} center={center} radius={radius} />
      </Box>

      {/* 2. THANH TÌM KIẾM PHÍA TRÊN VÀ KHỐI GỢI Ý (Đã cập nhật) */}
      <Box 
        ref={searchRef}
        sx={{ 
          position: "absolute", 
          top: 12, 
          left: 0, 
          right: 0, 
          px: 2,
          pl: "120px", 
          zIndex: 1200, // Đẩy z-index cao hơn một chút để danh sách gợi ý đè lên trên các UI khác
        }}
      >
        <TextField
          fullWidth
          placeholder="Tìm quán ăn..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true); // Hiện gợi ý khi người dùng gõ phím
          }}
          onFocus={() => setShowSuggestions(true)} // Hiện gợi ý khi nhấp chuột vào ô input
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "rgba(255, 255, 255, 0.9)", 
              backdropFilter: "blur(8px)",
              color: "#0f172a",
              boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
              "& fieldset": { borderColor: "#e2e8f0" },
              "&:hover fieldset": { borderColor: "#cbd5e1" },
              "&.Mui-focused fieldset": { borderColor: "#ff6b35" }
            }
          }}
        />

        {/* BOX DANH SÁCH GỢI Ý - Xuất hiện ngay phía dưới thanh tìm kiếm khi có kết quả phù hợp */}
        {showSuggestions && suggestedShops.length > 0 && (
          <Box
            sx={{
              mt: 1,
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              borderRadius: 3,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              maxHeight: 240,
              overflowY: "auto",
              animation: "fadeIn 0.2s ease"
            }}
          >
            <List disablePadding>
              {suggestedShops.map((shop) => (
                <ListItemButton
                  key={shop.id}
                  onClick={() => handleSelectShop(shop)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: "1px solid #f1f5f9",
                    "&:last-child": { borderBottom: "none" },
                    "&:hover": {
                      bgcolor: "#fff7ed",
                      "& .MuiTypography-root": { color: "#ff6b35" }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Restaurant sx={{ color: "#ff6b35", fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={shop.name} 
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 700,
                      color: "#0f172a",
                      transition: "color 0.2s ease"
                    }}
                    secondary={`📍 Tọa độ: ${shop.lat.toFixed(3)}, ${shop.lng.toFixed(3)}`}
                    secondaryTypographyProps={{
                      variant: "caption",
                      color: "#64748b"
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
      </Box>

      {/* NÚT TÌM VỊ TRÍ HIỆN TẠI (GPS BUTTON) */}
      <IconButton
        onClick={handleGetLocation}
        sx={{
          position: "absolute",
          bottom: 90, 
          right: 65,
          zIndex: 1100,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: 3,
          p: 1.2,
          border: "1px solid #e2e8f0",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "#fff7ed",
            borderColor: "#ff6b35",
            "& .MuiSvgIcon-root": { color: "#ff6b35" }
          }
        }}
      >
        <GpsFixed sx={{ color: "#475569", fontSize: 20 }} />
      </IconButton>

      {/* 3. KHU VỰC ĐIỀU KHIỂN GÓC DƯỚI BÊN PHẢI */}
      <Box 
        sx={{ 
          position: "absolute", 
          bottom: 16, 
          right: 65, 
          zIndex: 1100,
          display: "flex",
          flexDirection: "row", 
          alignItems: "flex-end", 
          gap: 1.5,
          "& .leaflet-bottom.leaflet-right": {
            position: "static !important",
            margin: "0 !important"
          }
        }}
      >
        <Box 
          sx={{ 
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            px: 2,
            py: 1,
            boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            width: 180, 
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", fontSize: 11 }}>
              Bán kính:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#ff6b35", fontSize: 11 }}>
              {radius} km
            </Typography>
          </Stack>
          <Slider
            value={radius}
            min={1}
            max={30}
            step={1}
            onChange={(_e, newValue) => setRadius(newValue as number)}
            sx={{
              color: "#ff6b35",
              py: 0.5,
              "& .MuiSlider-thumb": { width: 12, height: 12 },
              "& .MuiSlider-rail": { opacity: 0.28, bgcolor: "#cbd5e1" },
            }}
          />
        </Box>
      </Box>

      {/* 4. DANH SÁCH CÁC QUÁN ĂN (BOTTOM LEFT) */}
      <Box 
        sx={{ 
          position: "absolute", 
          bottom: 16, 
          left: 16, 
          right: 280, 
          zIndex: 1100,
        }}
      >
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            overflowX: "auto", 
            pb: 0.5,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none"
          }}
        >
          {filteredShops.map((shop) => {
            const currentDistance = calculateDistance(center[0], center[1], shop.lat, shop.lng);
            return (
              <Card 
                key={shop.id}
                onClick={() => setCenter([shop.lat, shop.lng])} 
                sx={{ 
                  minWidth: 180, 
                  maxWidth: 180, 
                  borderRadius: 3, 
                  bgcolor: "rgba(255, 255, 255, 0.95)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease", 
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "#ff6b35"
                  }
                }}
              >
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
                      {shop.name}
                    </Typography>
                    <Chip 
                      icon={<DirectionsWalk sx={{ fontSize: "11px !important", color: "#ff6b35 !important" }} />}
                      label={`${currentDistance.toFixed(1)} km`} 
                      size="small"
                      sx={{ bgcolor: "#fff7ed", color: "#c2410c", fontWeight: 700, fontSize: 10, height: 18 }}
                    />
                  </Stack>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "flex", alignItems: "center", gap: 0.5, fontSize: 10 }}>
                    📍 {shop.lat.toFixed(3)}, {shop.lng.toFixed(3)}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>

    </Box>
  );
}