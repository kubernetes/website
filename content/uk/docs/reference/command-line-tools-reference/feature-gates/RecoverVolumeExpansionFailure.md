---
title: RecoverVolumeExpansionFailure
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

Дозволяє користувачам редагувати свої PVC до менших розмірів, щоб можна було відновити їх після попередніх збоїв під час розширення томів. Докладні відомості див. у статті [Відновлення після збою під час розширення томів](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes).
