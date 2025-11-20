---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /zh-cn/docs/concepts/workloads/controllers/statefulset/
short_description: >
  StatefulSet 用來管理某 Pod 集合的部署和擴縮，併爲這些 Pod 提供持久儲存和持久標識符。
aka: 
tags:
- fundamental
- core-object
- workload
- storage
---

<!--
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  A StatefulSet manages deployment and scaling of a set of Pods, with durable storage and persistent identifiers for each Pod.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
-->

<!--
 Manages the deployment and scaling of a set of {{< glossary_tooltip text="Pods" term_id="pod" >}}, *and provides guarantees about the ordering and uniqueness* of these Pods.
-->
StatefulSet 用來管理某 {{< glossary_tooltip text="Pod" term_id="pod" >}} 集合的部署和擴縮，
併爲這些 Pod 提供持久儲存和持久標識符。 
<!--more--> 

<!--
Like a {{< glossary_tooltip term_id="deployment" >}}, a StatefulSet manages Pods that are based on an identical container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of its Pods. These pods are created from the same spec, but are not interchangeable&#58; each has a persistent identifier that it maintains across any rescheduling.
-->

和 {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 類似，
StatefulSet 管理基於相同容器規約的一組 Pod。但和 Deployment 不同的是，
StatefulSet 爲它們的每個 Pod 維護了一個有粘性的 ID。這些 Pod 是基於相同的規約來創建的，
但是不能相互替換：無論怎麼調度，每個 Pod 都有一個永久不變的 ID。
<!--
If you want to use storage volumes to provide persistence for your workload, you can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet are susceptible to failure, the persistent Pod identifiers make it easier to match existing volumes to the new Pods that replace any that have failed.
-->

如果希望使用儲存卷爲工作負載提供持久儲存，可以使用 StatefulSet 作爲解決方案的一部分。
儘管 StatefulSet 中的單個 Pod 仍可能出現故障，
但持久的 Pod 標識符使得將現有卷與替換已失敗 Pod 的新 Pod 相匹配變得更加容易。