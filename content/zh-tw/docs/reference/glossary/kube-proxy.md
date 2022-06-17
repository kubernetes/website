---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /zh-cn/docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` 是叢集中每個節點上執行的網路代理。

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
是叢集中每個{{< glossary_tooltip text="節點（node）" term_id="node" >}}所上執行的網路代理，
實現 Kubernetes {{< glossary_tooltip term_id="service">}} 概念的一部分。

<!--more-->

<!-- 
[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
maintains network rules on nodes. These network rules allow network
communication to your Pods from network sessions inside or outside of
your cluster.
-->
kube-proxy 維護節點上的一些網路規則，
這些網路規則會允許從叢集內部或外部的網路會話與 Pod 進行網路通訊。

<!-- 
kube-proxy uses the operating system packet filtering layer if there is one
and it's available. Otherwise, kube-proxy forwards the traffic itself. 
-->
如果作業系統提供了可用的資料包過濾層，則 kube-proxy 會透過它來實現網路規則。
否則，kube-proxy 僅做流量轉發。
