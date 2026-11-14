---
title: PersistentVolumeClaimUnusedSinceTime
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Коли увімкнено, контролер захисту PVC додає стан `Unused` до PersistentVolumeClaims, що відстежує, чи PVC наразі використовується будь-яким Podʼом, що не перебуває в термінальному стані. Поле `lastTransitionTime` умови фіксує, коли PVC востаннє переходив між станом використання та невикористання.
