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

在 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 与容器运行时之间通信的主要协议。

Kubernetes 容器运行时接口（CRI）定义了在[节点组件](/zh-cn/docs/concepts/architecture/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
和{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}之间通信的主要
[gRPC](https://grpc.io) 协议。
