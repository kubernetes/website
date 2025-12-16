---
title: Pod 水平自动扩缩器
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  此对象根据目标资源利用率或自定义度量目标自动扩缩 Pod 副本的数量。

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
  Object that automatically scales the number of pod replicas based on targeted resource utilization or custom metric targets.

aka: 
- HPA
tags:
- operation
-->

<!--
An {{< glossary_tooltip text="object" term_id="object" >}} that automatically scales the number of {{< glossary_tooltip term_id="pod" >}} replicas,
based on targeted {{< glossary_tooltip text="resource" term_id="infrastructure-resource" >}} utilization or custom metric targets.
-->
此{{< glossary_tooltip text="对象" term_id="object" >}}根据目标{{< glossary_tooltip text="资源" term_id="infrastructure-resource" >}}利用率或自定义度量目标自动扩缩
{{< glossary_tooltip term_id="pod" >}} 副本的数量。

<!--more--> 

<!--
HorizontalPodAutoscaler (HPA) is typically used with {{< glossary_tooltip text="Deployments" term_id="deployment" >}}, or {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}. It cannot be applied to objects that cannot be scaled, for example {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
-->
HorizontalPodAutoscaler (HPA) 通常用于
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 
或者 {{< glossary_tooltip text="ReplicaSet" term_id="replica-set" >}} 上。
HPA 不能用于不支持扩缩的对象，例如 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}。
