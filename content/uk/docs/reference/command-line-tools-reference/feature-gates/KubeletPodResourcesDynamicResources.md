---
title: KubeletPodResourcesDynamicResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

Розширює кінцеві точки [API gRPC для моніторингу ресурсів pod](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins.md) kubelet List і Get, щоб включити ресурси, виділені в ResourceClaims за допомогою [Динамічного розподілу ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).
