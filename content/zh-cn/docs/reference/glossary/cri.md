---
title: 容器运行时接口（Container Runtime Interface；CRI）
id: cri
date: 2021-11-24
full_link: /zh-cn/docs/concepts/architecture/cri
short_description: >
  在 kubelet 和本地容器运行时之间通讯的协议 

aka:
tags:
  - fundamental
---
<!--
title: Container Runtime Interface (CRI)
id: cri
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  Protocol for communication between the kubelet and the local container runtime.

aka:
tags:
  - fundamental
-->

<!--
The main protocol for the communication between the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and Container Runtime.
-->
在 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 与容器运行时之间通信的主要协议。

<!--more-->

<!--
The Kubernetes Container Runtime Interface (CRI) defines the main
[gRPC](https://grpc.io) protocol for the communication between the
[node components](/docs/concepts/architecture/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
-->
Kubernetes 容器运行时接口（CRI）定义了在[节点组件](/zh-cn/docs/concepts/architecture/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
和{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}之间通信的主要
[gRPC](https://grpc.io) 协议。
