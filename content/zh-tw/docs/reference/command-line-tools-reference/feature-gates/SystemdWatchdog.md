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
允許使用 systemd 看門狗監控 kubelet 的健康狀態。更多細節參閱
[kubelet systemd 看門狗](/zh-cn/docs/reference/node/systemd-watchdog/)。
