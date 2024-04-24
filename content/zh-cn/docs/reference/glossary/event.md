---
title: 事件（Event）
id: event
date: 2022-01-16
full_link: /zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
  事件（Event）是描述系统中某些状态变化的 Kubernetes 对象。 
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
   Events are Kubernetes objects that describe some state change in the system.
aka: 
tags:
- core-object
- fundamental
-->

<!--
Event is a Kubernetes object that describes state change/notable occurrences in the system.
-->
事件（Event）是描述系统状态变化以及需要注意的事情的 Kubernetes 对象。

<!--more-->

<!--
Events have a limited retention time and triggers and messages may evolve with time. 
Event consumers should not rely on the timing of an event with a given reason reflecting a consistent underlying trigger, 
or the continued existence of events with that reason. 
-->
事件的保留时间有限，随着时间推进，其触发方式和消息都可能发生变化。
事件用户不应该对带有给定原因（反映下层触发源）的时间特征有任何依赖，
也不要寄希望于该原因所造成的事件会一直存在。

<!--
Events should be treated as informative, best-effort, supplemental data.
-->
事件应该被视为一种告知性质的、尽力而为的、补充性质的数据。

<!--
In Kubernetes, [auditing](/docs/tasks/debug/debug-cluster/audit/) generates a different kind of
Event record (API group `audit.k8s.io`).
-->
在 Kubernetes 中，
[审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/)机制会生成一种不同类别的
Event 记录（API 组为 `audit.k8s.io`）。
