---
# از Kubernetes حذف شد
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
مهاجرت Leader را برای [kube-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) و [cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager) فعال می‌کند که به یک اپراتور خوشه اجازه می‌دهد تا کنترل‌کننده‌ها را از kube-controller-manager به یک controller-manager خارجی (مثلاً cloud-controller-manager) در یک خوشه HA بدون خرابی منتقل کند.