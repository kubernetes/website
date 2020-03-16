---
title: 干扰
id: disruption
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  导致 Pod 停止服务的事件
aka:
tags:
- fundamental
---
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
-->
<!--
 Disruptions are events that lead to one or more
{{< glossary_tooltip term_id="pod" text="Pods" >}} going out of service.
A disruption has consequences for workload resources, such as
{{< glossary_tooltip term_id="deployment" >}}, that rely on the affected
Pods.
-->
干扰是导致一个或多个 {{< glossary_tooltip term_id="pod" text="Pod" >}} 无法提供服务的事件。
干扰会对依赖于被影响的 Pod 的工作负载资源（例如{{< glossary_tooltip term_id="deployment" >}}）产生影响。

<!--more-->

<!--
If you, as cluster operator, destroy a Pod that belongs to an application,
Kubernetes terms that a _voluntary disruption_. If a Pod goes offline
because of a Node failure, or an outage affecting a wider failure zone,
Kubernetes terms that an _involuntary disruption_.
-->
如果你作为集群的运维人员销毁了属于某个应用程序的 Pod， Kubernetes 称之为
_自愿性干扰_。
如果由于节点故障或影响更大故障区域的故障使 Pod 离线，Kubernetes 称这是 _非自愿干扰_。

<!--
See [Disruptions](/docs/concepts/workloads/pods/disruptions/) for more information.
-->
请参看 [干扰](/docs/concepts/workloads/pods/disruptions/) 以获得更多信息。
