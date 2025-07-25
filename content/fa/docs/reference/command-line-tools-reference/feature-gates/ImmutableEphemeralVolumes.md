---
# Removed from Kubernetes
title: ImmutableEphemeralVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.20"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.24"    

removed: true
---
امکان علامت‌گذاری Secrets و ConfigMapsهای مجزا به عنوان تغییرناپذیر برای ایمنی و عملکرد بهتر را فراهم می‌کند.
