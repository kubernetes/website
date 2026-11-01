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
Enables setting Unix permission bits on `emptyDir` volume directories using the
`mode` field in `emptyDir` volume sources. When enabled, users can specify a value
between `0000` and `01777` (octal) to control the directory permissions at creation
time. If `mode` is not specified, the default `0777` behavior is preserved.
