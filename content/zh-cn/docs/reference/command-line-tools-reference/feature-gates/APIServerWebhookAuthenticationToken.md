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

<!--
Enables the `kube-apiserver` to issue short-lived, scoped ServiceAccount tokens
for authenticating to
[admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticating-to-admission-webhooks).
These tokens are bound to a specific ValidatingWebhookConfiguration or
MutatingWebhookConfiguration and are scoped to particular API groups
via attestation claims in the
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API.
-->
启用 `kube-apiserver` 签发短期的、限定作用域的 ServiceAccount 令牌，
用于向[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticating-to-admission-webhooks)进行身份验证。
这些令牌绑定到特定的 ValidatingWebhookConfiguration 或
MutatingWebhookConfiguration，并通过
[TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API
中的证明声明，将作用域限定为特定的 API 组。
