---
title: 副本控制器（ReplicationController）
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  一種管理多副本應用的（已棄用）的 API 對象。

aka: 
tags:
- workload
- core-object
---

<!--
title: ReplicationController
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
一種管理多副本應用的工作負載資源，能夠確保特定個數的
{{< glossary_tooltip text="Pod" term_id="pod" >}}
實例處於運行狀態。

<!--more-->

<!--
The control plane ensures that the defined number of Pods are running, even if some
Pods fail, if you delete Pods manually, or if too many are started by mistake.
-->
控制平面確保即使某些 Pod 失效、被你手動刪除或錯誤地啓動了過多 Pod 時，
指定數量的 Pod 仍處於運行狀態。

{{< note >}}
<!--
ReplicationController is deprecated. See
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}, which is similar.
-->
ReplicationController 已被棄用。請參見執行類似功能的
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}。
{{< /note >}}
