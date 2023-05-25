---
title: 服务（Service）
id: service
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/service/
short_description: >
  将运行在一组 Pods 上的应用程序公开为网络服务的抽象方法。

aka:
tags:
- fundamental
- core-object
---

<!--
---
title: Service
id: service
date: 2018-04-12
full_link: /docs/concepts/services-networking/service/
short_description: >
  A way to expose an application running on a set of Pods as a network service.

aka:
tags:
- fundamental
- core-object
---
-->

<!--
A method for exposing a network application that is running as one or more
{{< glossary_tooltip text="Pods" term_id="pod" >}} in your cluster.
-->

将运行在一个或一组 {{< glossary_tooltip text="Pod" term_id="pod" >}} 上的网络应用程序公开为网络服务的方法。

<!--more-->

<!--
The set of Pods targeted by a Service is (usually) determined by a
{{< glossary_tooltip text="selector" term_id="selector" >}}. If more Pods are added or removed,
the set of Pods matching the selector will change. The Service makes sure that network traffic
can be directed to the current set of Pods for the workload.
-->
服务所针对的 Pod 集（通常）由{{< glossary_tooltip text="选择算符" term_id="selector" >}}确定。
如果有 Pod 被添加或被删除，则与选择算符匹配的 Pod 集合将发生变化。
服务确保可以将网络流量定向到该工作负载的当前 Pod 集合。

<!--
Kubernetes Services either use IP networking (IPv4, IPv6, or both), or reference an external name in
the Domain Name System (DNS).

The Service abstraction enables other mechanisms, such as Ingress and Gateway.
-->

Kubernetes Service 要么使用 IP 网络（IPv4、IPv6 或两者），要么引用位于域名系统 (DNS) 中的外部名称。

Service 的抽象可以实现其他机制，如 Ingress 和 Gateway。
