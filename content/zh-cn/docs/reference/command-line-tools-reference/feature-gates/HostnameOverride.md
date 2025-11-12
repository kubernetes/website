---
title: HostnameOverride
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

<!--
Allows setting any FQDN as the pod's hostname.
-->
允许将任意 FQDN（完全限定域名）设置为 Pod 的主机名。
