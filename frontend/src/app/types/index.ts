// Định nghĩa kiểu dữ liệu cơ bản dùng chung
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  merchants?: Merchant[];
}

// 1. Dữ liệu Video (Dùng cho khối Review)
export interface ExtendedShortVideo {
  id: string;
  author: User;
  videoUrl: string;
  thumbnail_url: string; // Thêm trường này để hiển thị ảnh bìa
  description: string;
  likes: number;
  commentsCount: number;
  rating: number; 
  merchantName: string;
  merchantId: string;
  tags: string[];
  views?: string;
}

// 2. Dữ liệu Quán ăn (Dùng cho khối Gần bạn)
export interface Merchant {
  id: string;
  name: string;
  address: string;
  distance: string;     // Thêm khoảng cách (VD: "500m")
  rating_avg: number;   // Sửa tên cho đồng nhất với database/API
  coverImageUrl: string;
  menu?: MenuItem[];    // Để optional vì có thể chưa cần load ngay
  owner?: User;
  lat: number;
  lng: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

// 3. Dữ liệu Chiến dịch (Dùng cho khối Quảng cáo)
export interface Campaign {
  id: string;
  title: string;
  thumbnail_url: string;
  link: string;
  is_sponsored: boolean;
}