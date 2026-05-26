import { ReviewPost, ExtendedShortVideo } from '../../types';
import { mockPosts, mockVideos } from './mock-data'; // Giả sử bạn tách data ra file riêng

export const ContentServices = {
  // Dùng generics để đảm bảo kiểu dữ liệu luôn đúng
  async getHomePosts(): Promise<ReviewPost[]> {
    try {
      // Mock data sẽ được trả về nếu chưa có API
      return mockPosts; 
      // Khi có API: return await apiClient.get<ReviewPost[]>('/posts');
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
      return [];
    }
  },

  async getShortVideos(): Promise<ExtendedShortVideo[]> {
    try {
      return mockVideos;
    } catch (error) {
      console.error("Lỗi khi lấy video:", error);
      return [];
    }
  },

  // Tối ưu hàm like: Hỗ trợ cả post và video
  async toggleLike(id: string, type: 'post' | 'video'): Promise<boolean> {
    try {
      console.log(`Đang gửi yêu cầu ${type} like cho id: ${id}`);
      // Giả lập API gọi backend
      return true;
    } catch (error) {
      return false;
    }
  }
};