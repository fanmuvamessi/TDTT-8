import {
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Tabs,
  Tab,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Settings,
  Bookmark,
  GridOn,
  Share,
  Star,
  Fastfood,
  Verified,
} from "@mui/icons-material";
import { useState } from "react";

// =========================================================================
// 1. ĐỊNH NGHĨA INTERFACES (CẤU TRÚC DỮ LIỆU KHỚP 100% VỚI BACKEND)
// =========================================================================
interface TaggedMerchant {
  id: number;
  name: string; // Tên quán ăn từ bảng Merchant
}

interface VideoItem {
  id: number;
  title: string;          // Tiêu đề video ngắn
  video_url: string;      // Đường dẫn video (.mp4)
  thumbnail_url: string;  // Ảnh đại diện Video (Hiển thị ở ô lưới Grid)
  status: string;         // Trạng thái kiểm duyệt (pending, approved)
  likes_count: number;    // Số lượng Tim (Hiển thị khi hover chuột)
  tagged_merchant: TaggedMerchant | null; // Quán ăn được gắn thẻ (bảng Merchant)
}

interface UserProfileMock {
  id: number;
  firebase_uid: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string; // reviewer, merchant, admin
  videos: VideoItem[];    // Mối quan hệ relationship("Video") -> Tab 1
  liked_videos: VideoItem[]; // Dữ liệu gom từ bảng trung gian relationship("Like") -> Tab 2
}

// =========================================================================
// 2. TẠO MOCK DATA GIẢ LẬP THEO CHUẨN BACKEND ĐỂ CHẠY THỬ
// =========================================================================
const mockBackendProfile: UserProfileMock = {
  id: 1,
  firebase_uid: "fb-user-12345",
  email: "reviewer.foodsaigon@gmail.com",
  full_name: "Thành Đạt Food Review",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  role: "reviewer",
  // Tab 1: Danh sách video tự đăng (Ứng với trường videos của User)
  videos: [
    {
      id: 101,
      title: "Phở Thìn Lò Đúc có thực sự ngon như lời đồn?",
      video_url: "https://example.com/video1.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
      status: "approved",
      likes_count: 1420,
      tagged_merchant: { id: 1, name: "Phở Thìn Lò Đúc" }
    },
    {
      id: 102,
      title: "Trải nghiệm Sushi chuẩn Nhật ngay giữa lòng Sài Gòn",
      video_url: "https://example.com/video2.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
      status: "approved",
      likes_count: 850,
      tagged_merchant: { id: 2, name: "Sushi Tony" }
    },
    {
      id: 103,
      title: "Xếp hàng 1 tiếng mua Bánh Mì Huỳnh Hoa và cái kết",
      video_url: "https://example.com/video3.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400",
      status: "approved",
      likes_count: 3200,
      tagged_merchant: { id: 3, name: "Bánh Mì Huỳnh Hoa" }
    },
    {
      id: 104,
      title: "Lẩu cá kèo miền Tây ăn là ghiền",
      video_url: "https://example.com/video4.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
      status: "approved",
      likes_count: 640,
      tagged_merchant: { id: 4, name: "Lẩu Cá Kèo Bà Huyện" }
    }
  ],
  // Tab 2: Danh sách video đã thích (Lấy thông tin Video thông qua bảng trung gian Like)
  liked_videos: [
    {
      id: 201,
      title: "Thử thách ăn hết menu Pizza 4P's",
      video_url: "https://example.com/video5.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      status: "approved",
      likes_count: 9800,
      tagged_merchant: { id: 5, name: "Pizza 4P's - Bến Thành" }
    },
    {
      id: 202,
      title: "Quán salad siêu ngon cho hội ăn kiêng",
      video_url: "https://example.com/video6.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
      status: "approved",
      likes_count: 450,
      tagged_merchant: { id: 6, name: "Salad Garden" }
    }
  ]
};

