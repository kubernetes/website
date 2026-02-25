---
title: KubeletPodResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.14"
  - stage: beta
    defaultValue: true
    fromVersion: "1.15"
    toVersion: "1.27"
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.29"
removed: true
---
Вмикає ресурси точки доступу gRPC kubelet Pod. Докладніші відомості наведено у статті [Підтримка моніторингу пристроїв](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/606-compute-device-assignment/README.md).
