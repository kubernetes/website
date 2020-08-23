---
title: Service
id: service
date: 2018-04-12
full_link: /zh/docs/concepts/services-networking/service/
short_description: >
  将运行在一组 {{< glossary_tooltip text="Pods" term_id="pod" >}} 上的应用程序公开为网络服务的抽象方法。

aka:
tags:
- fundamental
- core-object
---
<!--
An abstract way to expose an application running on a set of {{< glossary_tooltip text="Pods" term_id="pod" >}} as a network service.
-->

将运行在一组 {{< glossary_tooltip text="Pods" term_id="pod" >}} 上的应用程序公开为网络服务的抽象方法。

<!--more-->

<!--
 The set of Pods targeted by a Service is (usually) determined by a {{< glossary_tooltip text="selector" term_id="selector" >}}. If more Pods are added or removed, the set of Pods matching the selector will change. The Service makes sure that network traffic can be directed to the current set of Pods for the workload.
-->
服务所针对的Pod集（通常）由 {{< glossary_tooltip text="selector" term_id="selector" >}} 确定。 如果添加或删除了更多Pod，则与选择器匹配的Pod集将发生变化。 该服务确保可以将网络流量定向到该工作负载的当前Pod集。
