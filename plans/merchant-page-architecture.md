## Kế hoạch Kiến trúc Thiết kế Trang Thương nhân

### 1. Đọc Thiết kế và Mục tiêu
*   **Loại trang:** Trang chi tiết thương nhân (nhà hàng/quán cà phê).
*   **Đối tượng:** Người dùng cuối tìm kiếm và tương tác với các thương nhân.
*   **Phong cách:** Sang trọng, cao cấp, hiện đại, **đồng bộ nghiêm ngặt với phong cách hiện có của FoodieGram, bao gồm Shadcn UI "New York" style, bảng màu `oklch` (cam/hổ phách là màu nhấn chính), kiến trúc "Double-Bezel" và các hiệu ứng chuyển động `cubic-bezier` tùy chỉnh.**
*   **Hướng thiết kế:** Tận dụng tối đa các tiện ích Tailwind CSS, Shadcn UI và tuân thủ các nguyên tắc thiết kế đã được cấu trúc trong dự án hiện tại. Mọi attribute mới sẽ được giải thích rõ ràng.

### 2. Các Thông số Thiết kế Chính
*   `DESIGN_VARIANCE: 8` (Bento không đối xứng, bố cục động, tuân thủ `lg:grid lg:grid-cols-12` và các điểm dừng di động hiện có).
*   `MOTION_INTENSITY: 7` (Chuyển động mượt mà, hiệu ứng cuộn, tương tác từ tính, **sử dụng lại các `keyframes` `slideUp`, `fadeIn` và `cubic-bezier` hiện có**).
*   `VISUAL_DENSITY: 3` (Không gian thoáng đãng, tuân thủ `py-24` đến `py-40` cho khoảng cách giữa các phần).

### 3. Vibe & Texture Archetype: Kết hợp Editorial Luxury và Ethereal Glass (đã điều chỉnh)
*   **Nền:** Sử dụng bảng màu `oklch` hiện có được định nghĩa trong `frontend/app/globals.css`, với **`bg-[#FAF9F6]/98` (light mode) và `bg-[#0A0A0A]/95` (dark mode)** như đã thấy trong modal chi tiết bài đăng.
*   **Kiểu chữ:** Tiếp tục sử dụng các phông chữ **`Geist` và `Geist Mono`** (`--font-sans`, `--font-mono` trong `globals.css`) cho tiêu đề và nội dung.
*   **Thành phần:** Tích hợp các hiệu ứng gradient nền (radial mesh) tinh tế (từ modal chi tiết bài đăng) và áp dụng kiến trúc "Double-Bezel" cho các thẻ và phần tử tương tác chính, sử dụng các lớp CSS như `p-1 bg-white/5 dark:bg-black/15 border border-white/10 dark:border-white/5 rounded-2xl shadow-lg backdrop-blur-md` (vỏ ngoài) và `p-3.5 rounded-[calc(1rem-2px)] bg-card/65 dark:bg-card/45 shadow-inner` (lõi bên trong) từ `page.tsx`.
*   **Mục tiêu:** Tạo trải nghiệm người dùng cao cấp, độc đáo, thể hiện sự tinh tế trong ẩm thực và dịch vụ, đồng thời duy trì sự nhất quán hoàn toàn với ngôn ngữ thiết kế của ứng dụng hiện tại thông qua việc sử dụng lại các thuộc tính và cấu trúc CSS đã có.

