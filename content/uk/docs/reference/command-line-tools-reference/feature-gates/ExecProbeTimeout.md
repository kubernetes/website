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
Забезпечує дотримання kubelet тайм-аутів exec probe. Ця функціональна можливість існує на випадок, якщо будь-яке з ваших наявних робочих навантажень залежить від тепер виправленої помилки, коли Kubernetes ігнорував тайм-аути exec probe. Дивіться [проби готовності](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
