import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { VolumeUp, VolumeOff } from "@mui/icons-material";
import CommentSection from "../components/CommentSection";
import VideoCard from "../components/VideoCard";
import { ContentServices } from "../content-services";
import { Video } from "../../../types"; // Thay đổi kiểu dữ liệu tương thích
import { useLocation } from "react-router-dom";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]); // Đổi sang cấu trúc Video mới
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null); // Đổi string -> number
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());   // Đổi string -> number
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null); // Đổi string -> number
  const [isMuted, setIsMuted] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({}); // Đổi string -> number
  const location = useLocation();
  const state = location.state as { focusVideoId?: number } | null;

  useEffect(() => {
    ContentServices.getShortVideos().then((data) => {
      const typedData = data as unknown as Video[];
      setVideos(typedData);
      if (typedData.length > 0) {
        // Kiểm tra xem có ID truyền từ Profile sang không, nếu không có mới lấy ID đầu tiên
        const targetId = state?.focusVideoId || typedData[0].id;
        setTimeout(() => handleScrollOrLoad(targetId), 100);
        // Đoạn code hỗ trợ cuộn màn hình container đến phần tử video được chọn
        if (state?.focusVideoId) {
          setTimeout(() => {
            const index = typedData.findIndex(v => v.id === state.focusVideoId);
            if (index !== -1 && containerRef.current) {
              containerRef.current.scrollTop = index * containerRef.current.clientHeight;
            }
          }, 150);
        }
      }
    });

    // Cleanup khi component bị unmount
    return () => {
      videoRefs.current = {};
    };
  }, [state?.focusVideoId]);

  const handleScrollOrLoad = (targetId: number) => { // Đổi sang number
    Object.keys(videoRefs.current).forEach((id) => {
      const vid = videoRefs.current[Number(id)];
      if (vid) {
        if (Number(id) === targetId) {
          vid.muted = isMuted;
          vid.play().then(() => setPlayingVideoId(targetId)).catch(() => {});
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      }
    });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const activeIndex = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
    const currentVideo = videos[activeIndex];
    if (currentVideo && playingVideoId !== currentVideo.id) {
      handleScrollOrLoad(currentVideo.id);
    }
  };

  const handleVideoClick = (id: number) => { // Đổi sang number
    const videoElement = videoRefs.current[id];
    if (!videoElement) return;
    playingVideoId === id ? videoElement.pause() : videoElement.play().catch(() => {});
    setPlayingVideoId(playingVideoId === id ? null : id);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (playingVideoId && videoRefs.current[playingVideoId]) {
      videoRefs.current[playingVideoId]!.muted = nextState;
    }
  };

  const handleToggleLike = (id: number) => { // Đổi sang number
    setLikedVideos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <Box sx={{ width: "100%", height: "calc(100vh - 64px)", display: "flex", justifyContent: "center", bgcolor: "#000", position: "relative" }}>
      
      {/* Container giới hạn chiều rộng chuẩn mobile */}
      <Box sx={{ position: "relative", width: "100%", maxWidth: "420px", height: "100%" }}>
        
        {/* Nút Mute bám dính theo Container giới hạn (không bị lệch theo màn hình) */}
        <IconButton 
          onClick={toggleMute}
          sx={{ position: "absolute", top: 16, right: 16, bgcolor: "rgba(0,0,0,0.5)", color: "white", zIndex: 30 }}
        >
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>

        <Box
          ref={containerRef}
          onScroll={handleScroll}
          sx={{
            width: "100%", height: "100%", overflowY: "scroll", scrollSnapType: "y mandatory",
            scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" }
          }}
        >
          {videos.map((video) => (
            <VideoCard 
              key={video.id}
              video={video}
              isLiked={likedVideos.has(video.id)}
              playingVideoId={playingVideoId}
              isMuted={isMuted}
              videoRef={(el) => { videoRefs.current[video.id] = el; }}
              onVideoClick={handleVideoClick}
              onToggleLike={() => handleToggleLike(video.id)}
              onOpenComments={() => { setActiveVideoId(video.id); setIsCommentOpen(true); }}
            />
          ))}
        </Box>
      </Box>

      <CommentSection 
        isOpen={isCommentOpen} 
        onClose={() => setIsCommentOpen(false)} 
        videoId={activeVideoId} 
      />
    </Box>
  );
}