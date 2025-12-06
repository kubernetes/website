---
title: ExecProbeTimeout
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
---
Переконайтеся, що kubelet дотримується таймаутів exec probe. Ця функція існує на випадок, якщо будь-яке з ваших робочих навантажень залежить від виправленої помилки, коли Kubernetes ігнорував тайм-аути exec probe. Дивіться [проби готовності](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
