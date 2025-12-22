---
title: Mixed Version Proxy (MVP)
id: mvp
date: 2023-07-24
full_link: /docs/concepts/architecture/mixed-version-proxy/
short_description: >
  Tính năng cho phép kube-apiserver ủy quyền (proxy) yêu cầu tài nguyên sang một API server ngang hàng khác.
aka: ["MVP"]
tags:
- architecture
---
Tính năng cho phép kube-apiserver ủy quyền (proxy) yêu cầu tài nguyên sang một API server ngang hàng khác.

<!--more-->

Khi một cụm (cluster) có nhiều API server đang chạy các phiên bản Kubernetes khác nhau, tính năng này cho phép các yêu cầu tài nguyên được xử lý bởi API server phù hợp.

MVP bị vô hiệu hóa theo mặc định và có thể được kích hoạt bằng cách bật
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) có tên `UnknownVersionInteroperabilityProxy` khi
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} được khởi chạy.
