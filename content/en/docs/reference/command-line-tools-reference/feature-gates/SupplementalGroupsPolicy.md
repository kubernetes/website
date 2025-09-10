---
title: SupplementalGroupsPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
Enables support for fine-grained SupplementalGroups control.
For more details, see [Configure fine-grained SupplementalGroups control for a Pod](/content/en/docs/tasks/configure-pod-container/security-context/#supplementalgroupspolicy).
