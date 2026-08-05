---
title: InPlacePodLevelResourcesVerticalScaling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---

<!--
Enables the in-place vertical scaling of resources for a Pod (For example, changing a
running Pod's pod-level CPU or memory requests/limits without needing to restart
it). For details, see the documentation on [In-place Pod-level Resources Vertical Scaling](/docs/tasks/configure-pod-container/resize-pod-resources/).
-->
启用对 Pod 资源的原地垂直扩缩（例如，在无需重启 Pod 的情况下更改正在运行的 Pod 的 Pod 级 CPU 或内存 requests/limits）。
有关细节参阅 [Pod 级资源原地垂直扩缩](/zh-cn/docs/tasks/configure-pod-container/resize-pod-resources/)文档。
