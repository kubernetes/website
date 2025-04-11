---
title: ResourceHealthStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
---
Вмикає поле `allocatedResourcesStatus` у файлі `.status` для Pod. У полі буде показано додаткові відомості для кожного контейнера у Pod, а також інформацію про стан кожного пристрою, призначеного для Pod. Докладні відомості наведено у статті [Втулок пристрою та несправні пристрої](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices).
