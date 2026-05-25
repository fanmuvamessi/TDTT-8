'use client';
import { useEffect, useState } from 'react';
import { ContentServices } from '../content-services';
import VideoPlayer from '../components/VideoPlayer';
import { ShortVideo } from '../../../types';

export default function VideosPage() {
  const [videos, setVideos] = useState<ShortVideo[]>([]);

  useEffect(() => {
    ContentServices.getShortVideos().then(setVideos).catch(console.error);
  }, []);

  return (
    // Vùng chứa áp dụng CSS scroll snap
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map(video => (
        <VideoPlayer key={video.id} video={video} />
      ))}
    </div>
  );
}