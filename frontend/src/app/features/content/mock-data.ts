// src/app/features/content/mock-data.ts
import { User, Merchant, Campaign, Video } from '../../types';

// =========================================================================
// 1. DỮ LIỆU GIẢ LẬP USER (ĐỒNG BỘ CẤU TRÚC BẢNG 'users')
// =========================================================================
export const mockUserReviewer: User = {
  id: 1,
  firebase_uid: "fb-reviewer-123",
  email: "thanhdat.foodreview@gmail.com",
  full_name: "Thành Đạt Food Review",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  role: "reviewer",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockUserMerchant1: User = {
  id: 2,
  firebase_uid: "fb-merchant-001",
  email: "bunbohuessus@gmail.com",
  full_name: "Chủ Quán Bún Bò US",
  avatar_url: "https://i.pravatar.cc/150?u=m1",
  role: "merchant",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockUserMerchant2: User = {
  id: 3,
  firebase_uid: "fb-merchant-002",
  email: "studiocafe@gmail.com",
  full_name: "Quản lý Cà Phê Studio",
  avatar_url: "https://i.pravatar.cc/150?u=m2",
  role: "merchant",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};


// =========================================================================
// 2. DỮ LIỆU GIẢ LẬP MERCHANT (ĐỒNG BỘ CẤU TRÚC BẢNG 'merchants' & 'menus')
// KHÔNG CHỨA TRƯỜNG ẢNH BÌA THEO ĐÚNG THIẾT KẾ ALL_MODELS
// =========================================================================
export const mockHomeMerchants: Merchant[] = [
  { 
    id: 1, 
    name: "Bún Bò Huế US - Nguyễn Văn Cừ", 
    address: "227 Nguyễn Văn Cừ, Quận 5", 
    rating_avg: 4.8,
    latitude: 10.7626, 
    longitude: 106.6821,
    description: "Bún bò chuẩn vị Huế, không gian rộng rãi cạnh trường Đại học",
    owner_id: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    menus: [
      { id: 11, merchant_id: 1, dish_name: "Bún bò đặc biệt", price: 65000, is_available: true, created_at: new Date().toISOString() },
      { id: 12, merchant_id: 1, dish_name: "Trà đá", price: 5000, is_available: true, created_at: new Date().toISOString() }
    ]
  },
  { 
    id: 2, 
    name: "Cà Phê Studio - An Dương Vương", 
    address: "180 An Dương Vương, Quận 5", 
    rating_avg: 4.5,
    latitude: 10.7610,
    longitude: 106.6795,
    description: "Không gian yên tĩnh, lý tưởng để làm việc và chạy deadline",
    owner_id: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    menus: [
      { id: 21, merchant_id: 2, dish_name: "Cà phê sữa đá", price: 35000, is_available: true, created_at: new Date().toISOString() }
    ]
  },
  { 
    id: 3, 
    name: "Bánh Mì Đêm Cô Ba", 
    address: "Góc ngã tư Trần Hưng Đạo", 
    rating_avg: 4.7,
    latitude: 10.7585,
    longitude: 106.6830,
    description: "Bánh mì giòn rụm bán xuyên đêm phục vụ hội cú đêm",
    owner_id: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    menus: [
      { id: 31, merchant_id: 3, dish_name: "Bánh mì chả xá xíu", price: 25000, is_available: true, created_at: new Date().toISOString() }
    ]
  }
];


// =========================================================================
// 3. DỮ LIỆU GIẢ LẬP CAMPAIGN (ĐỒNG BỘ CẤU TRÚC BẢNG 'campaigns')
// =========================================================================
export const mockCampaigns: Campaign[] = [
  { 
    id: 101, 
    merchant_id: 1,
    title: "Siêu đại tiệc Bún bò - Giảm 20% cho sinh viên Tự Nhiên", 
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-41876-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800", 
    is_active: true,
    impressions_count: 1250,
    clicks_count: 340,
    created_at: new Date().toISOString()
  },
  { 
    id: 102, 
    merchant_id: 2,
    title: "Trà trái cây nhiệt đới đồng giá 25 cành giải nhiệt mùa deadline", 
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-fresh-iced-tea-with-lemon-42261-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800", 
    is_active: true,
    impressions_count: 980,
    clicks_count: 120,
    created_at: new Date().toISOString()
  }
];


// =========================================================================
// 4. DỮ LIỆU GIẢ LẬP VIDEO CHUNG (ĐỒNG BỘ CẤU TRÚC BẢNG 'videos')
// =========================================================================
export const mockVideos: Video[] = [
  {
    id: 501,
    title: "Món bún bò chuẩn vị Huế có một không hai ngay gần cơ sở Nguyễn Văn Cừ",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-41876-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500",
    description: "Nước dùng đậm đà, thịt bò mềm và topping siêu chất lượng mng ơiii!",
    status: "approved",
    likes_count: 120,
    reviewer_id: 1,
    tagged_merchant_id: 1,
    created_at: new Date().toISOString(),
    tagged_merchant: { id: 1, name: "Bún Bò Huế US - Nguyễn Văn Cừ" }
  },
  {
    id: 502,
    title: "Ê check-in ngay quán cà phê tone trắng đen chạy deadline xuyên đêm",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42220-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
    description: "Wifi siêu mạnh, có máy lạnh mát rượi và nước uống khá ổn áp nha.",
    status: "approved",
    likes_count: 85,
    reviewer_id: 1,
    tagged_merchant_id: 2,
    created_at: new Date().toISOString(),
    tagged_merchant: { id: 2, name: "Cà Phê Studio - An Dương Vương" }
  },
  {
    id: 503,
    title: "Hàng bánh mì xá xíu, xíu mại đêm đỉnh chóp lề đường mở tới 2h sáng",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-gourmet-burger-preparation-41566-large.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
    description: "Chỗ cứu đói quen thuộc của mình mỗi lần học muộn hoặc đi chơi về trễ.",
    status: "approved",
    likes_count: 243,
    reviewer_id: 1,
    tagged_merchant_id: 3,
    created_at: new Date().toISOString(),
    tagged_merchant: { id: 3, name: "Bánh Mì Đêm Cô Ba" }
  }
];



// =========================================================================
// 5. CẤU HÌNH LIÊN KẾT ĐỐI TƯỢNG PROFILE CHO USER HIỆN TẠI
// =========================================================================
export const mockUserProfile: User = {
  ...mockUserReviewer,
  videos: [
    {
      id: 501,
      title: "Món bún bò chuẩn vị Huế có một không hai ngay gần cơ sở Nguyễn Văn Cừ",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-41876-large.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500",
      description: "Nước dùng đậm đà, thịt bò mềm và topping siêu chất lượng mng ơiii!",
      status: "approved",
      likes_count: 120,
      reviewer_id: 1,
      tagged_merchant_id: 1,
      created_at: new Date().toISOString(),
      tagged_merchant: { id: 1, name: "Bún Bò Huế US - Nguyễn Văn Cừ" }
    },
    {
      id: 503,
      title: "Hàng bánh mì xá xíu, xíu mại đêm đỉnh chóp lề đường mở tới 2h sáng",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-gourmet-burger-preparation-41566-large.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
      description: "Chỗ cứu đói quen thuộc của mình mỗi lần học muộn hoặc đi chơi về trễ.",
      status: "approved",
      likes_count: 243,
      reviewer_id: 1,
      tagged_merchant_id: 3,
      created_at: new Date().toISOString(),
      tagged_merchant: { id: 3, name: "Bánh Mì Đêm Cô Ba" }
    }
  ],
  liked_videos: [
    {
      id: 502,
      title: "Ê check-in ngay quán cà phê tone trắng đen chạy deadline xuyên đêm",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42220-large.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
      description: "Wifi siêu mạnh, có máy lạnh mát rượi và nước uống khá ổn áp nha.",
      status: "approved",
      likes_count: 85,
      reviewer_id: 4,
      tagged_merchant_id: 2,
      created_at: new Date().toISOString(),
      tagged_merchant: { id: 2, name: "Cà Phê Studio - An Dương Vương" }
    }
  ]
};

