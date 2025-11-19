---
title: AllowInsecureKubeletCertificateSigningRequests
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.31"
---
  
<!--
Disable node admission validation of
[CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests)
for kubelet signers. Unless you disable this feature gate, Kubernetes enforces that new
kubelet certificates have a `commonName` matching `system:node:$nodeName`.
-->
針對簽名者爲 kubelet 的 [CertificateSigningRequest）](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests)，
禁用節點准入檢查。除非禁用此特性門控，
否則 Kubernetes 會強制要求新的 kubelet 證書的 `commonName` 爲 `system:node:$nodeName`。
