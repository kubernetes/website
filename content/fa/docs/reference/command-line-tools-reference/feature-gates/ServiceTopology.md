---
# Removed from Kubernetes
title: ServiceTopology
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.19"
  - stage: deprecated 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.22"

removed: true
---
سرویس را فعال کنید تا ترافیک را بر اساس توپولوژی گره خوشه مسیریابی کند.