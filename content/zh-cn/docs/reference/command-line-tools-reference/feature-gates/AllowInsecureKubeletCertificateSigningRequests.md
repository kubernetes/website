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
针对签名者为 kubelet 的 [CertificateSigningRequest）](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests)，
禁用节点准入检查。除非禁用此特性门控，
否则 Kubernetes 会强制要求新的 kubelet 证书的 `commonName` 为 `system:node:$nodeName`。
