---
title: JobReadyPods
content_type: feature_gate
_build:
  list: never
  render: false
---
Enables tracking the number of Pods that have a `Ready`
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions).
The count of `Ready` pods is recorded in the
[status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus)
of a [Job](/docs/concepts/workloads/controllers/job) status.
