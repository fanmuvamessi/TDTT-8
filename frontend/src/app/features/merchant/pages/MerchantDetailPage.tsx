// src/app/features/merchant/pages/MerchantDetailPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Card, CardMedia, CardContent, Divider, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack, LocationOn, Star, DirectionsRun } from "@mui/icons-material";
import { mockHomeMerchants } from "../../content/mock-data"; // Đảm bảo đường dẫn đúng

export default function MerchantDetailPage() {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  // Tìm quán ăn khớp với ID từ URL
  const merchant = mockHomeMerchants.find((m) => m.id === id);

  // Xử lý trường hợp không tìm thấy quán
  if (!merchant) {
    return (
      <Box sx={{ bgcolor: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <Typography>Không tìm thấy quán ăn!</Typography>
      </Box>
    );
  }

  // Hàm xử lý khi click vào địa chỉ chuyển hướng sang trang bản đồ (MapPage) kèm theo tọa độ quán
  const handleAddressClick = () => {
    // Điều hướng về trang map (đường dẫn tùy thuộc vào Router của bạn, thường là "/map" hoặc "/discovery")
    // Đồng thời truyền tọa độ lat, lng qua state để bản đồ tự động focus vào quán
    navigate("/map", { state: { lat: merchant.lat, lng: merchant.lng, name: merchant.name } });
  };

  return (
    <Box sx={{ bgcolor: "#000", minHeight: "100vh", color: "#fff", pb: 4 }}>
      {/* 1. Phần ảnh bìa */}
      <Box sx={{ position: "relative", height: 280, width: "100%" }}>
        <CardMedia component="img" image={merchant.coverImageUrl} sx={{ height: "100%", objectFit: "cover" }} />
        
        <IconButton onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, color: "white", bgcolor: "rgba(0,0,0,0.3)" }}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h4" sx={{ position: "absolute", bottom: 16, left: 16, fontWeight: 900, fontSize: { xs: '1.8rem', sm: '2.5rem' }, textShadow: "2px 2px 8px rgba(0,0,0,1)", color: "#fff" }}>
          {merchant.name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ position: "absolute", bottom: 16, right: 16, bgcolor: "rgba(0,0,0,0.6)", px: 1.5, py: 0.5, borderRadius: 2 }}>
          <Star sx={{ color: "#ffb703", fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700 }}>{merchant.rating_avg}</Typography>
        </Stack>
      </Box>

      {/* 2. Thông tin chi tiết */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={1}>
          {/* Thêm onClick và cursor: "pointer" để bấm vào địa chỉ, giữ nguyên layout style ban đầu */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1} 
            onClick={handleAddressClick}
            sx={{ 
              color: "#aaa", 
              cursor: "pointer",
              "&:hover": { color: "#fff" } // Thêm hiệu ứng hover nhẹ khi rê chuột vào để người dùng nhận biết bấm được
            }}
          >
            <LocationOn fontSize="small" />
            <Typography variant="body2">{merchant.address}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "#ff6b35" }}>
            <DirectionsRun fontSize="small" />
            <Typography variant="body2" fontWeight={600}>{merchant.distance}</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3, borderColor: "#222" }} />

        {/* 3. List Menu */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Thực đơn</Typography>
        <Stack spacing={2}>
          {merchant.menu && merchant.menu.length > 0 ? (
            merchant.menu.map((item) => (
              <Card key={item.id} sx={{ display: "flex", bgcolor: "#111", borderRadius: 3, border: "1px solid #222" }}>
                <CardMedia component="img" image={item.imageUrl} sx={{ width: 80, height: 80 }} />
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600} color="#fff">{item.name}</Typography>
                  <Typography variant="body2" color="#ff6b35" fontWeight={700}>{item.price.toLocaleString()}đ</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#666" }}>Chưa có thực đơn.</Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}