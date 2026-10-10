---
title: cAdvisor
id: cadvisor
full_link: https://github.com/google/cadvisor/
short_description: >
  Công cụ cung cấp thông tin về việc sử dụng tài nguyên và đặc điểm hiệu suất của các container
aka:
tags:
- tool
---
cAdvisor (Container Advisor) cung cấp cho người dùng container thông tin về việc sử dụng {{< glossary_tooltip text="tài nguyên" term_id="infrastructure-resource" >}}
và đặc điểm hiệu suất của các {{< glossary_tooltip text="container" term_id="container" >}} đang chạy.

<!--more-->

Đây là một daemon chạy liên tục để thu thập, tổng hợp, xử lý và xuất thông tin về các container đang chạy. Cụ thể, đối với mỗi container, nó lưu giữ các tham số cách ly tài nguyên, lịch sử sử dụng tài nguyên, biểu đồ lịch sử sử dụng tài nguyên đầy đủ và thống kê mạng. Dữ liệu này được xuất theo từng container và toàn bộ máy.
