---
# Removed from Kubernetes
title: SupportNodePidsLimit
content_type: feature_gate

_build:
  list: never
  render: false
---
Enable the support to limiting PIDs on the Node.  The parameter
`pid=<number>` in the `--system-reserved` and `--kube-reserved` options can be specified to
ensure that the specified number of process IDs will be reserved for the system as a whole and for
 Kubernetes system daemons respectively.
