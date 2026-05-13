---
title: KubeletFineGrainedAuthz
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.33"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.36"
---

Enable [fine-grained authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/#fine-grained-authorization) 
for the kubelet's HTTP(s) API.
