---
title: SidecarContainers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
---
Дозволити встановлювати `restartPolicy` контейнера init значення `Always`, щоб контейнер ставав sidecar-контейнером (контейнери init, які можна перезапустити). Дивіться [Контейнери Sidecar та restartPolicy](/docs/concepts/workloads/pods/sidecar-containers/) для отримання більш детальної інформації.
