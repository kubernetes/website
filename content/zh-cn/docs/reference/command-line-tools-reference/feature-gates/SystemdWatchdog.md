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

<!--
Allow using systemd watchdog to monitor the health status of kubelet.
See [Kubelet Systemd Watchdog](/docs/reference/node/systemd-watchdog/)
for more details.
-->
允许使用 systemd 看门狗监控 kubelet 的健康状态。更多细节参阅
[kubelet systemd 看门狗](/zh-cn/docs/reference/node/systemd-watchdog/)。
