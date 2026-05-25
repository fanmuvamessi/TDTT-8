'use client';
import { useState } from 'react';

export default function CommentSection({ targetId }: { targetId: string }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]); // Mock list

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, comment]);
    setComment('');
    // TODO: Gọi API POST comment ở đây
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="max-h-40 overflow-y-auto mb-2">
        {comments.map((cmt, idx) => (
          <div key={idx} className="text-sm bg-gray-100 p-2 rounded mb-1">{cmt}</div>
        ))}
      </div>
      <form onSubmit={submitComment} className="flex gap-2">
        <input 
          type="text" 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Thêm bình luận..." 
          className="flex-1 border rounded px-3 py-1 text-sm"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Gửi</button>
      </form>
    </div>
  );
}