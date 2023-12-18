---
title: MaxUnavailableStatefulSet
content_type: feature_gate
_build:
  list: never
  render: false
---
Enables setting the `maxUnavailable` field for the
[rolling update strategy](/docs/concepts/workloads/controllers/statefulset/#rolling-updates)
of a StatefulSet. The field specifies the maximum number of Pods
that can be unavailable during the update.
