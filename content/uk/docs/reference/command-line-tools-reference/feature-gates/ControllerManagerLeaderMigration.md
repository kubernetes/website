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
Вмикає міграцію лідерів для [kube-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) та [cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager) що дозволяє оператору кластера в реальному часі мігрувати контролери з kube-controller-manager у зовнішній контролер-менеджер (наприклад, cloud-controller-manager) у кластері HA без простоїв.
