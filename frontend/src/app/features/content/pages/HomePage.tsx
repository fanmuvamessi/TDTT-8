'use client';
import { useEffect, useState } from 'react';
import { ContentServices } from '../content-services';
import HeartButton from '../components/HeartButton';
import CommentSection from '../components/CommentSection';
import { ReviewPost } from '../../../types';

export default function HomePage() {
  const [posts, setPosts] = useState<ReviewPost[]>([]);

  useEffect(() => {
    // Gọi hàm mock hoặc API thật
    ContentServices.getHomePosts().then(setPosts).catch(console.error);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-6 flex flex-col gap-6">
      {posts.map(post => (
        <div key={post.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
          <div className="p-4 font-bold border-b">{post.author.name}</div>
          <div className="p-4">{post.content}</div>
          {post.imageUrl && <img src={post.imageUrl} alt="Review" className="w-full h-auto" />}
          <div className="p-2 flex border-t">
            <HeartButton initialLikes={post.likes} />
          </div>
          <CommentSection targetId={post.id} />
        </div>
      ))}
    </div>
  );
}