---
# Removed from Kubernetes
title: EnableAggregatedDiscoveryTimeout
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.16"
    toVersion: "1.17"

removed: true  

---
Enable the five second
timeout on aggregated discovery calls.
