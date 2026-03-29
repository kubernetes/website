---
title: UnknownVersionInteroperabilityProxy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: false
    fromVersion: "1.36"
---
Proxy resource requests to the correct peer kube-apiserver when
multiple kube-apiservers exist at varied versions.
See [Mixed version proxy](/concepts/architecture/mixed-version-proxy) for more information.
