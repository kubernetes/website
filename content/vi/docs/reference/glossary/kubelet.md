---
title: Kubelet
id: kubelet
date: 2019-29-11
full_link: /docs/reference/generated/kubelet
short_description: >
  Một agent chạy trên mỗi node nằm trong cluster. Nó giúp đảm bảo rằng các containers đã chạy ổn định trong pod.

aka:
tags:
  - fundamental
  - core-object
---

Một agent chạy trên mỗi node nằm trong cluster. Nó giúp đảm bảo rằng các containers đã chạy ổn định trong pod.

<!--more-->

Kubelet sẽ nhận một tập các PodSpecs (đặc tính của Pod) được cung cấp từ một số cơ chế và bảo đảm rằng containers được mô tả trong những PodSpecs này chạy ổn định và khỏe mạnh. Kubelet không quản lý những containers không được tạo bởi Kubernetes.
