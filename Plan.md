# Kế hoạch Scrum - Phát triển Backend MVP (2 Tuần - Rút Gọn Thực Chiến)

**Mục tiêu (Sprint Goal):** Hoàn thành hệ thống API Backend phiên bản MVP chạy ổn định trên một hạ tầng tinh gọn nhất. Đảm bảo thông suốt các luồng dữ liệu "Happy Path": Auth Google, CRUD Quán/Menu, Thuật toán trộn Feed Video (có Ads), Tìm kiếm không gian (Geo-Search bằng công thức toán học) và tương tác trực tiếp vào SQL để Frontend lắp ráp giao diện ngay lập tức.

**Nhân sự (Team Size):** 4 Backend Developers.
**Tech Stack tối giản:** Python/FastAPI, PostgreSQL (Lưu trữ tập trung cho cả SQL, NoSQL và Spatial logic).

---

## Phân chia vai trò (Domain Ownership)
* **BE1 (Identity & Core Lead):** Phụ trách Setup khung dự án, Đăng nhập Google, Middleware phân quyền (RBAC) và Deployment (Staging).
* **BE2 (Merchant & Ads Dashboard):** Phụ trách module Quản lý cửa hàng (Store), Thực đơn (Menu) và cấu hình bật/tắt Quảng cáo (Campaigns).
* **BE3 (Content & Feed Algo):** Phụ trách tích hợp lưu trữ Media (S3/Firebase), API tải Video và Thuật toán trộn Feed (Organic + Ads).
* **BE4 (Search & Interactions):** Phụ trách viết hàm tìm kiếm món ăn kết hợp tính khoảng cách vật lý (Haversine SQL) và API tương tác trực tiếp (Like/Comment).

---

## Tuần 1: Khởi tạo, Unified Database Schema & CRUD APIs
**Mục tiêu:** Dựng xong bộ khung project, tự động sinh bảng dữ liệu trên PostgreSQL và hoàn thành 100% các API CRUD cơ bản để bàn giao đầu vòi cho Frontend trong ngày thứ 5.

| Thành viên | Nhiệm vụ (Backlog Items) | Mức độ | Trạng thái |
| :--- | :--- | :---: | :---: |
| **BE1** | Khởi tạo Project FastAPI (Base structure), cấu hình CORS, Router tổng và Docker Compose (chỉ chứa Postgres). | Rất Cao | To Do |
| **BE1** | Thiết kế một Database Schema duy nhất trên PostgreSQL (Bao gồm các bảng: Users, Merchants, Menus, Videos, Comments, Likes, Campaigns). | Rất Cao | To Do |
| **BE1** | Xây dựng Module Auth (JWT Token, chỉ làm duy nhất Google Login/OAuth để tối ưu thời gian). | Cao | To Do |
| **BE2** | Viết API CRUD cho Merchant (Thông tin quán, lưu tọa độ dưới dạng 2 cột Float: `latitude` và `longitude`). | Cao | To Do |
| **BE2** | Viết API CRUD cho Menu (Danh sách món ăn, giá cả, trạng thái còn/hết). | Cao | To Do |
| **BE3** | Tích hợp Cloud Storage SDK (AWS S3 hoặc Firebase Storage) để upload thẳng file `.mp4` và hình ảnh menu. | Cao | To Do |
| **BE3** | Viết API lưu trữ và trả về Metadata của Video (Lưu trực tiếp vào bảng `videos` trong Postgres). | Cao | To Do |
| **BE4** | Viết API xử lý Tương tác: Thả tim (`Likes`) và Bình luận phẳng (`Comments` lưu kèm `parent_id` để xử lý tầng thô). Ghi trực tiếp vào Postgres. | Cao | To Do |
| **BE4** | Phối hợp với BE2 viết Script nạp dữ liệu mẫu (Seeding Data) gồm 50 quán ăn và 10 video review thật để chuẩn bị cho tuần thuật toán. | Trung bình| To Do |

---

## Tuần 2: Thuật toán (Algorithms) & Tích hợp (Integration)
**Mục tiêu:** Hiện thực hóa các thuật toán lõi bằng logic code tối giản, hỗ trợ Frontend ráp nối giao diện, fix lỗi CORS và diễn tập Demo.

| Thành viên | Nhiệm vụ (Backlog Items) | Mức độ | Trạng thái |
| :--- | :--- | :---: | :---: |
| **BE1** | Xây dựng Middleware phân quyền đơn giản dựa trên Role (`is_merchant`, `is_reviewer`) để bảo vệ API. | Cao | To Do |
| **BE1** | Deploy toàn bộ mã nguồn lên Server Staging (Render / Railway / VPS cỏ) để Frontend kết nối online. | Rất Cao | To Do |
| **BE2** | Viết API kích hoạt chiến dịch Quảng cáo cho Merchant (Logic thô: bật/tắt trạng thái hiển thị quảng cáo của quán). | Cao | To Do |
| **BE2** | Viết API thống kê cơ bản cho chủ quán: Đếm tổng số lượt click vào quán và số lượt hiển thị video quảng cáo. | Trung bình| To Do |
| **BE3** | Xây dựng API Lấy Feed Video sử dụng Cursor Pagination (Phân trang dựa trên trường `created_at` để tránh trùng lặp khi cuộn dọc). | Rất Cao | To Do |
| **BE3** | **Thuật toán Trộn Feed:** Viết logic Python lấy 4 video thường từ bảng `videos` và 1 video tài trợ từ bảng `campaigns`, trộn lại theo đúng tỷ lệ 4:1. | Rất Cao | To Do |
| **BE3** | Xử lý tăng số lượt xem quảng cáo (`impressions_count`) trực tiếp bằng một câu lệnh `UPDATE` bất đồng bộ (`background_tasks` của FastAPI). | Cao | To Do |
| **BE4** | **Thuật toán Geo-Search:** Viết câu lệnh SQL kết hợp điều kiện toán học `ILIKE '%từ_khóa%'` và công thức **Haversine** để lọc quán trong bán kính $R$ và trả về khoảng cách. | Rất Cao | To Do |
| **Cả đội** | Túc trực hỗ trợ đội Frontend (Ráp nối API, xử lý lỗi định dạng dữ liệu, chuẩn hóa mã lỗi HTTP). | Rất Cao | To Do |

---

## 🔗 Các điểm nối dữ liệu (Integration DTOs) bắt buộc phải chốt sớm:
1. **Dữ liệu tọa độ (BE2 & BE4):** Thống nhất kiểu dữ liệu trả về cho Frontend là Object chứa cặp số thực: `{ "lat": 10.762, "lng": 106.682 }`.
2. **Cấu trúc mảng Feed (BE3 & BE2):** Đối tượng video quảng cáo được trộn vào Feed phải có cấu trúc giống hệt video tự nhiên nhưng được BE3 bổ sung thêm cờ thuộc tính `"is_ads": true` để Frontend nhận diện hiển thị tag "Được tài trợ".

## ⚠️ Quản trị rủi ro "Sống còn" (Survival Rules):
* **Nguyên tắc "Đóng băng tính năng":** Kể từ ngày thứ 3 của Tuần 1, tuyệt đối không thêm thắt bất kỳ trường dữ liệu hay tính năng nào nằm ngoài bản kế hoạch này.
* **Tận dụng Swagger của FastAPI:** BE không cần viết tài liệu thủ công. Code đến đâu, điền `summary` và `description` trong Decorator của FastAPI đến đó để Frontend tự động lấy tài liệu tại `/docs`.