---
title: 服務（Service）
id: service
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/service/
short_description: >
  將運行在一組 Pods 上的應用程式公開爲網路服務的抽象方法。

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

將運行在一個或一組 {{< glossary_tooltip text="Pod" term_id="pod" >}} 上的網路應用程式公開爲網路服務的方法。

<!--more-->

<!--
The set of Pods targeted by a Service is (usually) determined by a
{{< glossary_tooltip text="selector" term_id="selector" >}}. If more Pods are added or removed,
the set of Pods matching the selector will change. The Service makes sure that network traffic
can be directed to the current set of Pods for the workload.
-->
服務所針對的 Pod 集（通常）由{{< glossary_tooltip text="選擇算符" term_id="selector" >}}確定。
如果有 Pod 被添加或被刪除，則與選擇算符匹配的 Pod 集合將發生變化。
服務確保可以將網路流量定向到該工作負載的當前 Pod 集合。

<!--
Kubernetes Services either use IP networking (IPv4, IPv6, or both), or reference an external name in
the Domain Name System (DNS).

The Service abstraction enables other mechanisms, such as Ingress and Gateway.
-->

Kubernetes Service 要麼使用 IP 網路（IPv4、IPv6 或兩者），要麼引用位於域名系統 (DNS) 中的外部名稱。

Service 的抽象可以實現其他機制，如 Ingress 和 Gateway。
