import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { LocalFireDepartment } from "@mui/icons-material";
import { ContentServices } from "../content-services"; 
import { ReviewPost } from "../../../types";

// 🌟 ĐÃ CẬP NHẬT: Import cục bộ từ thư mục components cùng cấp thuộc tính home
import PostCard from "../components/PostCard"; 

export default function HomePage() {
  const [posts, setPosts] = useState<ReviewPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    ContentServices.getHomePosts().then((data) => {
      setPosts(data);
    });
  }, []);

  const handleLike = (id: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleComments = (id: string) => {
    setShowComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <Box 
      sx={{ 
        width: "100%",
        maxWidth: "100%", 
        mx: "auto", 
        px: { xs: 2, sm: 4 }, 
        pt: 9, 
        pb: 6, 
        bgcolor: "#000000", 
        minHeight: "100%",
        overflowY: "auto"
      }}
    >
      {/* TIÊU ĐỀ XU HƯỚNG */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3, maxWidth: 620, mx: "auto" }}>
        <LocalFireDepartment sx={{ color: "#ff6b35", fontSize: 24 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "0.5px" }}>
          BÀI VIẾT NỔI BẬT KHU VỰC
        </Typography>
      </Stack>

      {/* DANH SÁCH BÀI ĐĂNG */}
      <Stack spacing={3} sx={{ maxWidth: 620, mx: "auto" }}>
        {posts.map((post) => (
          <PostCard 
            key={post.id}
            post={post}
            likedPosts={likedPosts}
            handleLike={handleLike}
            showComments={showComments}
            toggleComments={toggleComments}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
          />
        ))}
      </Stack>
    </Box>
  );
}