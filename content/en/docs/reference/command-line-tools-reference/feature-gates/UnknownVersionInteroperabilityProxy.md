---
title: UnknownVersionInteroperabilityProxy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Proxy resource requests to the correct peer kube-apiserver when
multiple kube-apiservers exist at varied versions.
See [Mixed version proxy](/docs/concepts/architecture/mixed-version-proxy/) for more information.
