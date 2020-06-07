---
title: kube-apiserver
id: kube-apiserver
date: 2018-04-12
full_link: /docs/reference/generated/kube-apiserver/
short_description: >
  主节点上负责提供 Kubernetes API 服务的组件；它是 Kubernetes 控制面的前端。

aka: 
tags:
- architecture
- fundamental
---

<!--
title: kube-apiserver
id: kube-apiserver
date: 2018-04-12
full_link: /docs/reference/generated/kube-apiserver/
short_description: >
  Component on the master that exposes the Kubernetes API. It is the front-end for the Kubernetes control plane. 

aka: 
tags:
- architecture
- fundamental
-->

<!--
 Component on the master that exposes the Kubernetes API. It is the front-end for the Kubernetes control plane. 
-->

主节点上负责提供 Kubernetes API 服务的组件；它是 Kubernetes 控制面的前端。

<!--more--> 

<!--
It is designed to scale horizontally - that is, it scales by deploying more instances. See [Building High-Availability Clusters](/docs/admin/high-availability/).
-->

kube-apiserver 在设计上考虑了水平扩缩的需要。
换言之，通过部署多个实例可以实现扩缩。
参见[构造高可用集群](/docs/admin/high-availability/)。

