---
title: CRI-O
id: cri-o
date: 2020-03-05
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  Một container runtime nhẹ dành riêng cho Kubernetes
aka:
tags:
- tool
---
Một công cụ giúp bạn sử dụng các OCI container runtime với Kubernetes CRI.

<!--more-->

CRI-O là một thực thi của {{< glossary_tooltip term_id="cri" >}} để cho phép sử dụng các {{< glossary_tooltip text="container" term_id="container" >}} runtime cái mà tương thích với Open Container Initiative (OCI)
[runtime spec](http://www.github.com/opencontainers/runtime-spec).

Triển khai CRI-O cho phép Kubernetes sử dụng bất kì OCI-compliant runtime như container runtime để chạy {{< glossary_tooltip text="Pods" term_id="pod" >}}, và để lấy CRI container image từ các remote registry.
