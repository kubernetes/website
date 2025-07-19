---
title: TopologyManagerPolicyOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
فعال کردن [fine-tuning](/docs/tasks/administer-cluster/topology-manager/#topology-manager-policy-options) از سیاست‌های مدیریت توپولوژی.