---
title: PersistentVolumeClaimUnusedSinceTime
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Коли увімкнено, контролер захисту PVC додає стан `Unused` до PersistentVolumeClaims, що відстежує, чи PVC наразі використовується будь-яким не Podʼом в термінальній стадії. Поле `lastTransitionTime` умови фіксує, коли PVC востаннє переходив між станом використання та невикористання.
