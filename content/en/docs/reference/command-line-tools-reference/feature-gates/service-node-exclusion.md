---
# Removed from Kubernetes
title: ServiceNodeExclusion
content_type: feature_gate

_build:
  list: never
  render: false
---
Enable the exclusion of nodes from load balancers created by a cloud provider.
A node is eligible for exclusion if labelled with "`node.kubernetes.io/exclude-from-external-load-balancers`".
