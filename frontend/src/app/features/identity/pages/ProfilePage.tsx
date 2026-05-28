import {
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Settings,
  GridOn,
  Favorite,
  Share,
  FavoriteBorder,
  PlaceOutlined,
  CheckCircle,
  HourglassTopRounded,
  CancelOutlined,
} from "@mui/icons-material";
import { useState } from "react";

// Import Types từ index.ts và Mock Data từ mock-data.ts
import { User, Video } from "../../../types";
import { mockUserProfile } from "../../content/mock-data";
import { useNavigate } from "react-router-dom";

// =========================================================================
// 1. HELPER: Định nghĩa màu sắc và icon cho từng status kiểm duyệt
// =========================================================================
const STATUS_CONFIG = {
  approved: {
    color: "#4ade80",
    label: "Đã duyệt",
    Icon: CheckCircle,
  },
  pending: {
    color: "#fbbf24",
    label: "Đang duyệt",
    Icon: HourglassTopRounded,
  },
  rejected: {
    color: "#f87171",
    label: "Bị từ chối",
    Icon: CancelOutlined,
  },
};

const ROLE_LABEL: Record<string, string> = {
  reviewer: "Reviewer",
  merchant: "Merchant",
  admin: "Admin",
};

function formatLikes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// =========================================================================
// 2. SUB-COMPONENT: Ô video trong lưới Tab 1
// =========================================================================
function VideoGridCard({ video }: { video: Video }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const cfg = STATUS_CONFIG[video.status] || STATUS_CONFIG.pending;

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("/videos", { state: { focusVideoId: video.id } })}
      sx={{
        position: "relative",
        paddingTop: "133%", // Tỉ lệ 3:4 giống short-form video
        cursor: "pointer",
        borderRadius: "6px",
        overflow: "hidden",
        bgcolor: "#1e1e1e",
      }}
    >
      {/* Ảnh thumbnail */}
      <Box
        component="img"
        src={video.thumbnail_url || ""}
        alt={video.title}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* Overlay tối khi hover */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: hovered ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
          transition: "background-color 0.25s ease",
        }}
      />

      {/* Chấm màu trạng thái kiểm duyệt */}
      <Box
        sx={{
          position: "absolute",
          top: 7,
          right: 7,
          width: 9,
          height: 9,
          borderRadius: "50%",
          bgcolor: cfg.color,
          border: "1.5px solid rgba(0,0,0,0.5)",
          boxShadow: `0 0 5px ${cfg.color}88`,
        }}
      />

      {/* Lượt thích + tên quán khi hover */}
      <Stack
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          position: "absolute",
          inset: 0,
          p: 1,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mb: 0.5 }}>
          <Favorite sx={{ fontSize: 13, color: "#ff6b35" }} />
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
            {formatLikes(video.likes_count)}
          </Typography>
        </Stack>
        {video.tagged_merchant && (
          <Typography
            sx={{
              fontSize: 10,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              lineHeight: 1.3,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {video.tagged_merchant.name}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

// =========================================================================
// 3. SUB-COMPONENT: Hàng video trong Tab 2 (Đã thích)
// =========================================================================
function LikedVideoRow({ video }: { video: Video }) {
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      onClick={() => navigate("/videos", { state: { focusVideoId: video.id } })}
      sx={{
        p: 1.25,
        borderRadius: "10px",
        bgcolor: "#1a1a1a",
        border: "1px solid #2a2a2a",
        cursor: "pointer",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "#ff6b3560" },
      }}
    >
      {/* Thumbnail nhỏ */}
      <Box
        component="img"
        src={video.thumbnail_url || ""}
        alt={video.title}
        sx={{
          width: 58,
          height: 78,
          borderRadius: "6px",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Tiêu đề video */}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.4,
            mb: 0.75,
          }}
        >
          {video.title}
        </Typography>

        {/* Tên quán */}
        {video.tagged_merchant && (
          <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mb: 0.6 }}>
            <PlaceOutlined sx={{ fontSize: 12, color: "#ff6b35" }} />
            <Typography sx={{ fontSize: 11, color: "#8892b0" }}>
              {video.tagged_merchant.name}
            </Typography>
          </Stack>
        )}

        {/* Lượt thích */}
        <Stack direction="row" alignItems="center" spacing={0.4}>
          <FavoriteBorder sx={{ fontSize: 12, color: "#ff6b35" }} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#ff6b35" }}>
            {formatLikes(video.likes_count)} thích
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

// =========================================================================
// 4. COMPONENT CHÍNH: ProfilePage
// =========================================================================
export default function ProfilePage() {
  const [currentTab, setCurrentTab] = useState(0);
  const profile: User = mockUserProfile;

  // Xử lý chuỗi handle an toàn từ full_name từ backend
  const userHandle = profile.full_name
    ? profile.full_name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
    : "user";

  const userInitial = profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "?";

  // Tính tổng lượt tim an toàn từ danh sách video
  const totalLikes = (profile.videos || []).reduce((sum, v) => sum + v.likes_count, 0);

  return (
    <Box
      sx={{
        maxWidth: 680, // Giữ nguyên kích thước to theo yêu cầu trước
        mx: "auto",
        pb: 4,
        bgcolor: "#121212",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      {/* ── COVER ── */}
      <Box
        sx={{
          height: 160,
          background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 45%, #ea580c 75%, #fed7aa 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.15) 0%, transparent 50%)",
          }}
        />
      </Box>

      {/* ── AVATAR + NÚT ACTION ── */}
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
        sx={{
          px: 2.5,
          mt: "-48px", // Vị trí đè cover chuẩn xác của avatar cỡ 96
          position: "relative",
          zIndex: 2,
        }}
      >
        <Avatar
          src={profile.avatar_url || ""}
          sx={{
            width: 96, // Kích thước avatar to đã sửa đổi trước đó
            height: 96,
            bgcolor: "#c2410c",
            fontSize: 36,
            fontWeight: 700,
            border: "3px solid #121212",
          }}
        >
          {userInitial}
        </Avatar>

        <Stack direction="row" spacing={1} sx={{ pb: 0.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Share sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: "none",
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              borderColor: "#3a3a3a",
              borderRadius: "8px",
              px: 1.5,
              "&:hover": { borderColor: "#ff6b35", bgcolor: "#1e1e1e" },
            }}
          >
            Chia sẻ
          </Button>
          <IconButton
            size="small"
            sx={{
              color: "#fff",
              border: "1px solid #3a3a3a",
              borderRadius: "8px",
              "&:hover": { borderColor: "#ff6b35", bgcolor: "#1e1e1e" },
            }}
          >
            <Settings fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {/* ── THÔNG TIN CÁ NHÂN ── */}
      <Box sx={{ px: 2.5, pt: 1.25 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            {profile.full_name}
          </Typography>
          <Chip
            label={ROLE_LABEL[profile.role] || "Reviewer"}
            size="small"
            sx={{
              height: 20,
              fontSize: 10,
              fontWeight: 700,
              bgcolor: "#431407",
              color: "#fb923c",
              border: "1px solid #7c2d12",
              borderRadius: "6px",
            }}
          />
        </Stack>

        <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1.25 }}>
          @{userHandle} · Ho Chi Minh City
        </Typography>

        <Typography sx={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.6, mb: 1.5 }}>
          🎥 Chuyên săn lùng các món ăn đường phố ngon - bổ - rẻ
          <br />
          Review thật lòng, không PR.
        </Typography>

        {/* Nút chỉnh sửa */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            color: "#fff",
            borderColor: "#3a3a3a",
            borderRadius: "10px",
            mb: 2,
            "&:hover": { borderColor: "#ff6b35", bgcolor: "#1e1e1e" },
          }}
        >
          Chỉnh sửa trang cá nhân
        </Button>

        {/* ── THỐNG KÊ: số video + tổng lượt thích ── */}
        <Stack
          direction="row"
          divider={<Box sx={{ width: "1px", bgcolor: "#2a2a2a", alignSelf: "stretch" }} />}
          sx={{
            bgcolor: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #2a2a2a",
            mb: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ flex: 1, py: 1.5, textAlign: "center" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              {profile.videos ? profile.videos.length : 0}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#6b7280", mt: 0.25 }}>Video</Typography>
          </Box>
          <Box sx={{ flex: 1, py: 1.5, textAlign: "center" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              {profile.liked_videos ? profile.liked_videos.length : 0}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#6b7280", mt: 0.25 }}>Đã thích</Typography>
          </Box>
          <Box sx={{ flex: 1, py: 1.5, textAlign: "center" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#ff6b35" }}>
              {formatLikes(totalLikes)}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#6b7280", mt: 0.25 }}>Lượt tim</Typography>
          </Box>
        </Stack>
      </Box>

      {/* ── TABS ── */}
      <Box sx={{ borderBottom: "1px solid #2a2a2a", px: 0 }}>
        <Tabs
          value={currentTab}
          onChange={(_, v) => setCurrentTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              color: "#6b7280",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "none",
              minHeight: 44,
              gap: "6px",
            },
            "& .Mui-selected": { color: "#ff6b35 !important" },
            "& .MuiTabs-indicator": { bgcolor: "#ff6b35", height: 2 },
          }}
        >
          <Tab icon={<GridOn sx={{ fontSize: 16 }} />} iconPosition="start" label="Video của tôi" />
          <Tab icon={<Favorite sx={{ fontSize: 16 }} />} iconPosition="start" label="Đã thích" />
        </Tabs>
      </Box>

      {/* ── TAB 1: Lưới video đã đăng ── */}
      {currentTab === 0 && (
        <Box sx={{ p: 1.5 }}>
          {profile.videos && profile.videos.length > 0 ? (
            <Grid container spacing={0.5}>
              {profile.videos.map((video) => (
                <Grid size={{ xs: 4 }} key={video.id}>
                  <VideoGridCard video={video} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <GridOn sx={{ fontSize: 48, color: "#2a2a2a", mb: 1.5 }} />
              <Typography sx={{ color: "#6b7280", fontSize: 14 }}>
                Chưa có video nào được đăng
              </Typography>
            </Box>
          )}

          {/* Chú thích trạng thái kiểm duyệt */}
          <Stack direction="row" spacing={2} sx={{ mt: 1.5, px: 0.5 }}>
            {(Object.entries(STATUS_CONFIG) as [Video["status"], typeof STATUS_CONFIG["approved"]][]).map(
              ([key, cfg]) => (
                <Stack key={key} direction="row" alignItems="center" spacing={0.5}>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: cfg.color,
                    }}
                  />
                  <Typography sx={{ fontSize: 10, color: "#6b7280" }}>{cfg.label}</Typography>
                </Stack>
              )
            )}
          </Stack>
        </Box>
      )}

      {/* ── TAB 2: Danh sách video đã thích ── */}
      {currentTab === 1 && (
        <Stack spacing={1} sx={{ p: 1.5 }}>
          {profile.liked_videos && profile.liked_videos.length > 0 ? (
            profile.liked_videos.map((video) => (
              <LikedVideoRow key={video.id} video={video} />
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <FavoriteBorder sx={{ fontSize: 48, color: "#2a2a2a", mb: 1.5 }} />
              <Typography sx={{ color: "#6b7280", fontSize: 14 }}>
                Chưa thích video nào
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
}