---
# Removed from Kubernetes
title: PodPriority
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.10"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.13"
  - stage: stable
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.18"

removed: true
---
فعال کردن لغو زمانبندی و انحصار پادها بر اساس اولویت‌هایشان [priorities](/docs/concepts/scheduling-eviction/pod-priority-preemption/).