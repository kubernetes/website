---
title: EmptyDirVolumeMode
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Enables setting Unix permission bits on `emptyDir` volume directories using the
`mode` field in `emptyDir` volume sources. When enabled, users can specify a value
between `0000` and `01777` (octal) to control the directory permissions at creation
time. If `mode` is not specified, the default `0777` behavior is preserved.
-->
允许使用 `emptyDir` 卷源中的 `mode` 字段为 `emptyDir` 卷目录设置 Unix 权限位。
启用后，用户可以指定 `0000` 到 `01777`（八进制）之间的值来控制创建时的目录权限。
如果未指定 `mode`，则保留默认的 `0777` 行为。
