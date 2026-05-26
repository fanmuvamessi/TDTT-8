import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { VolumeUp, VolumeOff } from "@mui/icons-material";
import CommentSection from "../components/CommentSection";
import VideoCard from "../components/VideoCard";
import { ContentServices } from "../content-services";
import { ExtendedShortVideo } from "../../../types";

export default function VideosPage() {
  const [videos, setVideos] = useState<ExtendedShortVideo[]>([]);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    ContentServices.getShortVideos().then((data) => {
      setVideos(data);
      if (data.length > 0) {
        setTimeout(() => handleScrollOrLoad(data[0].id), 100);
      }
    });

    // Cleanup khi component bị unmount
    return () => {
      videoRefs.current = {};
    };
  }, []);

  const handleScrollOrLoad = (targetId: string) => {
    Object.keys(videoRefs.current).forEach((id) => {
      const vid = videoRefs.current[id];
      if (vid) {
        if (id === targetId) {
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

  const handleVideoClick = (id: string) => {
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

  const handleToggleLike = (id: string) => {
  setLikedVideos((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
};

const handleOpenComments = (id: string) => {
  setActiveVideoId(id);
  setIsCommentOpen(true);
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
            // Trong VideosPage.tsx
            <VideoCard 
              key={video.id}
              video={video}
              isLiked={likedVideos.has(video.id)}
              playingVideoId={playingVideoId}
              isMuted={isMuted}
              videoRef={(el) => { videoRefs.current[video.id] = el; }}
              onVideoClick={handleVideoClick}
              onToggleLike={() => handleToggleLike(video.id)} // Truyền id vào
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