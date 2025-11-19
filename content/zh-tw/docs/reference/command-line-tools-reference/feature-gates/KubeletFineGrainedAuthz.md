---
title: KubeletFineGrainedAuthz
content_type: feature_gate
_build:
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
---

<!--
Enable [fine-grained authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/#fine-grained-authorization) 
for the kubelet's HTTP(s) API.
-->
爲 kubelet 的 HTTP(s) API
啓用[細粒度的鑑權](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/#fine-grained-authorization)。
