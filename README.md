# LunaFlora — Seasonal Floral Studio

Website HTML/CSS/JavaScript thuần (concept website cho môn học). Không cần cài đặt hay build: mở `index.html` bằng Chrome/Edge, hoặc deploy thẳng lên GitHub Pages.

## Cấu trúc
- `index.html`: toàn bộ nội dung trang chủ.
- `styles.css`: nền tảng (font, màu, layout, responsive). `sections.css`: các section mở rộng, pattern, màu theo mùa.
- `script.js`: dữ liệu 4 workshop, dialog (Details / Booking / About / Contact), form, lịch, dải hoa.
- `assets/fonts/`: LunaFlora + DM Sans. `assets/images/`: ảnh gốc PNG + WebP. `assets/patterns/`: pattern LF-P01, LF-P02. `assets/favicon.svg`.

## Có gì
Hero, 4 season card, How it works, Featured Workshop, lịch sắp tới, dải 16 loài hoa, About + Why seasonal, Big typography, FAQ, CTA, Contact, Footer 4 cột.
Mỗi mùa có dialog riêng (màu theo mùa, mô tả hoa, thông tin, gợi ý mùa khác). Booking: chọn mùa, ngày/giờ đồng bộ, stepper 1–4 khách, tổng tiền, validation + thông báo lỗi, màn hình xác nhận demo.

## Deep link
`#workshop-spring|summer|autumn|winter`, `#book-spring` (giữ workshop đã chọn), `#story`, `#message`. Nút Back của trình duyệt đóng dialog.

## Lưu ý
Ngày, giá, số chỗ, địa chỉ, email, Instagram là dữ liệu DEMO theo brief. Trang không lưu dữ liệu, không gửi email, không nhận đặt chỗ hay thanh toán thật.
