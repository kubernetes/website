---
title: KubeletWatchdogDiagnostics
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables additional structured diagnostic logs for failures in the kubelet's
systemd watchdog health checks and notification path. Enabling this feature
gate does not change the watchdog's behavior or timing.
