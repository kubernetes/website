---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  Công cụ cung cấp hiểu biết về việc sử dụng tài nguyên và đặc điểm hiệu suất cho các container
aka:
tags:
- tool
---
cAdvisor (Container Advisor) cung cấp cho người dùng container sự hiểu biết về việc sử dụng tài nguyên và các đặc điểm hiệu suất của các {{< glossary_tooltip text="container" term_id="container" >}} đang chạy.

<!--more-->

Đây là một daemon thu thập, tổng hợp, xử lý, và đưa ra thông tin về các container đang chạy. Cụ thể, đối với mỗi container, nó lưu giữ các tham số tài nguyên tách biệt, lịch sử mức sử dụng tài nguyên, biểu đồ tần suất về toàn bộ lịch sử sử dụng tài nguyên và số liệu thống kê network. Dữ liệu này được xuất theo container và trên toàn máy.
