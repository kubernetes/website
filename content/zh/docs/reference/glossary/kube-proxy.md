---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/generated/kube-proxy
short_description: >
  `kube-proxy` 是集群中每个节点上运行的网络代理。

aka: 
tags:
- fundamental
- core-object
---

<!--
---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/generated/kube-proxy
short_description: >
  `kube-proxy` is a network proxy that runs on each node in the cluster.

aka: 
tags:
- fundamental
- core-object
---
-->

<!--
 `kube-proxy` is a network proxy that runs on each node in the cluster.
-->

`kube-proxy` 是集群中每个节点上运行的网络代理。

<!--more--> 

<!--
`kube-proxy` is responsible for request forwarding. `kube-proxy` allows TCP and UDP stream forwarding or round robin TCP and UDP forwarding across a set of backend functions.
-->

`kube-proxy` 负责转发请求。`kube-proxy` 涵盖了一系列的后端功能，允许 TCP 和 UDP 流转发或轮询。
