---
title: Horizontal Pod Autoscaler
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /ja/docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  水平Pod自動スケーラーは、ターゲットCPU使用率またはカスタムメトリクスターゲットに基づいて、Podのレプリカ数をスケーリングするAPIリソースです。

aka: 
- HPA
tags:
- operation
---
水平Pod自動スケーラーは、ターゲットCPU使用率またはカスタムメトリクスターゲットに基づいて{{< glossary_tooltip text="Pod" term_id="pod" >}}のレプリカ数をスケーリングするAPIリソースです。

<!--more--> 
HPAは通常{{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}、{{< glossary_tooltip text="Deployment" term_id="deployment" >}}または{{< glossary_tooltip text="ReplicaSet" term_id="replica-set" >}}で使用されます。HPAは{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}などのスケーリングをサポートしないオブジェクトでは使用できません。