### 4. Layout Archetype: The Asymmetrical Bento (đã điều chỉnh)
*   **Cấu trúc:** Sử dụng lưới CSS (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` hoặc tương tự) với các kích thước thẻ Shadcn `Card` khác nhau để hiển thị đa dạng thông tin về thương nhân. Các lớp `col-span-X` sẽ được áp dụng để tạo bố cục không đối xứng, tương tự như ví dụ trong `high-end-visual-design` nhưng với các khoảng cách và kích thước đã được xác định của dự án.
*   **Di động:** Chuyển về bố cục một cột (`grid-cols-1`) với khoảng cách dọc rộng rãi (`gap-6`). Tất cả các thuộc tính `col-span` sẽ được đặt lại thành `col-span-1` dưới `768px` (`md:` breakpoint hiện có).
*   **Lợi ích:** Trình bày động các khối thông tin khác nhau (hình ảnh anh hùng, điểm nổi bật của menu, địa chỉ, đánh giá, ảnh) một cách hấp dẫn về mặt thị giác, đồng thời tuân thủ cấu trúc bố cục phản hồi hiện có.

### 5. Các Phần và Tính năng Cốt lõi (sử dụng các thành phần và thuộc tính hiện có)

#### 5.1. Phần Anh hùng (Hero Section)
*   **Hình ảnh/Video:** Nền lớn, chất lượng cao. Sử dụng thẻ `Image` của Next.js với các lớp `object-cover` và `aspect-ratio` để kiểm soát kích thước.
*   **Tên Thương nhân:** Hiển thị với typography lớn, đậm. Sử dụng các lớp `text-4xl md:text-6xl font-black tracking-tight leading-none` và màu gradient như `bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent` từ logo FoodieGram.
*   **Đánh giá & Loại hình Ẩm thực:** Sử dụng Shadcn `Badge` hoặc `Item` với các lớp `text-xs font-semibold` và màu cam/hổ phách để hiển thị xếp hạng và loại hình ẩm thực, tương tự như các thẻ thông tin trong `FoodPost`.
*   **Địa chỉ & Giờ hoạt động:** Văn bản đơn giản với `text-sm text-muted-foreground`.
*   **CTA Chính:** `Button` Shadcn với `variant="default"` hoặc `variant="outline"`. Các lớp như `px-6 py-3 rounded-full text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors active:scale-95` cho nút chính và `variant="ghost" border border-primary/20 hover:bg-primary/10` cho nút phụ.
    *   **Biểu tượng lồng ghép:** Sử dụng `Lucide-react` và các lớp như `w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center` cho biểu tượng mũi tên lồng ghép.

#### 5.2. Phần Giới thiệu (About Section)
*   Văn bản `p className="text-base text-foreground leading-relaxed max-w-[65ch]"`.
*   Hình ảnh nhỏ, tinh tế: Sử dụng Shadcn `Avatar` hoặc thẻ `Image` với `rounded-xl` và `shadow-sm`.

#### 5.3. Các Điểm nổi bật/Danh mục Menu
*   **Lưới Bento:** Sử dụng `div` với `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` để tạo bố cục.
*   **Thẻ món ăn:** Mỗi món ăn là một Shadcn `Card` được tùy chỉnh với kiến trúc "Double-Bezel" đã mô tả ở trên. Nội dung bên trong bao gồm `Image` sản phẩm, `h4 className="font-extrabold text-sm"` cho tên, `span className="text-xs text-muted-foreground"` cho giá và mô tả.
*   **Bộ lọc:** Sử dụng `CategoryFilter` hiện có (`frontend/components/category-filter.tsx`) hoặc `Tabs` Shadcn.
*   **CTA `Xem toàn bộ Menu`:** `Button` Shadcn với `variant="outline"` và biểu tượng `ChevronRight` từ Lucide.

#### 5.4. Thư viện / Hình ảnh (Gallery / Visuals)
*   **Hiệu ứng cuộn:** Sử dụng các lớp `animate-slide-up-slow` hoặc `animate-fade-in` cho các hình ảnh khi chúng xuất hiện trong khung nhìn. Có thể tích hợp `Carousel` Shadcn cho bộ sưu tập ảnh cuộn ngang.
*   **Hình ảnh:** Thẻ `Image` của Next.js với các lớp `rounded-2xl shadow-md border border-border/30` như đã thấy trong modal bài đăng.

#### 5.5. Đánh giá Khách hàng / Lời chứng thực
*   **Lưới thẻ đánh giá:** Tương tự như lưới Bento, sử dụng Shadcn `Card` tùy chỉnh với kiến trúc "Double-Bezel".
*   **Nội dung đánh giá:** `p className="text-sm italic leading-relaxed"` cho trích dẫn, `span className="font-semibold text-muted-foreground"` cho tên khách hàng và ngày.
*   **CTA `Đọc tất cả đánh giá`:** `Button` Shadcn với `variant="link"`.

#### 5.6. Vị trí & Liên hệ
*   **Bản đồ:** Tích hợp `MapView` (`frontend/components/map-view.tsx`).
*   **Thông tin:** Văn bản đơn giản (`text-sm text-foreground`) với các biểu tượng `MapPin`, `Phone`, `Mail` từ Lucide-react.
*   **Mạng xã hội:** Các biểu tượng `Lucide-react` bọc trong các nút `Button` Shadcn `variant="ghost"` với `rounded-full` và `hover:bg-secondary`.

#### 5.7. Khuyến mãi / Ưu đãi đặc biệt (Tùy chọn)
*   **Thẻ khuyến mãi:** Shadcn `Card` hoặc `Alert` với các lớp `bg-primary/10 border-primary/20` để nổi bật, chứa văn bản mô tả ưu đãi.

### 6. Các Nguyên tắc Thiết kế Cao cấp được Áp dụng (Đã tinh chỉnh)

*   **Typography:** Sử dụng phông chữ **`Geist`** cho tiêu đề (`text-4xl md:text-6xl font-black tracking-tight leading-none`) và **`Geist Mono`** cho các đoạn code hoặc dữ liệu. Body text sử dụng các lớp như `text-base text-foreground leading-relaxed max-w-[65ch]`.
*   **Color Palette:** Tuân thủ bảng màu **`oklch`** từ `frontend/app/globals.css`. Màu cam/hổ phách là màu nhấn chính (`text-orange-500`, `bg-orange-500/10`, `--primary`). Sử dụng `--background`, `--card`, `--foreground`, `--muted-foreground` từ hệ thống biến CSS hiện có để đảm bảo chế độ sáng/tối nhất quán.
*   **Layout:** Bố cục "The Asymmetrical Bento" được xây dựng với **CSS Grid và các lớp Tailwind `col-span-X`**. Đảm bảo **gấp lại di động mạnh mẽ** thành `w-full`, `px-4`, `py-8` dưới `768px` (`md:` breakpoint).
*   **Materiality:** Kiến trúc **"Double-Bezel"** cho các thẻ và phần tử tương tác, sử dụng các lớp `rounded-[2.5rem]`, `p-2 bg-gradient-to-tr from-amber-500/10 via-white/15 to-orange-500/10 dark:from-amber-950/20 dark:via-black/40 dark:to-orange-950/20 border border-white/30 dark:border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.55)] rounded-[2.5rem] backdrop-blur-3xl` (vỏ ngoài) và `rounded-[calc(2.5rem-8px)] bg-[#FAF9F6]/98 dark:bg-[#0A0A0A]/95 overflow-hidden border border-white/5 shadow-inner` (lõi bên trong) như trong modal chi tiết bài đăng. Sử dụng `backdrop-blur-md` hoặc `backdrop-blur-3xl` như hiện có.
*   **Interactive Elements:** Các nút CTA hình viên thuốc Shadcn `Button` với `rounded-full` và `px-6 py-3`. Sử dụng cấu trúc biểu tượng lồng ghép "Button-in-Button" (ví dụ: `w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center`). Vật lý di chuột từ tính và chuyển động `scale` sử dụng các `transition-all duration-XXX ease-[cubic-bezier(...)]` hiện có (ví dụ: `ease-[cubic-bezier(0.34,1.56,0.64,1)]`).
*   **Spatial Rhythm:** Khoảng đệm dọc rộng rãi (`py-24` đến `py-40`) giữa các phần. Các thẻ "eyebrow" nhỏ, hình viên thuốc sử dụng các lớp như `font-bold text-xs text-muted-foreground/60 uppercase tracking-wider` từ sidebar hiện có.
*   **Motion Choreography:** Sử dụng lại **custom `keyframes` `slideUp`, `fadeIn` và `cubic-bezier`** từ `globals.css` và `page.tsx`. Cuộn nội suy (Entry Animations) sử dụng `motion/react` `whileInView` hoặc các lớp `animate-slide-up-slow`, `animate-fade-in`.
*   **Hiệu suất:** Chỉ tạo hiệu ứng cho `transform` và `opacity`. Tuân thủ `prefers-reduced-motion`.
*   **Khả năng truy cập:** Thiết kế cho cả chế độ sáng và tối, đảm bảo độ tương phản WCAG AA (`oklch` đã được cấu hình).
*   **Tài sản hình ảnh:** Next.js `Image` với `object-cover`, `object-contain`, `fill` và `priority` khi cần thiết. Placeholder `picsum.photos` cho đến khi có ảnh thật.
*   **Icons:** Sử dụng **Lucide-react** cho tất cả các biểu tượng.

### 7. Minh họa Bố cục (Mermaid Diagram)

```mermaid
graph TD
    A[Trang Thương nhân] --> B(Hero Section)
    B --> C(About Section)
    C --> D{Menu Highlights/Categories}
    D --> E[Gallery / Visuals]
    E --> F{Customer Reviews}
    F --> G(Location & Contact)
    G --> H(Promotions / Specials - Optional)

    subgraph Hero Section
        B1[Tên Thương nhân, Đánh giá]
        B2[Thông tin & CTA chính]
    end

    subgraph Menu Highlights/Categories
        D1[Món ăn phổ biến (Bento Grid)]
        D2[Bộ lọc danh mục]
        D3[CTA: Xem toàn bộ Menu]
    end

    subgraph Customer Reviews
        F1[Thẻ đánh giá (Bento Grid)]
        F2[Tóm tắt đánh giá]
        F3[CTA: Đọc tất cả đánh giá]
    end

    style A fill:#ECEFF1,stroke:#333,stroke-width:2px;
    style B fill:#C8E6C9,stroke:#333,stroke-width:2px;
    style C fill:#BBDEFB,stroke:#333,stroke-width:2px;
    style D fill:#FFECB3,stroke:#333,stroke-width:2px;
    style E fill:#F8BBD0,stroke:#333,stroke-width:2px;
    style F fill:#D1C4E9,stroke:#333,stroke-width:2px;
    style G fill:#FFE0B2,stroke:#333,stroke-width:2px;
    style H fill:#CFD8DC,stroke:#333,stroke-width:2px;
```

Kế hoạch này đảm bảo việc sử dụng **đúng các attribute đã được cấu trúc và tránh các attribute thừa**, bằng cách tham chiếu trực tiếp các thành phần, lớp CSS và biến thiết kế hiện có của dự án FoodieGram. Khi bạn chấp thuận, chúng ta sẽ chuyển sang chế độ Code để bắt đầu triển khai.