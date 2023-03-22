---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /zh-cn/docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` 是集群中每个节点上运行的网络代理。

aka:
tags:
- fundamental
- networking
---
<!-- ---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /zh-cn/docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` is a network proxy that runs on each node in the cluster.

aka:
tags:
- fundamental
- networking
--- -->
 <!--
 kube-proxy is a network proxy that runs on each
 {{< glossary_tooltip text="node" term_id="node" >}} in your cluster,
 implementing part of the Kubernetes
 {{< glossary_tooltip term_id="service">}} concept.
 -->
[kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)
是集群中每个{{< glossary_tooltip text="节点（node）" term_id="node" >}}上所运行的网络代理，
实现 Kubernetes {{< glossary_tooltip term_id="service">}} 概念的一部分。

<!--more-->

<!-- 
[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
maintains network rules on nodes. These network rules allow network
communication to your Pods from network sessions inside or outside of
your cluster.
-->
kube-proxy 维护节点上的一些网络规则，
这些网络规则会允许从集群内部或外部的网络会话与 Pod 进行网络通信。

<!-- 
kube-proxy uses the operating system packet filtering layer if there is one
and it's available. Otherwise, kube-proxy forwards the traffic itself. 
-->
如果操作系统提供了可用的数据包过滤层，则 kube-proxy 会通过它来实现网络规则。
否则，kube-proxy 仅做流量转发。
