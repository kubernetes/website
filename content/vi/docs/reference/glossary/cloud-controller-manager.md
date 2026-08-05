---
title: Cloud Controller Manager
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Control plane tích hợp Kubernetes với thư viện của các nhà cung cấp cloud.
aka:
tags:
  - architecture
  - operation
---

Đây là một chức năng {{< glossary_tooltip text="control plane" term_id="control-plane" >}} của Kubernetes cho phép nhúng logic điều khiển các cloud-specific(AWS Lambda/Azure Functions). Cloud controller manager cho phép bạn liên kết cluster của mình với API của cloud provider, đồng thời tách biệt các thành phần tương tác với nền tảng đám mây đó ra khỏi các thành phần chỉ tương tác với cụm của bạn.

<!--more-->

Bằng cách tách riêng logic tương tác giữa Kubernetes và hạ tầng cloud bên dưới, thành phần cloud-controller-manager cho phép các nhà cung cấp cloud phát hành các tính năng với nhịp độ khác so với dự án Kubernetes chính.
