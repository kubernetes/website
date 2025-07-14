---
title: TopologyManager
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.17"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.26"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"    

removed: true
---
فعال کردن مکانیزمی برای هماهنگی تخصیص منابع سخت‌افزاری دقیق برای اجزای مختلف در Kubernetes. به [Control Topology Management Policies on a node](/docs/tasks/administer-cluster/topology-manager/).مراجعه کنید.