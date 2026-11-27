---
title: PodFailurePolicyName
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---

Enables setting an optional `name` on rules in a Job's `.spec.podFailurePolicy.rules`.
When a named rule with the `FailJob` action fails a Job, the Job controller
includes the rule name in the Job's failure condition message while keeping the
condition reason as `PodFailurePolicy`.
See [Naming Pod failure policy rules](/docs/concepts/workloads/controllers/job/#pod-failure-policy-rule-names)
for details.
