---
title: Pod
id: pod
date: 2019-29-11
full_link: /docs/concepts/workloads/pods/pod-overview/
short_description: >
  Đối tượng nhỏ nhất và đơn giản nhất của Kubernetes. Một Pod đại diện cho một tập các containers đang chạy trên cluster.

aka:
tags:
  - core-object
  - fundamental
---

Đối tượng nhỏ nhất và đơn giản nhất của Kubernetes. Một Pod đại diện cho một tập các {{< glossary_tooltip text="containers" term_id="container" >}} đang chạy trên cluster.

<!--more-->

Một Pod thường được set up để chạy với một container chính yếu. Nó đồng thời có thể chạy kèm với các sidecar containers giúp bổ trợ thêm một số tính năng như thu thập log. Các Pods thường được quản lý bởi một {{< glossary_tooltip term_id="deployment" >}}.
