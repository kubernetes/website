---
title: Volume
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  Một thư mục chứa dữ liệu, có thể truy cập tới các container trong một pod.

aka:
tags:
- fundamental
---
 Một thư mục chứa dữ liệu, có thể truy cập tới các {{< glossary_tooltip text="container" term_id="container" >}} trong một {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Một Kubernetes volume tồn tại cùng với Pod sử dụng nó. Do đó, một volume tồn tại lâu hơn bất kỳ container nào chạy trong Pod, và dữ liệu trong volume được bảo toàn qua các lần container tái khởi động.

Xem [kho lưu trữ](/docs/concepts/storage/) để biết thêm thông tin.
