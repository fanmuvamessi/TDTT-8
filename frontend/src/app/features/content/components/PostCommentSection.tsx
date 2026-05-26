import React from "react";
import { Box, Stack, Avatar, Typography, TextField, IconButton, Divider } from "@mui/material";
import { Send } from "@mui/icons-material";

export default function PostCommentSection({ postId, commentInputs, setCommentInputs, initialComments }: any) {
  const [comments, setComments] = React.useState(initialComments || []);

  const handleSend = () => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      user: "Bạn",
      text: text
    };

    setComments([...comments, newComment]);
    setCommentInputs((prev: any) => ({ ...prev, [postId]: "" }));
  };

  // Logic xử lý phím Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Chỉ gửi khi nhấn Enter (không kèm Shift)
      e.preventDefault(); // Ngăn xuống dòng
      handleSend();
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#0d0d0d", borderTop: "1px solid #1e1e1e" }}>
      <Typography variant="caption" sx={{ fontWeight: 700, color: "#718096", mb: 1.5, display: "block" }}>
        BÌNH LUẬN
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {comments.map((c: any) => (
          <Stack key={c.id} direction="row" spacing={1} alignItems="flex-start">
            <Avatar sx={{ width: 26, height: 26, fontSize: 11, bgcolor: "#333" }}>{c.user[0]}</Avatar>
            <Box sx={{ bgcolor: "#1a1a1a", px: 1.5, py: 1, borderRadius: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#fff", display: "block" }}>{c.user}</Typography>
              <Typography variant="caption" sx={{ color: "#cbd5e0" }}>{c.text}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 1, borderColor: "#1e1e1e" }} />

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
        <TextField
          placeholder="Viết bình luận..."
          size="small"
          fullWidth
          value={commentInputs[postId] || ""}
          onChange={(e) => setCommentInputs((prev: any) => ({ ...prev, [postId]: e.target.value }))}
          onKeyDown={handleKeyDown} // GẮN SỰ KIỆN ENTER VÀO ĐÂY
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3, fontSize: 12, bgcolor: "#1a1a1a", color: "#fff",
              "& fieldset": { borderColor: "#2d2d2d" }
            }
          }}
        />
        <IconButton 
          onClick={handleSend}
          disabled={!(commentInputs[postId] || "").trim()}
          sx={{ bgcolor: "#ff6b35", color: "#fff", p: 1, "&:hover": { bgcolor: "#e05626" } }}
        >
          <Send sx={{ fontSize: 14 }} />
        </IconButton>
      </Stack>
    </Box>
  );
}