import { ReviewPost, ShortVideo } from '../../types';

const mockPosts: ReviewPost[] = [
  {
    id: '1',
    author: { id: 'u1', name: 'Người Sành Ăn', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
    content: 'Quán này đồ ăn ngon, không gian đẹp, 10 điểm!',
    imageUrl: 'https://picsum.photos/600/400',
    likes: 45,
    createdAt: '2026-05-25'
  },
  {
    id: '2',
    author: { id: 'u2', name: 'Chiến Thần Review', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
    content: 'Đồ uống hơi ngọt nhưng view check-in rất tuyệt vời nhé mọi người.',
    likes: 12,
    createdAt: '2026-05-24'
  }
];

const mockVideos: ShortVideo[] = [
  {
    id: 'v1',
    author: { id: 'u3', name: 'Food Vlogger', avatarUrl: 'https://i.pravatar.cc/150?u=3' },
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Món mới cực hot nè mọi người ơi!',
    likes: 120,
    commentsCount: 15
  }
];

export const ContentServices = {
  getHomePosts: async (): Promise<ReviewPost[]> => {
    return mockPosts;
  },

  getShortVideos: async (): Promise<ShortVideo[]> => {
    return mockVideos;
  },

  likePost: async (postId: string): Promise<boolean> => {
    return true;
  }
};