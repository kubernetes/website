---
title: API 伺服器
id: kube-apiserver
date: 2018-04-12
full_link: /zh-cn/docs/concepts/architecture/#kube-apiserver
short_description: >
  提供 Kubernetes API 服務的控制面組件。

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
<!--
title: API server
id: kube-apiserver
date: 2018-04-12
full_link: /docs/concepts/architecture/#kube-apiserver
short_description: >
  Control plane component that serves the Kubernetes API.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
-->

<!--
 The API server is a component of the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} that exposes the Kubernetes API.
The API server is the front end for the Kubernetes control plane.
-->
API 伺服器是 Kubernetes {{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的組件，
該組件負責公開了 Kubernetes API，負責處理接受請求的工作。
API 伺服器是 Kubernetes 控制平面的前端。

<!--more-->

<!--
The main implementation of a Kubernetes API server is [kube-apiserver](/docs/reference/generated/kube-apiserver/).
kube-apiserver is designed to scale horizontally&mdash;that is, it scales by deploying more instances.
You can run several instances of kube-apiserver and balance traffic between those instances.
-->
Kubernetes API 伺服器的主要實現是 [kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。
`kube-apiserver` 設計上考慮了水平擴縮，也就是說，它可通過部署多個實例來進行擴縮。
你可以運行 `kube-apiserver` 的多個實例，並在這些實例之間平衡流量。
