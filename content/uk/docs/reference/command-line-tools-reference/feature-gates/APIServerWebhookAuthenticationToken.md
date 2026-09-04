---
title: APIServerWebhookAuthenticationToken
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Дозволяє `kube-apiserver` видавати короткочасні обмежені токени ServiceAccount для автентифікації в [admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticating-to-admission-webhooks). Ці токени привʼязані до конкретної ValidatingWebhookConfiguration або MutatingWebhookConfiguration та обмежені певними групами API через атестаційні твердження в [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API.
