---
title: KubeletPodResourcesGet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

Вмикає точку доступу `Get` gRPC в kubeletʼах для ресурсів Pod. Цей API доповнює [звіт про розподіл ресурсів](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
