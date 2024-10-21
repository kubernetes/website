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
Allow using systemd watchdog to monitor the health status of kubelet.
See [Kubelet Systemd Watchdog](/content/en/docs/reference/node/systemd-watchdog.md)
for more details.
