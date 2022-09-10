---
title: Pod 水平自动扩缩器（Horizontal Pod Autoscaler）
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  Pod 水平自动扩缩器（Horizontal Pod Autoscaler）是一种 API 资源，它根据目标 CPU 利用率或自定义度量目标扩缩 Pod 副本的数量。

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
Pod 水平自动扩缩器（Horizontal Pod Autoscaler）是一种 API 资源，它根据目标 CPU 利用率或自定义度量目标扩缩 {{< glossary_tooltip term_id="pod" >}} 副本的数量。

<!--more--> 

<!--
HPA is typically used with {{< glossary_tooltip text="ReplicationControllers" term_id="replication-controller" >}}, {{< glossary_tooltip text="Deployments" term_id="deployment" >}}, or {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}. It cannot be applied to objects that cannot be scaled, for example {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
-->
HPA 通常用于 {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}
、{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 
或者 {{< glossary_tooltip text="ReplicaSet" term_id="replica-set" >}} 上。
HPA 不能用于不支持扩缩的对象，例如 {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}。
