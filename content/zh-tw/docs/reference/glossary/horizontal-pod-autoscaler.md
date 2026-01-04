---
title: Pod 水平自動擴縮器（Horizontal Pod Autoscaler）
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  Pod 水平自動擴縮器（Horizontal Pod Autoscaler）是一種 API 資源，它根據目標 CPU 利用率或自定義度量目標擴縮 Pod 副本的數量。

aka: 
- HPA
tags:
- operation
---
<!--
title: Horizontal Pod Autoscaler
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  An API resource that automatically scales the number of pod replicas based on targeted CPU utilization or custom metric targets.

aka: 
- HPA
tags:
- operation
-->

<!--
 An API resource that automatically scales the number of {{< glossary_tooltip term_id="pod" >}} replicas based on targeted CPU utilization or custom metric targets.
-->
Pod 水平自動擴縮器（Horizontal Pod Autoscaler）是一種 API 資源，它根據目標 CPU 利用率或自定義度量目標擴縮 {{< glossary_tooltip term_id="pod" >}} 副本的數量。

<!--more--> 

<!--
HPA is typically used with {{< glossary_tooltip text="ReplicationControllers" term_id="replication-controller" >}}, {{< glossary_tooltip text="Deployments" term_id="deployment" >}}, or {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}. It cannot be applied to objects that cannot be scaled, for example {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
-->
HPA 通常用於 {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}
、{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 
或者 {{< glossary_tooltip text="ReplicaSet" term_id="replica-set" >}} 上。
HPA 不能用於不支持擴縮的對象，例如 {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}。
