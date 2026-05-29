import os
import sys
import requests

# Đảm bảo in ký tự tiếng Việt mượt mà trên console Windows
if sys.platform.startswith("win"):
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def test_post_type_filtering():
    base_url = "http://localhost:8000"
    
    print("==================================================")
    print("🧪 CHẠY TEST TÍCH HỢP BỘ LỌC PHÂN LOẠI POST_TYPE (LIVE API) 🧪")
    print("==================================================")
    
    # 1. Lấy feed chung (mặc định trộn lẫn)
    feed_url = f"{base_url}/api/content/videos"
    print(f"\n[BƯỚC 1] Lấy danh sách Feed chung từ {feed_url} :")
    try:
        res = requests.get(feed_url)
        assert res.status_code == 200, f"Lỗi: Kỳ vọng status 200, nhận được {res.status_code}"
    except Exception as e:
        print(f"❌ Không kết nối được với Server: {e}")
        print("Vui lòng đảm bảo backend đang chạy tại port 8000.")
        sys.exit(1)
        
    data = res.json()
    items = data.get("items", [])
    print(f"  - Tổng số lượng bản ghi trả về: {len(items)}")
    
    # Kiểm tra xem cấu trúc schema có đầy đủ các trường và post_type không
    for idx, item in enumerate(items[:3]):
        print(f"    Bài viết {idx+1}: '{item.get('title')}'")
        print(f"      + post_type: {item.get('post_type')}")
        print(f"      + video_url: {item.get('video_url')}")
        print(f"      + is_ads: {item.get('is_ads')}")
        assert "post_type" in item, "Trường 'post_type' bị thiếu trong phản hồi!"
        
    # 2. Lấy bộ lọc post_type=video (Video Reels)
    reels_url = f"{feed_url}?post_type=video"
    print(f"\n[BƯỚC 2] Lấy danh sách bộ lọc Reels (post_type=video) từ {reels_url} :")
    res_video = requests.get(reels_url)
    assert res_video.status_code == 200
    video_items = res_video.json().get("items", [])
    print(f"  - Số lượng reels video trả về: {len(video_items)}")
    
    for item in video_items:
        if not item.get("is_ads"):
            assert item.get("post_type") == "video", f"Lỗi: Kì vọng post_type là 'video', nhưng nhận được '{item.get('post_type')}'"
    print("  - ✅ Tất cả các bài viết không phải quảng cáo đều có post_type = 'video'!")

    # 3. Lấy bộ lọc post_type=image (Photo Reviews)
    images_url = f"{feed_url}?post_type=image"
    print(f"\n[BƯỚC 3] Lấy danh sách bộ lọc Post hình ảnh (post_type=image) từ {images_url} :")
    res_image = requests.get(images_url)
    assert res_image.status_code == 200
    image_items = res_image.json().get("items", [])
    print(f"  - Số lượng bài viết hình ảnh trả về: {len(image_items)}")
    
    for item in image_items:
        if not item.get("is_ads"):
            assert item.get("post_type") == "image", f"Lỗi: Kì vọng post_type là 'image', nhưng nhận được '{item.get('post_type')}'"
    print("  - ✅ Tất cả các bài viết không phải quảng cáo đều có post_type = 'image'!")

    print("\n==================================================")
    print("🎉 KIỂM THỬ TÍCH HỢP HOÀN THÀNH MỸ MÃN THÀNH CÔNG! 🎉")
    print("==================================================")

if __name__ == "__main__":
    test_post_type_filtering()
