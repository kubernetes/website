---
title: GitRepoVolumeDriver
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"
---

<!--
This controls if the `gitRepo` volume plugin is supported or not.
The `gitRepo` volume plugin is disabled by default starting v1.33 release.
This provides a way for users to enable it.
-->
此項控制是否支持 `gitRepo` 卷插件。
`gitRepo` 卷插件從 v1.33 版本開始預設被禁用。
此特性門控爲使用者提供了一種啓用該插件的方式。
