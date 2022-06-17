---
title: 干擾（Disruption）
id: disruption
date: 2019-09-10
full_link: /zh-cn/docs/concepts/workloads/pods/disruptions/
short_description: >
   導致 Pod 服務停止的事件。
aka:
tags:
- fundamental
---
 干擾是指導致一個或者多個 {{< glossary_tooltip term_id="pod" text="Pod" >}} 服務停止的事件。
干擾會影響工作負載資源，比如 {{< glossary_tooltip term_id="deployment" >}} 這種依賴於受影響 Pod 的資源。

<!-- 
---
title: Disruption
id: disruption
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  An event that leads to Pod(s) going out of service
aka:
tags:
- fundamental
---
 Disruptions are events that lead to one or more
{{< glossary_tooltip term_id="pod" text="Pods" >}} going out of service.
A disruption has consequences for workload resources, such as
{{< glossary_tooltip term_id="deployment" >}}, that rely on the affected
Pods.
 -->

<!--more-->

<!-- 
If you, as cluster operator, destroy a Pod that belongs to an application,
Kubernetes terms that a _voluntary disruption_. If a Pod goes offline
because of a Node failure, or an outage affecting a wider failure zone,
Kubernetes terms that an _involuntary disruption_.

See [Disruptions](/docs/concepts/workloads/pods/disruptions/) for more information.
 -->
如果你作為一個叢集操作人員，銷燬了一個從屬於某個應用的 Pod, Kubernetes 視之為**自願干擾（Voluntary Disruption）**。
如果由於節點故障 或者影響更大區域故障的斷電導致 Pod 離線，kubernetes 視之為**非願干擾（Involuntary Disruption）**。

更多資訊請查閱[Disruptions](/zh-cn/docs/concepts/workloads/pods/disruptions/)