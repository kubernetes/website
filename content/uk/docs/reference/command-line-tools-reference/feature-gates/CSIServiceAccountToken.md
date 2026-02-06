---
# Removed from Kubernetes
title: CSIServiceAccountToken
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"

removed: true  
---
Дозволяє CSI-драйверам отримувати токен службового облікового запису для Podʼів, для яких вони монтували томи. Див.
[Запити токенів](https://kubernetes-csi.github.io/docs/token-requests.html).
