---
title: EnableWorkloadWithJob
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enables the Job controller to automatically create [Workload](/docs/concepts/workloads/workload-api/)
and [PodGroup](/docs/reference/kubernetes-api/workload-resources/workload-v1alpha1/) objects
for [qualifying Jobs](/docs/concepts/workloads/controllers/job#qualifying-criteria).
See [Integrate with Workload APIs](/docs/concepts/workloads/controllers/job#integrate-with-workload-apis)
for details.
-->
启用 Job 控制器为
[符合条件的 Job](/zh-cn/docs/concepts/workloads/controllers/job#qualifying-criteria)
自动创建
[Workload](/zh-cn/docs/concepts/workloads/workload-api/) 和
[PodGroup](/zh-cn/docs/reference/kubernetes-api/workload-resources/workload-v1alpha1/)
对象。有关详细信息，请参阅
[与 Workload API 集成](/zh-cn/docs/concepts/workloads/controllers/job#integrate-with-workload-apis)。

