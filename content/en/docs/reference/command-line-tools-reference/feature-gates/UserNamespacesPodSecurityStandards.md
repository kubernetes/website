---
title: UserNamespacesPodSecurityStandards
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.34"

removed: true
---
Enable Pod Security Standards policies relaxation for pods
that run with namespaces. You must set the value of this feature gate consistently across all nodes in
your cluster, and you must also enable `UserNamespacesSupport` to use this feature.

This feature gate is not part of Kubernetes v1.35 (and onwards) because,
for those versions of Kubernetes, all supported kubelet versions will fail to
create a pod if it requests a user namespace, but the node does not.