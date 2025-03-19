---
title: KubeletPodResourcesDynamicResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
---
Розширює ресурси gRPC точки доступу Podʼа kublet, щоб включати ресурси, що виділені в `ResourceClaims` через API `DynamicResourceAllocation`. Див. [звіт про виділення ресурсів](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources) для отримання додаткових відомостей. З цією інформацією про ресурси, клієнти можуть належним чином відстежувати вільні обчислювальні ресурси на вузлі.
