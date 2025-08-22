---
title: Kubelet
id: kubelet
date: 2019-11-29
full_link: /docs/reference/generated/kubelet
short_description: >
  Một agent chạy trên mỗi node nằm trong cluster. Nó giúp đảm bảo rằng các containers đã chạy trong một pod.

aka:
tags:
  - fundamental
  - core-object
---

Một agent chạy trên mỗi node nằm trong cluster. Nó giúp đảm bảo rằng các containers đã chạy trong một pod.

<!--more-->

Kubelet sẽ nhận một tập các PodSpecs (đặc tính của Pod) được cung cấp thông qua các cơ chế khác nhau và bảo đảm rằng containers được mô tả trong những PodSpecs này chạy ổn định và khỏe mạnh. Kubelet không quản lý những containers không được tạo bởi Kubernetes.
