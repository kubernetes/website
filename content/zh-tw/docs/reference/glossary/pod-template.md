---
title: PodTemplate
id: pod-template
date: 2024-10-13
short_description: >
  創建 Pod 所用的模板。

aka: 
  - Pod 模板
tags:
- core-object
---
<!--
title: PodTemplate
id: pod-template
date: 2024-10-13
short_description: >
  A template for creating Pods.

aka: 
  - pod template
tags:
- core-object
-->

<!--
An API object that defines a template for creating {{< glossary_tooltip text="Pods" term_id="pod" >}}.
The PodTemplate API is also embedded in API definitions for workload management, such as 
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} or
{{< glossary_tooltip text="StatefulSets" term_id="StatefulSet" >}}.
-->
這個 API 對象定義了創建 {{< glossary_tooltip text="Pod" term_id="pod" >}} 時所用的模板。
PodTemplate API 也被嵌入在工作負載管理的 API 定義中，例如
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或
{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}}。

<!--more-->

<!--
Pod templates allow you to define common metadata (such as labels, or a template for the name of a
new Pod) as well as to specify a pod's desired state.
[Workload management](/docs/concepts/workloads/controllers/) controllers use Pod templates
(embedded into another object, such as a Deployment or StatefulSet)
to define and manage one or more {{< glossary_tooltip text="Pods" term_id="pod" >}}.
When there can be multiple Pods based on the same template, these are called
{{< glossary_tooltip term_id="replica" text="replicas" >}}.
Although you can create a PodTemplate object directly, you rarely need to do so.
-->
Pod 模板允許你定義常見的元數據（例如標籤，或新 Pod 名稱的模板）以及 Pod 的期望狀態。
[工作負載管理](/zh-cn/docs/concepts/workloads/controllers/)控制器使用 Pod 模板
（嵌入到另一個對象中，例如 Deployment 或 StatefulSet）
來定義和管理一個或多個 {{< glossary_tooltip text="Pod" term_id="pod" >}}。
當多個 Pod 基於同一個模板時，這些 Pod 稱爲{{< glossary_tooltip term_id="replica" text="副本" >}}。
儘管你可以直接創建 PodTemplate 對象，但通常不需要這樣做。
