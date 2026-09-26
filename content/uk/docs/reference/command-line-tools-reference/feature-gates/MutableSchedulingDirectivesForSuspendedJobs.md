---
title: MutableSchedulingDirectivesForSuspendedJobs
content_type: feature_gate
build:
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
Вмикає можливість виправлення шаблонів подів для призупинених завдань, щоб змінити директиви планування подів.
