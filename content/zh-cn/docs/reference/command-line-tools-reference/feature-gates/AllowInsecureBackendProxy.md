---
# Removed from Kubernetes
title: AllowInsecureBackendProxy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.25"

removed: true
---

<!--
Enable the users to skip TLS verification of
kubelets on Pod log requests.
-->
允许用户在请求 Pod 日志时跳过 kubelet 的 TLS 验证。
