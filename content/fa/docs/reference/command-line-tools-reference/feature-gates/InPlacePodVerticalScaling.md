---
title: InPlacePodVerticalScaling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
مقیاس‌پذیری عمودی Pod را درجا فعال می‌کند.
