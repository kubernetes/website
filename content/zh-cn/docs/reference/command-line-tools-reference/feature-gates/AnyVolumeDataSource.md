---
title: AnyVolumeDataSource
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
    locked: true
---

<!--
Enable use of any custom resource as the `DataSource` of a
{{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}.
-->
允许使用任何自定义的资源来作为
{{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}} 中的 `dataSource`。
