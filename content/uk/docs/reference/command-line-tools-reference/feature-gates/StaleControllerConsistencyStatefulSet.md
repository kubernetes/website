---
title: StaleControllerConsistencyStatefulSet
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Вмикає поведінку всередині контролера StatefulSet, щоб забезпечити, що попередні записи в API-сервері спостерігаються перед продовженням додаткової синхронізації для того ж StatefulSet. Це запобігає використанню застарілого кешу, що може призвести до неправильних або помилкових оновлень StatefulSet.
