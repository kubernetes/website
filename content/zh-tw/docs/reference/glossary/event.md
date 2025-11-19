---
title: 事件（Event）
id: event
date: 2022-01-16
full_link: /zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
  描述叢集中某些狀態變化的 Kubernetes 對象。
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
   Kubernetes objects that describe some state change in the cluster.
aka: 
tags:
- core-object
- fundamental
-->

<!--
A Kubernetes {{< glossary_tooltip text="object" term_id="object" >}} that describes state changes
or notable occurrences in the cluster.
-->
一個 Kubernetes {{< glossary_tooltip text="對象" term_id="object" >}}，
描述叢集中的狀態狀態變化或需要注意的事件。
<!--more-->

<!--
Events have a limited retention time and triggers and messages may evolve with time.
Event consumers should not rely on the timing of an event with a given reason reflecting a consistent underlying trigger,
or the continued existence of events with that reason.
-->
事件的保留時間有限，隨着時間推進，其觸發方式和消息都可能發生變化。
事件使用者不應該對帶有給定原因（反映下層觸發源）的時間特徵有任何依賴，
也不要寄希望於該原因所造成的事件會一直存在。

<!--
Events should be treated as informative, best-effort, supplemental data.
-->
事件應該被視爲一種告知性質的、盡力而爲的、補充性質的數據。

<!--
In Kubernetes, [auditing](/docs/tasks/debug/debug-cluster/audit/) generates a different kind of
Event record (API group `audit.k8s.io`).
-->
在 Kubernetes 中，
[審計](/zh-cn/docs/tasks/debug/debug-cluster/audit/)機制會生成一種不同類別的
Event 記錄（API 組爲 `audit.k8s.io`）。
