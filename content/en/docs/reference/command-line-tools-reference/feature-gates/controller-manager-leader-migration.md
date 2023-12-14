---
# Removed from Kubernetes
title: ControllerManagerLeaderMigration
content_type: feature_gate

_build:
  list: never
  render: false
---
Enables Leader Migration for
[kube-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) and
[cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager)
which allows a cluster operator to live migrate
controllers from the kube-controller-manager into an external controller-manager
(e.g. the cloud-controller-manager) in an HA cluster without downtime.
