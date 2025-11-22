---
title: PDBUnhealthyPodEvictionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"

removed: true
---
فیلد `unhealthyPodEvictionPolicy` از «PodDisruptionBudget» را فعال می‌کند. این فیلد مشخص می‌کند که چه زمانی باید پادهای ناسالم برای حذف در نظر گرفته شوند. برای جزئیات بیشتر، لطفاً به [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy) مراجعه کنید.