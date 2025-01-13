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
---

<!--
Enable [fine-grained authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/#fine-grained-authorization) 
for the kubelet's HTTP(s) API.
-->
为 kubelet 的 HTTP(s) API
启用[细粒度的鉴权](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/#fine-grained-authorization)。
