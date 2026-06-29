---
title: DRAExtendedResource
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Дозволяє підтримку функції [Розподіл розширених ресурсів за допомогою DRA](/docs/concepts/configuration/manage-resources-containers/#extended-resources-allocation-by-dra). Це дозволяє вказувати імʼя розширеного ресурсу в DeviceClass.
