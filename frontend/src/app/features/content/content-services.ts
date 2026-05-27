import { ExtendedShortVideo, Merchant, Campaign } from '../../types'; // Cập nhật các kiểu dữ liệu thực tế
import { mockVideos, mockHomeMerchants, mockCampaigns } from './mock-data';

export const ContentServices = {
  
  // 1. Lấy danh sách video xu hướng
  async getShortVideos(): Promise<ExtendedShortVideo[]> {
    try {
      // Mock data hiện tại
      return mockVideos;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách video:", error);
      return [];
    }
  },

  // 2. Lấy danh sách quán ăn (Merchant)
  async getHomeMerchants(): Promise<Merchant[]> {
    try {
      return mockHomeMerchants;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quán ăn:", error);
      return [];
    }
  },

  // 3. Lấy danh sách quảng cáo/chiến dịch (Campaigns)
  async getCampaigns(): Promise<Campaign[]> {
    try {
      return mockCampaigns;
    } catch (error) {
      console.error("Lỗi khi lấy chiến dịch:", error);
      return [];
    }
  },

  // 4. Tối ưu hàm like: Hỗ trợ video hoặc các loại nội dung khác
  async toggleLike(id: string, type: 'video' | 'merchant'): Promise<boolean> {
    try {
      console.log(`Đang gửi yêu cầu like cho ${type} với id: ${id}`);
      // Giả lập API gọi backend: return await apiClient.post(`/like/${type}/${id}`);
      return true;
    } catch (error) {
      console.error("Lỗi khi thực hiện like:", error);
      return false;
    }
  }
};