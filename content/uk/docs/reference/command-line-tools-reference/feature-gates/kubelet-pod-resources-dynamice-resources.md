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
Розширює ресурси gRPC точки доступу Podʼа kubelet, щоб включити ресурси, виділені в `ResourceClaims` через API `DynamicResourceAllocation`. Див. [звіт про виділення ресурсів](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources) для отримання додаткової інформації, інформацією про доступні ресурси, що дозволяє клієнтам належним чином відстежувати вільні обчислювальні ресурси на вузлі.
