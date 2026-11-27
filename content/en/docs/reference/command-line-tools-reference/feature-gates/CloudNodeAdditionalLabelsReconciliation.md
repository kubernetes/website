---
title: CloudNodeAdditionalLabelsReconciliation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---

Enables periodic reconciliation of provider-supplied additional node labels
in cloud controller managers that use the shared node controller from the
Kubernetes `k8s.io/cloud-provider` library. Providers supply these labels
through `InstanceMetadata.AdditionalLabels`.

For details, see
[Additional node label reconciliation](/docs/concepts/architecture/cloud-controller/#reconcile-additional-node-labels).
