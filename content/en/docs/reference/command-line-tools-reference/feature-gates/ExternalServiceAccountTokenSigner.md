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
Enable setting `--service-account-signing-endpoint` to make the kube-apiserver use [external signer](/docs/reference/access-authn-authz/service-account-admin#external-serviceaccount-token-signing-and-key-management) for token signing and token verifying key management.
