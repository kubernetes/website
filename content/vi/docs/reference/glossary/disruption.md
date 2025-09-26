---
title: Disruption
id: disruption
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Một sự kiện dẫn đến Pod(s) bị ngừng hoạt động
aka:
tags:
- fundamental
---
 Gián đoạn là các sự kiện dẫn đến một hoặc một vài
{{< glossary_tooltip term_id="pod" text="Pods" >}} bị ngừng hoạt động.
Một sự gián đoạn gây ảnh hưởng cho các tài nguyên phụ thuộc vào các Pod bị ảnh hướng,
như là {{< glossary_tooltip term_id="deployment" >}}.

<!--more-->

Nếu bạn, với vai trò là người vận hành, chủ động xóa một Pod thuộc về một ứng dụng,
Kubernetes gọi đó là một gián đoạn tự nguyện (_voluntary disruption_). Nếu một Pod bị mất kết nối
do Node bị lỗi, hoặc do sự cố ảnh hưởng đến vùng hạ tầng lớn hơn,
Kubernetes gọi đó là một gián đoạn không tự nguyện (_involuntary disruption_).

Truy cập [Disruptions](/docs/concepts/workloads/pods/disruptions/) để tìm kiếm được nhiều thông tin hơn.