'use client';
import { useRef, useEffect, useState } from 'react';
import { ShortVideo } from '../../../types';
import HeartButton from './HeartButton';
import CommentSection from './CommentSection';

interface VideoPlayerProps {
  video: ShortVideo;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Logic tự động phát khi cuộn đến
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 } // Kích hoạt khi 60% video nằm trong màn hình
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative h-screen w-full snap-start bg-black flex justify-center items-center">
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        playsInline
        onClick={togglePlay}
        className="h-full w-auto object-cover cursor-pointer"
      />
      
      {/* Overlay UI (Tương tự TikTok) */}
      <div className="absolute bottom-20 left-4 text-white w-2/3 z-10">
        <h3 className="font-bold">@{video.author.name}</h3>
        <p className="text-sm">{video.description}</p>
      </div>

      <div className="absolute bottom-20 right-4 flex flex-col gap-4 z-10">
         <HeartButton initialLikes={video.likes} />
         {/* Có thể thêm nút mở CommentSection dạng Modal ở đây */}
      </div>
    </div>
  );
}