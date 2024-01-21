---
title: API 服务器
id: kube-apiserver
date: 2018-04-12
full_link: /zh-cn/docs/concepts/overview/components/#kube-apiserver
short_description: >
  提供 Kubernetes API 服务的控制面组件。

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
full_link: /docs/concepts/overview/components/#kube-apiserver
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
API 服务器是 Kubernetes {{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的组件，
该组件负责公开了 Kubernetes API，负责处理接受请求的工作。
API 服务器是 Kubernetes 控制平面的前端。

<!--more-->

<!--
The main implementation of a Kubernetes API server is [kube-apiserver](/docs/reference/generated/kube-apiserver/).
kube-apiserver is designed to scale horizontally&mdash;that is, it scales by deploying more instances.
You can run several instances of kube-apiserver and balance traffic between those instances.
-->
Kubernetes API 服务器的主要实现是 [kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。
`kube-apiserver` 设计上考虑了水平扩缩，也就是说，它可通过部署多个实例来进行扩缩。
你可以运行 `kube-apiserver` 的多个实例，并在这些实例之间平衡流量。
