---
title: NetworkIsolatedPods
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables the `podNetwork` field in the Pod spec. A Pod that sets `podNetwork: Isolated`
is not attached to the pod network: it runs in its own network namespace with only
a loopback interface, and it has no Pod IP.
For more details, see
[Network isolated Pods](/docs/concepts/workloads/pods/#network-isolated-pods).
