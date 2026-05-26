import React from "react";
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Stack, Chip, Typography, Box } from "@mui/material";
import { Favorite, FavoriteBorder, ChatBubbleOutline, Share, BookmarkBorder, LocationOn, Star } from "@mui/icons-material";

// Import dữ liệu và component bình luận
import { mockPosts } from "../mock-data";
import PostCommentSection from "./PostCommentSection";

export interface PostCardProps {
  post: any;
  likedPosts: Set<string>;
  handleLike: (id: string) => void;
  showComments: Set<string>;
  toggleComments: (id: string) => void;
  commentInputs: { [key: string]: string };
  setCommentInputs: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export default function PostCard({
  post,
  likedPosts,
  handleLike,
  showComments,
  toggleComments,
  commentInputs,
  setCommentInputs
}: PostCardProps) {
  
  // Lấy dữ liệu trực tiếp từ mockPosts
  const postData = mockPosts.find(p => p.id === post.id) || post;

  return (
    <Card 
      sx={{ 
        borderRadius: 4, 
        boxShadow: "none", 
        border: "1px solid #1e1e1e", 
        overflow: "hidden",
        bgcolor: "#111111" 
      }}
    >
      {/* 1. THÔNG TIN NGƯỜI ĐĂNG BÀI */}
      <CardHeader
        avatar={
          <Avatar src={postData.author?.avatarUrl} sx={{ width: 40, height: 40, bgcolor: "#222" }}>
            {postData.author?.name?.[0]}
          </Avatar>
        }
        title={
          <Typography variant="body2" sx={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>
            {postData.author?.name}
          </Typography>
        }
        subheader={
          <Typography variant="caption" sx={{ color: "#718096", fontSize: "0.75rem" }}>
            {postData.createdAt}
          </Typography>
        }
        sx={{ pb: 1 }}
      />

      {/* 2. THÔNG TIN QUÁN & ĐÁNH GIÁ */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "#ff6b35" }}>
          <LocationOn sx={{ fontSize: 16, color: "#ff6b35" }} />
          <Typography variant="body2" sx={{ fontWeight: 800, color: "#ff6b35", fontSize: "0.88rem", "&:hover": { textDecoration: "underline" }, cursor: "pointer" }}>
            {postData.merchantName}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.3}>
          <Star sx={{ fontSize: 16, color: "#ffb703" }} />
          <Typography variant="caption" sx={{ fontWeight: 800, color: "#ff9f43", fontSize: "0.85rem" }}>
            {postData.rating}
          </Typography>
        </Stack>
      </Stack>

      {/* 3. NỘI DUNG REVIEW */}
      <CardContent sx={{ pt: 0, pb: 1.5, px: 2 }}>
        <Typography variant="body2" sx={{ color: "#e2e8f0", lineHeight: 1.6, fontSize: "0.9rem", mb: 2 }}>
          {postData.content}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {postData.tags?.map((tag: string, index: number) => (
            <Chip 
              key={index}
              label={`#${tag}`} 
              size="small" 
              sx={{ 
                bgcolor: "#1a202c", 
                color: "#a0aec0", 
                fontWeight: 600, 
                fontSize: 11, 
                borderRadius: 1.5,
                height: 24,
                "& .MuiChip-label": { px: 1 }
              }}
            />
          ))}
        </Stack>
      </CardContent>

      {/* 4. HÌNH ẢNH */}
      {postData.imageUrl && (
        <Box sx={{ px: 2, pb: 1 }}>
          <CardMedia
            component="img"
            height="360"
            image={postData.imageUrl}
            alt="Review Content"
            sx={{ objectFit: "cover", borderRadius: 2 }}
          />
        </Box>
      )}

      {/* 5. THANH TƯƠNG TÁC */}
      <CardActions sx={{ justifyContent: "space-between", px: 1.5, py: 0.5, bgcolor: "transparent" }}>
        <Stack direction="row" spacing={1}>
          <Stack direction="row" alignItems="center">
            <IconButton size="medium" onClick={() => handleLike(postData.id)} sx={{ color: likedPosts.has(postData.id) ? "#ff6b35" : "#ffffff" }}>
              {likedPosts.has(postData.id) ? <Favorite sx={{ fontSize: 20 }} /> : <FavoriteBorder sx={{ fontSize: 20 }} />}
            </IconButton>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12, color: "#ffffff", ml: -0.2 }}>
              {likedPosts.has(postData.id) ? (postData.likes + 1) : postData.likes}
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center">
            <IconButton size="medium" onClick={() => toggleComments(postData.id)} sx={{ color: showComments.has(postData.id) ? "#ff6b35" : "#ffffff" }}>
              <ChatBubbleOutline sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12, color: "#ffffff", ml: -0.2 }}>
              {postData.commentsCount}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <IconButton size="medium" sx={{ color: "#ffffff" }}><Share sx={{ fontSize: 20 }} /></IconButton>
          <IconButton size="medium" sx={{ color: "#ffffff" }}><BookmarkBorder sx={{ fontSize: 20 }} /></IconButton>
        </Stack>
      </CardActions>

      {/* 6. GỌI COMPONENT BÌNH LUẬN */}
      {showComments.has(postData.id) && (
        <PostCommentSection 
            postId={postData.id}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            onClose={() => toggleComments(postData.id)}
        />
      )}
    </Card>
  );
}