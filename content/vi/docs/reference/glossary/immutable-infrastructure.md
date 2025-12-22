---
title: Hạ tầng bất biến (Immutable Infrastructure)
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  Hạ tầng bất biến là kiểu hạ tầng máy tính (máy ảo, container, thiết bị mạng) không được thay đổi sau khi đã triển khai.

aka:
tags:
- architecture
---

Hạ tầng bất biến là kiểu hạ tầng máy tính (máy ảo, container, thiết bị mạng) không thay đổi sau khi đã triển khai.

<!--more-->

Tính “bất biến” có thể được đảm bảo bằng quy trình tự động ghi đè mọi thay đổi không được phép, hoặc bằng một hệ thống vốn dĩ không cho phép thay đổi ngay từ đầu.
{{< glossary_tooltip text="Containers" term_id="container" >}} là ví dụ điển hình: nếu muốn thay đổi giữ được lâu dài thì phải tạo phiên bản container mới, hoặc tạo lại container hiện có từ image của nó.

Nhờ ngăn chặn hay phát hiện thay đổi trái phép, hạ tầng bất biến giúp dễ nhận diện và giảm thiểu rủi ro bảo mật. Vận hành hệ thống cũng “dễ thở” hơn vì quản trị viên có thể giả định rằng không có ai lỡ tay sửa đổi rồi quên báo.

Hạ tầng bất biến thường đi kèm với mô hình Infrastructure as Code (IaC), nơi toàn bộ kịch bản/cấu hình dựng hạ tầng được lưu trong hệ thống quản lý phiên bản (như Git).
Sự kết hợp giữa tính bất biến và quản lý phiên bản tạo ra một nhật ký kiểm toán bền vững cho mọi thay đổi được phép trong hệ thống.