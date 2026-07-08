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
在 Pod 中启用 `shareProcessNamespace` 的设置，
以便在 Pod 中运行的容器之间共享同一进程名字空间。
更多细节请参见[在 Pod 中的容器间共享同一进程名字空间](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)。
