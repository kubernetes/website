---
title: 中断
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
中断是导致一个或多个事件{{< glossary_tooltip term_id="pod" text="Pods" >}} 停止服务的事件。
中断会对工作负载资源产生影响，例如{{< glossary_tooltip term_id="deployment" >}}，这取决于受影响的 Pod。

<!--more-->

<!--
If you, as cluster operator, destroy a Pod that belongs to an application,
Kubernetes terms that a _voluntary disruption_. If a Pod goes offline
because of a Node failure, or an outage affecting a wider failure zone,
Kubernetes terms that an _involuntary disruption_.
-->
如果你作为集群运营商销毁了属于某个应用程序的 Pod， Kubernetes 称之为
_自愿中断_。
如果由于节点故障或影响更大故障区域的故障使 Pod 离线，Kubernetes 称这是_非自愿中断_。

<!--
See [Disruptions](/docs/concepts/workloads/pods/disruptions/) for more information.
-->
更多信息，请参看(/docs/concepts/workloads/pods/disruptions/) 。
