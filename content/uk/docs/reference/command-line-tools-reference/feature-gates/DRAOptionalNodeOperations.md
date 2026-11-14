---
title: DRAOptionalNodeOperations
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає підтримку необовʼязкових локальних операцій на вузлі в динамічному розподілі ресурсів (DRA). Це дозволяє драйверам оголошувати, що певні операції на вузлі (`NodePrepareResources` та/або `NodeUnprepareResources`) можуть бути пропущені для їхніх пристроїв, що дозволяє `kubelet` оминати непотрібні виклики gRPC.

Для отримання додаткової інформації див. [Необовʼязкові операції на вузлі](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#optional-node-operations) у документації динамічного розподілу ресурсів.
