---
title: MutablePodResourcesForSuspendedJobs 
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
removed: false
---
Вмикає можливість виправлення шаблонів Podʼів для призупинених Job, щоб змінити запити або обмеження для ресурсів інфраструктури.
