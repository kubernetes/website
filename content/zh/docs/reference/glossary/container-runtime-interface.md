---
title: 容器运行时接口
id: container-runtime-interface
date: 2021-11-24
full_link: /zh/docs/concepts/architecture/cri
short_description: >
  用于 kubelet 与容器运行时间通信的主要协议。

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
The main protocol for the communication between the kubelet and Container Runtime.
-->
用于 kubelet 与容器运行时间通信的主要协议。

<!--more-->

<!--
The Kubernetes Container Runtime Interface (CRI) defines the main
[gRPC](https://grpc.io) protocol for the communication between the
[cluster components](/docs/concepts/overview/components/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
-->
Kubernetes 容器运行时接口（Container Runtime Interface，CRI）为
[集群组件](/zh/docs/concepts/overview/components/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 与
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}
之间的通信定义其主要的 [gRPC](https://grpc.io) 协议。

