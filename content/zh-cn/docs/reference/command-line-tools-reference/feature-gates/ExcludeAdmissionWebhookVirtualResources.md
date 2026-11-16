---
title: ExcludeAdmissionWebhookVirtualResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---

<!--
Exclude non-persisted (virtual) authentication and authorization resources,
such as `TokenReview` and `SubjectAccessReview`, from admission webhooks.
This matches the set of resources that ValidatingAdmissionPolicy and
MutatingAdmissionPolicy already exclude, and prevents a misbehaving webhook
from blocking the cluster's own authentication and authorization requests.
Disable this feature gate to restore the previous behavior of dispatching
admission webhooks for these resources.
-->
将非持久化（虚拟）的身份认证和鉴权资源（例如 `TokenReview` 和 `SubjectAccessReview`）
排除在准入 Webhook 之外。这与 ValidatingAdmissionPolicy 和
MutatingAdmissionPolicy 已经排除的资源集合一致，并可防止行为异常的 Webhook
阻塞集群自身的身份认证和鉴权请求。禁用此特性门控可恢复为此类资源派发准入 Webhook 的先前行为。
