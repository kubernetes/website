---
title: Podのライフサイクル
id: pod-lifecycle
date: 2019-02-17
full-link: /ja/docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  Podがそのライフサイクル中にたどる一連の状態。
 
---
 Podがそのライフサイクル中にたどる一連の状態。

<!--more--> 

[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/)は、Podの状態またはフェーズによって定義されます。
Podには、Pending、Running、Succeeded、Failed、Unknownの5つのフェーズがあります。
Podの状態に関する高レベルな説明は、[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)の`phase`フィールドに要約されています。
