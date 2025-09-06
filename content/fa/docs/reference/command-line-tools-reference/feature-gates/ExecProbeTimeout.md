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
مطمئن شوید که kubelet به مهلت‌های زمانی exec probe احترام می‌گذارد.
این دروازه ویژگی در صورتی وجود دارد که هر یک از بارهای کاری موجود شما به یک خطای اصلاح‌شده که در آن Kubernetes مهلت‌های زمانی exec probe را نادیده گرفته است، وابسته باشد. به [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) مراجعه کنید.