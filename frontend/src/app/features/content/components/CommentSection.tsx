import React, { useState, useEffect } from "react";

// 🌟 1. Cập nhật Interface: Thêm videoId (chấp nhận cả string hoặc null)
interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null; 
}

export default function CommentSection({ isOpen, onClose, videoId }: CommentSectionProps) {
  // Mock data danh sách bình luận (Sau này bạn có thể fetch dựa theo videoId)
  const [comments, setComments] = useState([
    { id: 1, user: "Hoàng", text: "Quán này bún bò nhiều thịt cực, nước ngọt thanh!" },
    { id: 2, user: "Trí", text: "Giá hạt dẻ hợp ví sinh viên lắm nha mọi người." },
    { id: 3, user: "Khoa", text: "Video review có tâm quá, tí phải đặt ăn thử liền." }
  ]);
  const [newComment, setNewComment] = useState("");

  // Theo dõi khi người dùng đổi video thì reset hoặc fetch lại bình luận của video đó
  useEffect(() => {
    if (videoId) {
      console.log(`Đang tải bình luận mới cho video: ${videoId}`);
      // Ví dụ: ContentServices.getCommentsByVideo(videoId).then(data => setComments(data));
    }
  }, [videoId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Thêm bình luận mới vào danh sách
    setComments([...comments, { id: Date.now(), user: "Tôi", text: newComment }]);
    setNewComment("");
  };

  if (!isOpen) return null;

  return (
    <div 
      className="absolute inset-y-0 right-0 w-80 bg-[#0a0a0a] shadow-2xl z-40 flex flex-col border-l border-[#1e1e1e] animate-slide-left"
      onClick={(e) => e.stopPropagation()} // Chặn bong bóng sự kiện để không dính kích hoạt click pause video phía sau
    >
      {/* HEADER DIỄN ĐÀN BÌNH LUẬN */}
      <div className="p-4 border-b border-[#1e1e1e] flex justify-between items-center bg-[#111111]">
        <h4 className="font-extrabold text-xs text-white tracking-wider">
          BÌNH LUẬN ({comments.length})
        </h4>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white text-sm transition-colors p-1"
        >
          ✕
        </button>
      </div>

      {/* DANH SÁCH LIST COMMENT CUỘN */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none">
        {comments.map((c) => (
          <div key={c.id} className="text-[11px] bg-[#141414] p-3 rounded-xl border border-[#1e1e1e] flex flex-col gap-0.5">
            <span className="font-bold text-[#ff6b35]">{c.user}</span>
            <span className="text-gray-300 leading-relaxed break-words">{c.text}</span>
          </div>
        ))}
      </div>

      {/* KHU VỰC FORM NHẬP BÌNH LUẬN MỚI */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#1e1e1e] flex gap-2 bg-[#0d0d0d]">
        <input
          type="text"
          value={newComment}
          // 🌟 ĐÃ SỬA LỖI: Thêm setNewComment để gõ được văn bản bình thường
          onChange={(e) => setNewComment(e.target.value)} 
          placeholder="Thêm bình luận công khai..."
          className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#262626] text-white rounded-xl outline-none text-[11px] placeholder-gray-600 focus:bg-[#1f1f1f] focus:border-[#ff6b35] transition-all"
        />
        <button 
          type="submit" 
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-[#ff6b35] hover:bg-[#e05626] text-white font-extrabold text-[11px] rounded-xl transition-colors disabled:bg-[#2d2d2d] disabled:text-gray-600"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}