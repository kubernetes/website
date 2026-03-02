---
title: RestartAllContainersOnContainerExits
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Дозволяє вказати `RestartAllContainers` як дію в контейнері `restartPolicyRules`. Коли вихід контейнера відповідає правилу з цією дією, весь Pod припиняється і перезапускається на місці. Дивіться [Перезапуск усіх контейнерів](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers) для більш детальної інформації.
