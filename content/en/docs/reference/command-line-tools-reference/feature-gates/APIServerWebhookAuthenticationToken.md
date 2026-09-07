---
title: APIServerWebhookAuthenticationToken
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables the `kube-apiserver` to issue short-lived, scoped ServiceAccount tokens
for authenticating to
[admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticating-to-admission-webhooks).
These tokens are bound to a specific ValidatingWebhookConfiguration or
MutatingWebhookConfiguration and are scoped to particular API groups
via attestation claims in the
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API.
