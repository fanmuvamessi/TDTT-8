'use client';
import { useState } from 'react';

interface HeartButtonProps {
  initialLikes: number;
  onLike?: () => void;
}

export default function HeartButton({ initialLikes, onLike }: HeartButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    if (onLike) onLike();
  };

  return (
    <button onClick={handleLike} className="flex items-center gap-1 p-2">
      <span className={liked ? "text-red-500" : "text-gray-500"}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span className="text-sm">{likesCount}</span>
    </button>
  );
}