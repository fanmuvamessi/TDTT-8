// Định nghĩa kiểu dữ liệu cho toàn bộ module của bạn
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ReviewPost {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  likes: number;
  createdAt: string;
  merchantName: string;
  rating: number;
  tags: string[];
  commentsCount: number;
}


export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Merchant {
  id: string;
  name: string;
  address: string;
  rating: number;
  coverImageUrl: string;
  menu: MenuItem[];
}

export interface ExtendedShortVideo {
  id: string;
  author: User;
  videoUrl: string;
  description: string;
  likes: number;
  commentsCount: number;
  rating: number;      // Bắt buộc 
  merchantName: string; // Bắt buộc 
  tags: string[];      // Bắt buộc 
  views?: string;
}