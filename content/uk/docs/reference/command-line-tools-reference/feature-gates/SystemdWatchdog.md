---
title: SystemdWatchdog
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---

Дозволяє використання systemd watchdog для моніторингу статусу справності kubelet. Див. [Kubelet Systemd Watchdog](/docs/reference/node/systemd-watchdog/) для отримання додаткових відомостей.
