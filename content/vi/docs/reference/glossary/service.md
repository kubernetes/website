---
title: Service
id: service
date: 2019-11-30
full_link: /docs/concepts/services-networking/service/
short_description: >
  Một cách để expose một ứng dụng chạy với tập hợp các Pod như một service.

aka:
tags:
- fundamental
- core-object
---
Một cách trừu tượng để expose một ứng dụng đang chạy với tập hợp các {{< glossary_tooltip text="Pods" term_id="pod" >}} như một service.

<!--more-->
 
 Tập hợp các Pod mục tiêu của Service được xác định bởi một {{< glossary_tooltip text="selector" term_id="selector" >}}. Nếu có thêm Pod được thêm vào hoặc gỡ bỏ, tập các Pod tương ứng với selector sẽ thay đổi. Service đảm bảo traffic mạng có thể tới được tập các Pod hiện tại.
