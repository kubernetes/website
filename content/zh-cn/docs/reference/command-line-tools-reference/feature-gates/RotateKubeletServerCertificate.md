---
title: RotateKubeletServerCertificate
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.7"
    toVersion: "1.11"
  - stage: beta
    defaultValue: true
    fromVersion: "1.12"
---

<!--
Enable the rotation of the server TLS certificate on the kubelet.
See [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)
for more details.
-->
启用 kubelet 上服务器 TLS 证书的轮换。
更多细节参阅 [kubelet 配置](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)。
