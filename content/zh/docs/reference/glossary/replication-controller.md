---
title: 副本控制器（Replication Controller）
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  一种管理多副本应用的（已启用）的 API 对象。

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
一种工作管理多副本应用的负载资源，能够确保特定个数的
{{< glossary_tooltip text="Pod" term_id="pod" >}}
实例处于运行状态。

<!--more--> 

<!--
The control plane ensures that the defined number of Pods are running, even if some
Pods fail, if you delete Pods manually, or if too many are started by mistake.
-->
控制面确保所指定的个数的 Pods 处于运行状态，即使某些 Pod 会失效，
比如被你手动删除或者因为其他错误启动过多 Pod 时。

{{< note >}}
<!--
ReplicationController is deprecated. See
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}, which is similar.
-->
ReplicationController 已被启用。请参见 Deployment 执行类似功能。
{{< /note >}}

