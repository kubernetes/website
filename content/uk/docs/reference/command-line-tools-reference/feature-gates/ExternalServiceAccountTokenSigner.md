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
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

Увімкніть параметр `--service-account-signing-endpoint`, щоб kube-apiserver використовував [зовнішнього підписувача](/docs/reference/access-authn-authz/service-accounts-admin#external-serviceaccount-token-signing-and-key-management) для підписання токенів та керування ключами для перевірки токенів.
