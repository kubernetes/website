---
title: ImageVolume
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Дозволити використання джерела тому [`image`](/docs/concepts/storage/volumes/) у Pod. За допомогою цього джерела томів ви можете змонтувати образ контейнера як том лише для читання.
