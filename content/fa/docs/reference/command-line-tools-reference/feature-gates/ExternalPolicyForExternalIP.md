---
# Removed from Kubernetes
title: ExternalPolicyForExternalIP
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.22"

removed: true  
---
رفع اشکالی که در آن ExternalTrafficPolicy روی Service ExternalIPها اعمال نمی‌شد.
