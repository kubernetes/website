---
title: RetryGenerateName
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---
Enables retrying of object creation when the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
is expected to generate a [name](/docs/concepts/overview/working-with-objects/names/#names).
When this feature is enabled, requests using `generateName` are retried automatically in case the
control plane detects a name conflict with an existing object, up to a limit of 8 total attempts.
