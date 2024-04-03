---
title: StorageVersionAPI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
---
<!--
Enable the
[storage version API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageversion-v1alpha1-internal-apiserver-k8s-io).
-->
启用[存储版本 API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageversion-v1alpha1-internal-apiserver-k8s-io)。
