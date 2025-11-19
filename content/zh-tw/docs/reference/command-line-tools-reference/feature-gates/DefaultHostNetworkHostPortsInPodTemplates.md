---
title: DefaultHostNetworkHostPortsInPodTemplates
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"

removed: true
---
<!--
This feature gate controls the point at which a default value for
`.spec.containers[*].ports[*].hostPort`
is assigned, for Pods using `hostNetwork: true`. The default since Kubernetes v1.28 is to only set a default
value in Pods.

Enabling this means a default will be assigned even to the `.spec` of an embedded
[PodTemplate](/docs/concepts/workloads/pods/#pod-templates) (for example, in a Deployment),
which is the way that older releases of Kubernetes worked.
You should migrate your code so that it does not rely on the legacy behavior.
-->
此特性門控將控制何時爲使用 `hostNetwork: true` 的 Pod 設置
`.spec.containers[*].ports[*].hostPort` 默認值。

啓用此特性意味着默認值甚至會分配給嵌入式
[PodTemplate](/zh-cn/docs/concepts/workloads/pods/#pod-templates)（例如，Deployment）
的 `.spec`，這是 Kubernetes 舊版本的工作方式。
你應該遷移你的代碼，使其不再依賴於原先的行爲。
