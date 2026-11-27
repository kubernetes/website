---
title: CloudControllerManagerWatchBasedRoutesReconciliation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Увімкнення механізму узгодження маршруту на основі спостереження (замість узгодження через фіксований інтервал) у бібліотеці cloud-controller-manager.
