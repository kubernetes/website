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
---
Дозволяє користувачам редагувати свої PVC до менших розмірів, щоб можна було відновити їх після попередніх збоїв під час розширення томів. Докладні відомості див. у статті [Відновлення після збою під час розширення томів](/uk/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes).
