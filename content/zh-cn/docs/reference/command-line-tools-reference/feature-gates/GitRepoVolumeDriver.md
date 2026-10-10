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
此项控制是否支持 `gitRepo` 卷插件。
`gitRepo` 卷插件从 v1.33 版本开始默认被禁用。
此特性门控为用户提供了一种启用该插件的方式。
