---
title: APIPriorityAndFairness
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.28"
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"

removed: true
---
Дозволяє керувати паралельністю запитів за допомоги приорітезації та справедливості на кожному сервері. (Перейменовано з `RequestManagement`)
