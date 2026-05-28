// =========================================================================
// ĐỊNH NGHĨA CẤU TRÚC TYPE FRONTEND (ĐỒNG BỘ 100% VỚI ALL_MODELS CỦA BACKEND)
// =========================================================================

/**
 * Vai trò của người dùng trong hệ thống
 * Đồng bộ với: role = Column(String, default="reviewer")
 */
export type UserRole = "admin" | "merchant" | "reviewer";

/**
 * Trạng thái kiểm duyệt nội dung Video
 * Đồng bộ với: status = Column(String, default="pending")
 */
export type VideoStatus = "pending" | "approved" | "rejected";

/**
 * Interface đại diện cho bảng 'users' ở Backend
 */
export interface User {
  id: number;
  firebase_uid: string; // Đồng bộ từ Firebase Auth, siết chặt định danh
  email: string | null; // Để nullable vì hệ thống hỗ trợ đăng nhập qua SĐT (OTP)
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  meta_data?: Record<string, any> | null; // Lưu siêu dữ liệu linh hoạt cấu hình thiết bị/token
  created_at: string;
  updated_at: string;

  // Relationships (Dữ liệu quan hệ được Backend gộp sẵn khi gọi API Profile)
  merchants?: Merchant[];
  videos?: Video[];          // Phục vụ Tab 1: Danh sách video tự đăng
  liked_videos?: Video[];    // Phục vụ Tab 2: Danh sách video đã thích (Backend bóc tách từ bảng 'likes')
}

/**
 * Interface đại diện cho bảng 'merchants' (Quán ăn / Nhà hàng)
 */
export interface Merchant {
  id: number;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  rating_avg: number;
  owner_id: number;
  is_active: boolean; // Tránh lỗi xóa cứng làm mất dữ liệu liên quan
  created_at: string;

  // Relationships
  menus?: Menu[];
  videos?: Video[];
  campaigns?: Campaign[];
}

/**
 * Interface đại diện cho bảng 'menus' (Thực đơn món ăn của quán)
 */
export interface Menu {
  id: number;
  merchant_id: number;
  dish_name: string;
  price: number;
  is_available: boolean;
  created_at: string;
}

/**
 * Interface đại diện cho bảng 'videos' (Nội dung cốt lõi của ứng dụng - Bài đăng ngắn)
 */
export interface Video {
  id: number;
  title: string;
  video_url: string;
  thumbnail_url: string | null; // Ảnh đại diện hiển thị ở Grid trang Profile
  description: string | null;
  status: VideoStatus;          // Dùng để hiển thị nhãn "Đang duyệt" cho Reviewer biết
  likes_count: number;          // Hiện số tim khi hover chuột vào hình ảnh
  reviewer_id: number;
  tagged_merchant_id: number | null; // ID quán ăn được gắn thẻ trong video
  created_at: string;

  // Mối quan hệ lồng nhau phục vụ hiển thị tên quán kèm theo video
  tagged_merchant?: {
    id: number;
    name: string;
  } | null;
}

/**
 * Interface đại diện cho bảng trung gian 'likes'
 */
export interface Like {
  id: number;
  user_id: number;
  video_id: number;
  created_at: string;
}

/**
 * Interface đại diện cho bảng 'comments' (Bình luận dưới video)
 */
export interface Comment {
  id: number;
  user_id: number;
  video_id: number;
  content: string;
  parent_id: number | null;
  created_at: string;
  replies?: Comment[];
}

/**
 * Interface đại diện cho bảng 'campaigns' (Chiến dịch quảng cáo video của Merchant)
 */
export interface Campaign {
  id: number;
  merchant_id: number;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  is_active: boolean;
  impressions_count: number;
  clicks_count: number;
  created_at: string;
}