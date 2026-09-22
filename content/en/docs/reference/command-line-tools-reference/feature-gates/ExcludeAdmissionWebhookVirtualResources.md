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
Exclude non-persisted (virtual) authentication and authorization resources,
such as `TokenReview` and `SubjectAccessReview`, from admission webhooks.
This matches the set of resources that ValidatingAdmissionPolicy and
MutatingAdmissionPolicy already exclude, and prevents a misbehaving webhook
from blocking the cluster's own authentication and authorization requests.
Disable this feature gate to restore the previous behavior of dispatching
admission webhooks for these resources.
