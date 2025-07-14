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
اجازه استفاده از systemd watchdog برای نظارت بر وضعیت سلامت kubelet.
برای جزئیات بیشتر به [Kubelet Systemd Watchdog](/docs/reference/node/systemd-watchdog/) مراجعه کنید.