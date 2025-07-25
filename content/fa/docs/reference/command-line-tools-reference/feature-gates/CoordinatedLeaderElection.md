---
title: CoordinatedLeaderElection
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---
رفتارهایی را که از LeaseCandidate API پشتیبانی می‌کنند، فعال می‌کند و همچنین انتخاب هماهنگ رهبر برای صفحه کنترل Kubernetes را به صورت قطعی امکان‌پذیر می‌سازد.
