import { ExtendedShortVideo, Merchant, Campaign, User } from '../../types';

// 1. Dữ liệu giả lập Merchant (Đã đổi ID sang string, thêm coverImageUrl)
const mockUser1: User = { id: "u1", name: "Nguyễn Văn A", avatarUrl: "https://i.pravatar.cc/150?u=u1" };
const mockUser2: User = { id: "u2", name: "Trần Thị B", avatarUrl: "https://i.pravatar.cc/150?u=u2" };

export const mockHomeMerchants: Merchant[] = [
  { 
    id: "m1", 
    name: "Bún Bò Huế US - Nguyễn Văn Cừ", 
    address: "227 Nguyễn Văn Cừ, Quận 5", 
    rating_avg: 4.8, 
    distance: "0.2 km",
    coverImageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500",
    lat: 10.7626, 
    lng: 106.6821,
    owner: mockUser1,
    menu: [
      { id: "menu1", name: "Bún bò đặc biệt", price: 65000, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200" },
      { id: "menu2", name: "Trà đá", price: 5000, imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200" }
    ]
  },
  { 
    id: "m2", 
    name: "Cà Phê Studio - An Dương Vương", 
    address: "180 An Dương Vương, Quận 5", 
    rating_avg: 4.5, 
    distance: "0.6 km",
    coverImageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
    lat: 10.7610,
    lng: 106.6795,
    owner: mockUser2,
    menu: [
      { id: "menu3", name: "Cà phê sữa đá", price: 35000, imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200" }
    ]
  },
  { 
    id: "m3", 
    name: "Bánh Mì Đêm Cô Ba", 
    address: "Góc ngã tư Trần Hưng Đạo", 
    rating_avg: 4.7, 
    distance: "1.1 km",
    coverImageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
    lat: 10.7585,
    lng: 106.6830,
    owner: mockUser1,
    menu: [
      { id: "menu4", name: "Bánh mì chả", price: 25000, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200" }
    ]
  }
];

// 2. Dữ liệu giả lập Quảng cáo (Đã thêm thumbnail_url và sửa ID sang string)
export const mockCampaigns: Campaign[] = [
  { 
    id: "c101", 
    title: "Siêu đại tiệc Bún bò - Giảm 20% cho sinh viên Tự Nhiên", 
    thumbnail_url: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800", 
    link: "/campaign/101",
    is_sponsored: true
  },
  { 
    id: "c102", 
    title: "Trà trái cây nhiệt đới đồng giá 25 cành giải nhiệt mùa deadline", 
    thumbnail_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800", 
    link: "/campaign/102",
    is_sponsored: true
  }
];

// 3. Dữ liệu giả lập Video (Đã thêm thumbnail_url)
export const mockVideos: ExtendedShortVideo[] = [
  {
    id: "v1",
    author: { id: "u10", name: "Food Vlogger", avatarUrl: "https://i.pravatar.cc/150?u=10" },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-41876-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500",
    description: "Món bún bò chuẩn vị Huế có một không hai ngay gần cơ sở Nguyễn Văn Cừ...",
    likes: 120,
    rating: 4.8,
    merchantName: "Bún Bò Huế US - Nguyễn Văn Cừ",
    merchantId: "m1",
    tags: ["BunBoHue", "NgonGiaRe"],
    commentsCount: 15
  },
  {
    id: "v2",
    author: { id: "u11", name: "Thèm Ăn Đêm", avatarUrl: "https://i.pravatar.cc/150?u=11" },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42220-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
    description: "Ê check-in ngay quán cà phê tone trắng đen chạy deadline xuyên đêm...",
    likes: 85,
    rating: 4.5,
    merchantName: "Cà Phê Studio - An Dương Vương",
    merchantId: "m2",
    tags: ["CaPheDeadline", "Chill"],
    commentsCount: 9
  },
  {
    id: "v3",
    author: { id: "u12", name: "Học Muộn Ăn Gì", avatarUrl: "https://i.pravatar.cc/150?u=12" },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-gourmet-burger-preparation-41566-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
    description: "Hàng bánh mì xá xíu, xíu mại đêm đỉnh chóp lề đường mở tới 2h sáng...",
    likes: 243,
    rating: 4.7,
    merchantName: "Bánh Mì Đêm Cô Ba",
    merchantId: "m3",
    tags: ["BanhMi", "AnDem"],
    commentsCount: 32
  },
  {
    id: "v4",
    author: { id: "u13", name: "Trà Sữa Holic", avatarUrl: "https://i.pravatar.cc/150?u=13" },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fresh-iced-tea-with-lemon-42261-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    description: "Giải nhiệt trưa nắng với ly trà trái cây khổng lồ full thạch...",
    likes: 198,
    rating: 4.6,
    merchantName: "Trà Trái Cây Đô Thị",
    merchantId: "m4",
    tags: ["TraTraiCay", "GiaiNhiet"],
    commentsCount: 18
  }
];