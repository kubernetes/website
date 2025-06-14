---
# Removed from Kubernetes
title: ControllerManagerLeaderMigration
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.26"

removed: true  
---
<!--
Enables Leader Migration for
[kube-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) and
[cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager)
which allows a cluster operator to live migrate
controllers from the kube-controller-manager into an external controller-manager
(e.g. the cloud-controller-manager) in an HA cluster without downtime.
-->
为 [kube-controller-manager](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration)
和 [cloud-controller-manager](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager)
启用 Leader 迁移，它允许集群管理者在没有停机的高可用集群环境下，实时把 kube-controller-manager
迁移到外部的 controller-manager (例如 cloud-controller-manager) 中。
