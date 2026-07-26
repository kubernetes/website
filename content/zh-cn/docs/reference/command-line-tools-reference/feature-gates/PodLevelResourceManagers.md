---
title: PodLevelResourceManagers
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
Enable _Pod-level resource managers_: the ability for the Topology, CPU, and
Memory managers to use information from `.spec.resources` to perform NUMA
alignment for an entire pod and manage resources flexibly for the containers
within that pod.
-->
启用 **Pod 级资源管理器**：Topology、CPU 和 Memory 管理器使用 `.spec.resources`
中的信息为整个 Pod 执行 NUMA 对齐并灵活管理该 Pod 内容器的资源的能力。
