---
title: API server
id: kube-apiserver
date: 2018-04-12
full_link: /docs/reference/generated/kube-apiserver/
short_description: >
  Thành phần điều khiển đáp ứng các Kubernetes API.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
 API server là một thành phần của Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} expose Kubernetes API.
API server là frontend của bộ điều khiển Kubernetes.

<!--more-->

Hiện thực chính của Kubernetes API server là [kube-apiserver](/docs/reference/generated/kube-apiserver/).
kube-apiserver được thiết kế để mở rộng theo chiều ngang&mdash; do đó, nó có thể mở rộng bằng việc triển khai nhiều instance hơn.
Bạn có thể chạy một vài instance của kube-apiserver và cân bằng tải giữa chúng.
