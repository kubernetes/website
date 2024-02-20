---
title: 容器运行时接口（Container Runtime Interface）
id: container-runtime-interface
date: 2021-11-24
full_link: /zh-cn/docs/concepts/architecture/cri
short_description: >
  kubelet 和容器运行时之间通信的主要协议。

aka:
tags:
  - cri
---
<!--
title: Container Runtime Interface
id: container-runtime-interface
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  The main protocol for the communication between the kubelet and Container Runtime.

aka:
tags:
  - cri
-->

<!--
The main protocol for the communication between the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and Container Runtime.
-->
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 和容器运行时之间通信的主要协议。

<!--more-->

<!-- 
The Kubernetes Container Runtime Interface (CRI) defines the main
[gRPC](https://grpc.io) protocol for the communication between the
[node components](/docs/concepts/overview/components/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
-->
Kubernetes 容器运行时接口（Container Runtime Interface；CRI）定义了主要 [gRPC](https://grpc.io) 协议，
用于[节点组件](/zh-cn/docs/concepts/overview/components/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
和{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}之间的通信。
