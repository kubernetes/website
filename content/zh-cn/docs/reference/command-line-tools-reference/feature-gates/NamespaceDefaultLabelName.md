---
# Removed from Kubernetes
title: NamespaceDefaultLabelName
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"

removed: true
---

<!--
Configure the API Server to set an immutable
{{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/metadata.name`
on all namespaces, containing the namespace name.
-->
配置 API 服务器以在所有名字空间上设置一个不可变的{{< glossary_tooltip text="标签" term_id="label" >}}
`kubernetes.io/metadata.name`，取值为名字空间的名称。
