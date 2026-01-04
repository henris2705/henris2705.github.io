
# Hengis — Trang giới thiệu cá nhân (one-page)

Trang dành cho Hengis (tên thật: Bùi Kiến Quốc, quê Đồng Tháp). Thiết kế phong cách pixel/game, màu xanh dương, nhiều animation thân thiện cho người dùng dưới 16 tuổi.

Preview nhanh (từ thư mục repository):

```bash
# chạy web server tĩnh (Python 3):
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

Các tệp chính:
- `index.html` — nội dung trang (hero, giới thiệu, sở thích, gallery, liên hệ)
- `styles.css` — kiểu dáng, pixel texture, mây và animation
- `script.js` — xử lý tabs và các animation nhỏ

Thay ảnh: sửa các URL `https://picsum.photos/seed/...` trong `index.html` hoặc thay bằng ảnh trong thư mục `assets/`.

Changelog nhanh:
- Thêm `heroCanvas` để vẽ các ngôi sao và nhân vật pixel di chuyển.
- Thêm modal ảnh: bấm ảnh để xem chi tiết, bấm backdrop hoặc `Esc` để đóng, hỗ trợ điều hướng bằng phím mũi tên.
- Màu sắc và style phù hợp cho người dùng dưới 16 tuổi, phong cách pixel-game.


