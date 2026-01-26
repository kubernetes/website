---
title: Lớp tổng hợp (Aggregation Layer)
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  Lớp tổng hợp cho phép bạn cài đặt các API theo kiểu Kubernetes bổ sung trong cụm của mình.

aka: 
tags:
- architecture
- extension
- operation
---
Lớp tổng hợp cho phép bạn cài đặt bổ sung các API tương tự Kubernetes API trong cụm của mình.

<!--more-->

Khi bạn đã cấu hình {{< glossary_tooltip text="Kubernetes API Server" term_id="kube-apiserver" >}} để [hỗ trợ các API bổ sung](/docs/tasks/extend-kubernetes/configure-aggregation-layer/), bạn có thể thêm các đối tượng `APIService` để "đăng ký" một đường dẫn URL trong Kubernetes API.
