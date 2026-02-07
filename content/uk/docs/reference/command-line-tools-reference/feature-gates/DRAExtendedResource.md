---
title: DRAExtendedResource
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---
Дозволяє підтримку функції [Розподіл розширених ресурсів за допомогою DRA](/docs/concepts/configuration/manage-resources-containers/#extended-resources-allocation-by-dra). Це дозволяє вказувати імʼя розширеного ресурсу в DeviceClass.
