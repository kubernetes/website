---
title: 事件（Event）
id: event
date: 2022-01-16
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   對叢集中周處發生的事件的報告。通常用來表述系統中某種狀態變更。
aka: 
tags:
- core-object
- fundamental
---

<!--
title: Event
id: event
date: 2022-01-16
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   A report of an event somewhere in the cluster. It generally denotes some state change in the system.
aka: 
tags:
- core-object
- fundamental
-->

<!--
Each Event is a report of an event somewhere in the {{< glossary_tooltip text="cluster" term_id="cluster" >}}.
It generally denotes some state change in the system.
-->
每個 Event 是{{< glossary_tooltip text="叢集" term_id="cluster" >}}中某處發生的事件的報告。
它通常用來表述系統中的某種狀態變化。

<!--more-->

<!--
Events have a limited retention time and triggers and messages may evolve with time. 
Event consumers should not rely on the timing of an event with a given reason reflecting a consistent underlying trigger, 
or the continued existence of events with that reason. 
-->
事件的保留時間有限，隨著時間推進，其觸發方式和訊息都可能發生變化。
事件使用者不應該對帶有給定原因（反映下層觸發源）的時間特徵有任何依賴，
也不要寄希望於對應該原因的事件會一直存在。

<!--
Events should be treated as informative, best-effort, supplemental data.
-->
事件應該被視為一種告知性質的、盡力而為的、補充性質的資料。

<!--
In Kubernetes, [auditing](/docs/tasks/debug/debug-cluster/audit/) generates a different kind of
Event record (API group `audit.k8s.io`).
-->
在 Kubernetes 中，[審計](/zh-cn/docs/tasks/debug/debug-cluster/audit/)
機制會生成一種不同種類的 Event 記錄（API 組為 `audit.k8s.io`）。

