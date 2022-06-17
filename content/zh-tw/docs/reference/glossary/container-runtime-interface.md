---
title: 容器執行時介面
id: container-runtime-interface
date: 2021-11-24
full_link: /zh-cn/docs/concepts/architecture/cri
short_description: >
  kubelet 和容器執行時之間通訊的主要協議。

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

<!-- The main protocol for the communication between the kubelet and Container Runtime. -->
kubelet 和容器執行時之間通訊的主要協議。

<!--more-->

<!-- 
The Kubernetes Container Runtime Interface (CRI) defines the main
[gRPC](https://grpc.io) protocol for the communication between the
[cluster components](/docs/concepts/overview/components/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
-->
Kubernetes 容器執行時介面（CRI）定義了主要 [gRPC](https://grpc.io) 協議，
用於[叢集元件](/zh-cn/docs/concepts/overview/components/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 和
{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}。