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
    toVersion: "1.34"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.35"
---
Allow using systemd watchdog to monitor the health status of kubelet.
See [Kubelet Systemd Watchdog](/docs/reference/node/systemd-watchdog/)
for more details.
