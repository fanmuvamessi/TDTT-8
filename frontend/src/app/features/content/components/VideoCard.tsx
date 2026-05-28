import React, { useState } from "react";
import { Box, Typography, IconButton, Avatar, Stack } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  BookmarkBorder,
  PlayArrow,
} from "@mui/icons-material";
import { Video } from "../../../types"; // Thay đổi kiểu dữ liệu tương thích
import { useNavigate } from "react-router-dom";
import { mockUserReviewer } from "../mock-data";

interface VideoCardProps {
  video: Video;
  isLiked: boolean;
  playingVideoId: number | null; // Đổi sang number | null
  isMuted: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  onVideoClick: (id: number) => void;      // Đổi sang number
  onToggleLike: (id: number) => void;      // Đổi sang number
  onOpenComments: (id: number) => void;    // Đổi sang number
}

export default function VideoCard({ video, isLiked, playingVideoId, isMuted, videoRef, onVideoClick, onToggleLike, onOpenComments }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  
  const handleMerchantClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn video tạm dừng khi click vào tên quán
    if (video.tagged_merchant_id) {
      navigate(`/merchants/${video.tagged_merchant_id}`); // Điều hướng chuẩn theo ID số
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        scrollSnapAlign: "start",
        position: "relative",
        bgcolor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => {
        setIsPlaying(!isPlaying);
        onVideoClick(video.id);
      }}
    >
      {/* HIỂN THỊ VIDEO THỰC TẾ */}
      <Box
        component="video"
        ref={videoRef}
        src={video.video_url} // Khớp với trường dữ liệu backend
        muted={isMuted}
        loop
        playsInline
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* ICON PLAY GIẢ LẬP KHI TẠM DỪNG */}
      {playingVideoId !== video.id && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 2,
            bgcolor: "rgba(0,0,0,0.3)",
            borderRadius: "50%",
            p: 1,
            pointerEvents: "none",
          }}
        >
          <PlayArrow sx={{ fontSize: 50, color: "white" }} />
        </Box>
      )}

      {/* LAYOUT NỘI DUNG CHỮ */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 70,
          p: 3,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
          color: "white",
          zIndex: 3,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Avatar 
            src="" // Để trống hoặc map từ API sau
            sx={{ border: "2px solid white", width: 36, height: 36 }} 
          />
          <Box>
            {/* Tên người đăng: Màu Cam */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ff6b35" }}>
              {video.reviewer_id === mockUserReviewer.id ? mockUserReviewer.full_name : `Reviewer #${video.reviewer_id}`}
            </Typography>
            
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* Địa chỉ/Tên quán: Màu trắng nhẹ */}
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, cursor: "pointer", "&:hover": { color: "#fff", textDecoration: "underline" } }}
              onClick={handleMerchantClick}
              >
                {video.tagged_merchant?.name || "Chưa gắn thẻ địa điểm"}
              </Typography>
              
              {/* Điểm số & Sao: Màu Vàng */}
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255, 215, 0, 0.1)', px: 0.8, py: 0.2, borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: 700, mr: 0.3 }}>
                  4.5
                </Typography>
                <Typography variant="caption" sx={{ color: "#ffd700" }}>★</Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>

        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.4 }}>
          {video.title} - {video.description}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Typography
            variant="caption"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              px: 1.5,
              py: 0.5,
              borderRadius: 10,
              fontWeight: 600,
              backdropFilter: "blur(4px)",
            }}
          >
            #FoodReview
          </Typography>
        </Stack>
      </Box>

      {/* DÀN NÚT TƯƠNG TÁC */}
      <Stack
        spacing={2.5}
        alignItems="center"
        sx={{ position: "absolute", bottom: 40, right: 12, zIndex: 3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Stack alignItems="center" spacing={0.2}>
          <IconButton onClick={() => onToggleLike(video.id)} sx={{ bgcolor: isLiked ? "#ff6b35" : "rgba(255,255,255,0.15)", color: "white", width: 46, height: 46 }}>
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="caption" sx={{ color: "white", fontWeight: 700 }}>
            {/* Sử dụng chuẩn tên trường dữ liệu video.likes_count */}
            {isLiked ? video.likes_count + 1 : video.likes_count}
          </Typography>
        </Stack>

        <Stack alignItems="center" spacing={0.2}>
          <IconButton onClick={() => onOpenComments(video.id)} sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", width: 46, height: 46 }}>
            <ChatBubbleOutline />
          </IconButton>
          <Typography variant="caption" sx={{ color: "white", fontWeight: 700 }}>
            15
          </Typography>
        </Stack>

        <IconButton sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}><Share /></IconButton>
        <IconButton sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}><BookmarkBorder /></IconButton>
      </Stack>
    </Box>
  );
}