---
title: KubeletTracing
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

Додавання підтримки розподіленого трасування в kubelet. Якщо увімкнено, інтерфейс CRI kubelet та автентифіковані http-сервери використовуються для генерації відрізків трасування OpenTelemetry. Дивіться [Трасування для системних компонентів Kubernetes](/docs/concepts/cluster-administration/system-traces) для більш детальної інформації.
