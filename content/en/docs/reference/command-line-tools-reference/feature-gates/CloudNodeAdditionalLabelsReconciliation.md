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

Enables periodic reconciliation of additional node labels returned by cloud
providers through `InstanceMetadata.AdditionalLabels` in the cloud-controller-manager.

For details, see
[Reconcile additional node labels](/docs/concepts/architecture/cloud-controller/#reconcile-additional-node-labels).
