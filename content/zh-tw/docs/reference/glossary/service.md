---
title: 服務（Service）
id: service
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/service/
short_description: >
  將執行在一組 Pods 上的應用程式公開為網路服務的抽象方法。

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
An abstract way to expose an application running on a set of {{< glossary_tooltip text="Pods" term_id="pod" >}} as a network service.
-->

將執行在一組 {{< glossary_tooltip text="Pods" term_id="pod" >}} 上的應用程式公開為網路服務的抽象方法。

<!--more-->

<!--
 The set of Pods targeted by a Service is (usually) determined by a {{< glossary_tooltip text="selector" term_id="selector" >}}. If more Pods are added or removed, the set of Pods matching the selector will change. The Service makes sure that network traffic can be directed to the current set of Pods for the workload.
-->
服務所針對的 Pod 集（通常）由{{< glossary_tooltip text="選擇算符" term_id="selector" >}}確定。
如果有 Pod 被新增或被刪除，則與選擇算符匹配的 Pod 集合將發生變化。
服務確保可以將網路流量定向到該工作負載的當前 Pod 集合。
