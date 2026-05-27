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
  Fastfood
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

const mockUserPosts = [
  { id: "p1", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", shopName: "Phở Thìn Lò Đúc", rating: 4.8 },
  { id: "p2", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", shopName: "Sushi Tony", rating: 4.5 },
  { id: "p3", image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400", shopName: "Bánh Mì Huỳnh Hoa", rating: 4.9 },
  { id: "p4", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400", shopName: "Lẩu Cá Kèo Bà Huyện", rating: 4.2 },
  { id: "p5", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400", shopName: "Pancakes & Cafe", rating: 4.0 },
  { id: "p6", image: "https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=400", shopName: "Bún Đậu Ngõ Nhỏ", rating: 4.6 },
  { id: "p7", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400", shopName: "Bếp Thái Koh Yam", rating: 4.4 },
  { id: "p8", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", shopName: "Cơm Tấm Phúc Lộc Thọ", rating: 4.3 },
  { id: "p9", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", shopName: "Steak House", rating: 4.7 },
];

const mockSavedPosts = [
  { id: "s1", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", shopName: "Pizza 4P's", rating: 4.8 },
  { id: "s2", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400", shopName: "Salad Garden", rating: 4.1 },
  { id: "s3", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400", shopName: "Dimsum Tiến Phát", rating: 4.6 },
  { id: "s4", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400", shopName: "BBQ Gogi House", rating: 4.5 },
];

export default function Profile() {
  const [currentTab, setCurrentTab] = useState(0);
  const { user } = useAuth();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const displayPosts = currentTab === 0 ? mockUserPosts : mockSavedPosts;

  const userName = user?.name || "User";
  const userHandle = userName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", pb: 2, bgcolor: "#121212", minHeight: "100vh", color: "#ffffff" }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Avatar
            src={user?.avatar}
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#ff6b35",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {userInitial}
          </Avatar>
          <IconButton sx={{ alignSelf: "flex-start", color: "#ffffff" }}>
            <Settings />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: "#ffffff" }}>
          {userName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#8892b0" }}>
          @{userHandle} • Foodie & Traveler
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: "#ffffff", lineHeight: 1.6 }}>
          🍜 Yêu ẩm thực Việt Nam
          <br />
          📍 Sài Gòn
          <br />
          🎥 Review quán ăn mỗi tuần
        </Typography>

        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff" }}>
              {mockUserPosts.length}
            </Typography>
            <Typography variant="body2" sx={{ color: "#8892b0" }}>
              Bài viết
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff" }}>
              8.5K
            </Typography>
            <Typography variant="body2" sx={{ color: "#8892b0" }}>
              Người theo dõi
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff" }}>
              342
            </Typography>
            <Typography variant="body2" sx={{ color: "#8892b0" }}>
              Đang theo dõi
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#ff6b35",
              "&:hover": { bgcolor: "#e55a2b" },
              textTransform: "none",
              fontWeight: 600,
              color: "#ffffff"
            }}
          >
            Chỉnh sửa trang cá nhân
          </Button>
          <Button
            variant="outlined"
            sx={{
              minWidth: 44,
              borderColor: "#2d2d2d",
              color: "#ffffff",
              "&:hover": { borderColor: "#ff6b35", bgcolor: "#1a1a1a" }
            }}
          >
            <Share />
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
          <Chip label="Phở" size="small" sx={{ bgcolor: "#2d2d2d", color: "#ffffff", fontWeight: 500 }} />
          <Chip label="Bún" size="small" sx={{ bgcolor: "#2d2d2d", color: "#ffffff", fontWeight: 500 }} />
          <Chip label="Street Food" size="small" sx={{ bgcolor: "#2d2d2d", color: "#ffffff", fontWeight: 500 }} />
          <Chip label="Cafe" size="small" sx={{ bgcolor: "#2d2d2d", color: "#ffffff", fontWeight: 500 }} />
        </Stack>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "#2d2d2d" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              color: "#ffffff",
            },
            "& .Mui-selected": {
              color: "#ff6b35 !important",
            },
            "& .MuiTabs-indicator": {
              bgcolor: "#ff6b35",
            },
          }}
        >
          <Tab icon={<GridOn />} label="Bài viết" />
          <Tab icon={<Bookmark />} label="Đã lưu" />
        </Tabs>
      </Box>

      <Box sx={{ p: 1 }}>
        <Grid container spacing={0.5}>
          {displayPosts.map((post) => (
            /* ĐSỬA: Sử dụng cấu trúc size={{ xs: 4 }} đúng quy định của MUI Grid v2 mới trên nền import Grid cũ */
            <Grid size={{ xs: 4 }} key={post.id}> 
              <Card 
                sx={{ 
                  position: "relative", 
                  paddingTop: "100%", 
                  cursor: "pointer", 
                  bgcolor: "#1e1e1e", 
                  border: "1px solid #2d2d2d",
                  borderRadius: 2,
                  overflow: "hidden",
                  "&:hover .post-overlay": {
                    bgcolor: "rgba(255, 107, 53, 0.45)",
                  },
                  "&:hover .post-info": {
                    opacity: 1,
                  }
                }}
              >
                <CardMedia
                  component="img"
                  image={post.image}
                  alt={post.shopName}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                
                <Box
                  className="post-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0,0,0,0)",
                    transition: "all 0.25s ease",
                  }}
                />

                <Stack
                  className="post-info"
                  justifyContent="center"
                  alignItems="center"
                  spacing={0.5}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    p: 1,
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    textAlign: "center"
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.2} sx={{ bgcolor: "#121212", px: 0.8, py: 0.3, borderRadius: 1.5 }}>
                    <Star sx={{ color: "#ff6b35", fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#ffffff" }}>
                      {post.rating.toFixed(1)}
                    </Typography>
                  </Stack>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 700, 
                      color: "#ffffff", 
                      fontSize: 11,
                      textShadow: "0px 2px 4px rgba(0,0,0,0.8)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {post.shopName}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {displayPosts.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Fastfood sx={{ fontSize: 64, color: "#2d2d2d", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#8892b0" }}>
              Chưa có bài viết nào
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}