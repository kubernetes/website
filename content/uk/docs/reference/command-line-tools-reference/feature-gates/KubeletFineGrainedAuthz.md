---
title: KubeletFineGrainedAuthz
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
---
Дозволяє [детальну авторизацію](/docs/reference/access-authn-authz/kubelet-authn-authz/#fine-grained-authorization) для HTTP API kubelet.
