---
title: JobTrackingWithFinalizers
content_type: feature_gate
_build:
  list: never
  render: false
---
Enables tracking [Job](/docs/concepts/workloads/controllers/job)
completions without relying on Pods remaining in the cluster indefinitely.
The Job controller uses Pod finalizers and a field in the Job status to keep
track of the finished Pods to count towards completion.
