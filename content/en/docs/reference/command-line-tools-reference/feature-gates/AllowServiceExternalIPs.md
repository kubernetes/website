---
title: AllowServiceExternalIPs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.36"

---
If set, kube-proxy will continue to respect the deprecated `externalIPs`
field in Services.
