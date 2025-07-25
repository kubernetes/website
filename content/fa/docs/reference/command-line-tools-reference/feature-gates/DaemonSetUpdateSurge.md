---
title: DaemonSetUpdateSurge
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"

removed: true  
---
بارهای کاری DaemonSet را قادر می‌سازد تا در طول به‌روزرسانی به ازای هر گره، در دسترس بودن را حفظ کنند. به [Perform a Rolling Update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).مراجعه کنید.