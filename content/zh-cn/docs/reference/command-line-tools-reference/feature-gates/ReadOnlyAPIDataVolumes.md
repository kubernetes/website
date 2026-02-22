---
# Removed from Kubernetes
title: ReadOnlyAPIDataVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: stable
    fromVersion: "1.10"
    toVersion: "1.10"

removed: true  
---

<!--
Set [`configMap`](/docs/concepts/storage/volumes/#configmap), 
[`secret`](/docs/concepts/storage/volumes/#secret), 
[`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi) and 
[`projected`](/docs/concepts/storage/volumes/#projected) 
{{< glossary_tooltip term_id="volume" text="volumes" >}} to be mounted read-only.

Since Kubernetes v1.10, these volume types are always read-only and you cannot opt out.
-->
请参阅以只读方式挂载的 [`configMap`](/zh-cn/docs/concepts/storage/volumes/#configmap)、
[`secret`](/zh-cn/docs/concepts/storage/volumes/#secret)、
[`downwardAPI`](/zh-cn/docs/concepts/storage/volumes/#downwardapi)
和 [`projected`](/zh-cn/docs/concepts/storage/volumes/#projected) 卷。

自 Kubernetes v1.10 起，这些卷类型始终是只读的，无法选择其它模式。
