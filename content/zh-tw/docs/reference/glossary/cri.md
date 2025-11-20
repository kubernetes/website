---
title: 容器運行時介面（Container Runtime Interface；CRI）
id: cri
date: 2021-11-24
full_link: /zh-cn/docs/concepts/architecture/cri
short_description: >
  在 kubelet 和本地容器運行時之間通訊的協議 

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
在 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 與容器運行時之間通信的主要協議。

<!--more-->

<!--
The Kubernetes Container Runtime Interface (CRI) defines the main
[gRPC](https://grpc.io) protocol for the communication between the
[node components](/docs/concepts/architecture/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
-->
Kubernetes 容器運行時介面（CRI）定義了在[節點組件](/zh-cn/docs/concepts/architecture/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
和{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}之間通信的主要
[gRPC](https://grpc.io) 協議。
