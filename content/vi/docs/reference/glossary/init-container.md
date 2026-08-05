---
title: Init Container
id: init-container
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/init-containers/
short_description: >
  Một hoặc nhiều container khởi tạo phải chạy hoàn tất trước khi bất kỳ app container nào chạy.
aka: 
tags:
- fundamental
---
 Một hoặc nhiều {{< glossary_tooltip text="container" term_id="container" >}} khởi tạo phải chạy hoàn tất trước khi bất kỳ app container nào chạy.

<!--more--> 

Container khởi tạo (init container) tương tự như các app container thông thường, với một điểm khác biệt: init container phải chạy hoàn tất trước khi bất kỳ app container nào có thể bắt đầu. Các init container chạy tuần tự: mỗi init container phải chạy hoàn tất trước khi init container tiếp theo bắt đầu.

Khác với {{< glossary_tooltip text="sidecar container" term_id="sidecar-container" >}}, init container không tiếp tục chạy sau khi Pod khởi động.

Để biết thêm thông tin, hãy đọc [init containers](/docs/concepts/workloads/pods/init-containers/).
