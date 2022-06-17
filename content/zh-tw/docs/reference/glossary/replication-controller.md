---
title: 副本控制器（Replication Controller）
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  一種管理多副本應用的（已啟用）的 API 物件。

aka: 
tags:
- workload
- core-object
---

<!--
title: Replication Controller
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  A (deprecated) API object that manages a replicated application.

aka: 
tags:
- workload
- core-object
-->

<!--
 A workload resource that manages a replicated application, ensuring that
a specific number of instances of a {{< glossary_tooltip text="Pod" term_id="pod" >}} are running.
-->
一種工作管理多副本應用的負載資源，能夠確保特定個數的
{{< glossary_tooltip text="Pod" term_id="pod" >}}
例項處於執行狀態。

<!--more--> 

<!--
The control plane ensures that the defined number of Pods are running, even if some
Pods fail, if you delete Pods manually, or if too many are started by mistake.
-->
控制面確保所指定的個數的 Pods 處於執行狀態，即使某些 Pod 會失效，
比如被你手動刪除或者因為其他錯誤啟動過多 Pod 時。

{{< note >}}
<!--
ReplicationController is deprecated. See
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}, which is similar.
-->
ReplicationController 已被啟用。請參見 Deployment 執行類似功能。
{{< /note >}}

