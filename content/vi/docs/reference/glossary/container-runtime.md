---
title: Container Runtime
id: container-runtime
date: 2025-04-22
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
    Container runtime là một phần mềm có nhiệm vụ khởi chạy các container.

aka:
tags:
- fundamental
- workload
---
 Một thành phần cơ bản mà ủy quyền cho Kubernetes chạy các container một cách có hiệu quả.
 Nó chịu trách nhiệm quản lý việc thực thi và vòng đời của các container trong môi trường Kubernetes.

<!--more-->

Kubernetes hỗ trợ các container runtime như
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
và bất kỳ những triển khai nào của [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
