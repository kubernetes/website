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
تنظیم `--service-account-signing-endpoint` را فعال کنید تا kube-apiserver از [external signer](/docs/reference/access-authn-authz/service-account-admin#external-serviceaccount-token-signing-and-key-management) برای امضای توکن و مدیریت کلید تأیید توکن استفاده کند.

