---
title: Container Runtime Interface (CRI)
id: cri
full_link: /docs/concepts/architecture/cri
short_description: >
  Giao thức giao tiếp giữa kubelet và container runtime cục bộ.

aka:
tags:
  - fundamental
---

Giao thức chính cho việc giao tiếp giữa {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} và Container Runtime.

<!--more-->

Container Runtime Interface (CRI) của Kubernetes định nghĩa giao thức
[gRPC](https://grpc.io) chính cho việc giao tiếp giữa
[các thành phần node](/docs/concepts/architecture/#node-components) là
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} và
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
