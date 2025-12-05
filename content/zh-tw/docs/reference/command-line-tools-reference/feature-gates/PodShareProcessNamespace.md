---
# Removed from Kubernetes
title: PodShareProcessNamespace
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.10"
    toVersion: "1.11"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.19"

removed: true
---

<!--
Enable the setting of `shareProcessNamespace` in a Pod for sharing
a single process namespace between containers running in a pod.  More details can be found in
[Share Process Namespace between Containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/).
-->
在 Pod 中啓用 `shareProcessNamespace` 的設置，
以便在 Pod 中運行的容器之間共享同一進程名字空間。
更多細節請參見[在 Pod 中的容器間共享同一進程名字空間](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)。
