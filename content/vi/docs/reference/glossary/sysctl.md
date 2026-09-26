---
title: sysctl
id: sysctl
full_link: /docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  Một interface để đọc và thiết lập các tham số kernel Unix.

aka:
tags:
- tool
---
`sysctl` là một interface bán chuẩn hóa để đọc hoặc thay đổi các thuộc tính của kernel Unix đang chạy.

<!--more-->

Trên các hệ thống giống Unix, `sysctl` vừa là tên của công cụ mà administrators sử dụng để xem và sửa đổi các thiết lập này, vừa là system call mà công cụ sử dụng.

{{< glossary_tooltip text="Container" term_id="container" >}} runtimes và network plugins có thể phụ thuộc vào các giá trị `sysctl` được thiết lập theo một cách nhất định.
