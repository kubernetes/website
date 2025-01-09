---
title: ExternalServiceAccountTokenSigner
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
Enable setting `--service-account-signing-endpoint` to make the kube-apiserver use [external signer](/docs/reference/access-authn-authz/service-account-admin#external-serviceaccount-token-signing-and-key-management) for token signing and token verifying key management.
-->
允许设置 `--service-account-signing-endpoint` 让 kube-apiserver
使用[外部签名程序](/zh-cn/docs/reference/access-authn-authz/service-account-admin#external-serviceaccount-token-signing-and-key-management)进行令牌签名和令牌验证密钥管理。
