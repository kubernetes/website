---
title: Proxy
id: proxy
short_description: >
  Một ứng dụng đóng vai trò trung gian giữa các máy chủ và các máy khách.

aka:
tags:
- networking
---
Trong lĩnh vực máy tính, proxy là một máy chủ trung gian cho một dịch vụ từ xa.

<!--more-->

Máy khách tương tác với proxy; proxy chuyển tiếp dữ liệu của máy khách đến máy chủ thực;
máy chủ thực phản hồi lại cho proxy; proxy chuyển tiếp phản hồi đến máy khách.

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) là một proxy mạng chạy trên mỗi node của cụm, 
là một phần của khái niệm {{< glossary_tooltip term_id="service">}} trong Kubernetes.

Bạn có thể chạy kube-proxy như một dịch vụ userland proxy thông thường. Nếu hệ điều hành hỗ trợ,
kube-proxy cũng có thể chạy ở chế độ hybrid để thực hiện chức năng với ít tài nguyên hơn. 