export default function Profile() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Chọn mảng video tương ứng tùy theo Tab người dùng bấm vào
  const displayVideos = currentTab === 0 ? mockBackendProfile.videos : mockBackendProfile.liked_videos;

  // Xử lý tạo username tự động dựa theo full_name từ DB
  const userHandle = mockBackendProfile.full_name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
    
  const userInitial = mockBackendProfile.full_name.charAt(0).toUpperCase();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", pb: 2, bgcolor: "#121212", minHeight: "100vh", color: "#ffffff" }}>
      {/* PHẦN THÔNG TIN CÁ NHÂN */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Avatar
            src={mockBackendProfile.avatar_url} // Lấy cột avatar_url từ bảng User
            sx={{ width: 80, height: 80, bgcolor: "#ff6b35", fontSize: 32, fontWeight: 700 }}
          >
            {userInitial}
          </Avatar>
          <IconButton sx={{ alignSelf: "flex-start", color: "#ffffff" }}>
            <Settings />
          </IconButton>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff" }}>
            {mockBackendProfile.full_name} {/* Lấy cột full_name từ bảng User */}
          </Typography>
          {mockBackendProfile.role === "reviewer" && (
            <Verified sx={{ color: "#ff6b35", fontSize: 18 }} />
          )}
        </Stack>
        
        <Typography variant="body2" sx={{ mb: 2, color: "#8892b0" }}>
          @{userHandle} • Foodie & Reviewer
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: "#ffffff", lineHeight: 1.6 }}>
          🎥 Chuyên săn lùng các món ăn đường phố ngon - bổ - rẻ
          <br />
          📍 Hoạt động tại Sài Gòn
        </Typography>

        {/* PHẦN THỐNG KÊ SỐ LƯỢNG (Dựa theo độ dài mảng dữ liệu quan hệ) */}
        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff" }}>
              {mockBackendProfile.videos.length} {/* Tổng số Video tự đăng */}
            </Typography>
            <Typography variant="body2" sx={{ color: "#8892b0" }}>
              Bài viết
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff" }}>
              {mockBackendProfile.liked_videos.length} {/* Tổng số Video đã thích */}
            </Typography>
            <Typography variant="body2" sx={{ color: "#8892b0" }}>
              Đã thích
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Button variant="contained" fullWidth sx={{ bgcolor: "#ff6b35", "&:hover": { bgcolor: "#e55a2b" }, textTransform: "none", fontWeight: 600, color: "#ffffff" }}>
            Chỉnh sửa trang cá nhân
          </Button>
          <Button variant="outlined" sx={{ minWidth: 44, borderColor: "#2d2d2d", color: "#ffffff", "&:hover": { borderColor: "#ff6b35", bgcolor: "#1a1a1a" } }}>
            <Share />
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
          <Chip label="Ẩm thực Việt" size="small" sx={{ bgcolor: "#2d2d2d", color: "#ffffff", fontWeight: 500 }} />
          <Chip label="Review" size="small" sx={{ bgcolor: "#2d2d2d", color: "#ffffff", fontWeight: 500 }} />
        </Stack>
      </Box>

      {/* THANH TABS CHUYỂN ĐỔI NỘI DUNG */}
      <Box sx={{ borderBottom: 1, borderColor: "#2d2d2d" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": { color: "#ffffff" },
            "& .Mui-selected": { color: "#ff6b35 !important" },
            "& .MuiTabs-indicator": { bgcolor: "#ff6b35" },
          }}
        >
          <Tab icon={<GridOn />} label="Bài viết" />
          <Tab icon={<Bookmark />} label="Đã thích" />
        </Tabs>
      </Box>

      {/* Ô LƯỚI GRID HIỂN THỊ HÌNH ẢNH VIDEO NGẮN */}
      <Box sx={{ p: 1 }}>
        {displayVideos.length > 0 ? (
          <Grid container spacing={0.5}>
            {displayVideos.map((video) => (
              <Grid size={{ xs: 4 }} key={video.id}> 
                <Card 
                  sx={{ 
                    position: "relative", 
                    paddingTop: "100%", 
                    cursor: "pointer", 
                    bgcolor: "#1e1e1e", 
                    border: "1px solid #2d2d2d",
                    borderRadius: 2,
                    overflow: "hidden",
                    "&:hover .post-overlay": { bgcolor: "rgba(255, 107, 53, 0.45)" },
                    "&:hover .post-info": { opacity: 1 }
                  }}
                >
                  <CardMedia
                    component="img"
                    image={video.thumbnail_url} // Trích xuất trường thumbnail_url từ bảng Video
                    alt={video.title}
                    sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  
                  <Box className="post-overlay" sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(0,0,0,0)", transition: "all 0.25s ease" }} />

                  {/* PHẦN HIỂN THỊ THÔNG TIN KHI DI CHUỘT VÀO (HOVER) */}
                  <Stack className="post-info" justifyContent="center" alignItems="center" spacing={0.5} sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, p: 1, opacity: 0, transition: "opacity 0.2s ease", textAlign: "center" }}>
                    <Stack direction="row" alignItems="center" spacing={0.2} sx={{ bgcolor: "#121212", px: 0.8, py: 0.3, borderRadius: 1.5 }}>
                      <Star sx={{ color: "#ff6b35", fontSize: 14 }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "#ffffff" }}>
                        {video.likes_count >= 1000 ? `${(video.likes_count/1000).toFixed(1)}k` : video.likes_count} Tim {/* Số lượng likes_count từ bảng Video */}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#ffffff", fontSize: 11, textShadow: "0px 2px 4px rgba(0,0,0,0.8)", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {video.tagged_merchant?.name || "Chưa gắn vị trí"} {/* Tên nhà hàng lấy từ mối quan hệ tagged_merchant */}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Fastfood sx={{ fontSize: 64, color: "#2d2d2d", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#8892b0" }}>
              Chưa có nội dung hiển thị
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}