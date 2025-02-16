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

Увімкніть параметр `--service-account-signing-endpoint', щоб kube-apiserver використовував [зовнішнього підписувача](/docs/reference/access-authn-authz/service-account-admin#external-serviceaccount-token-signing-and-key-management) для підписання токенів та керування ключами для перевірки токенів.
