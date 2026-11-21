---
title: PreventStaticPodAPIReferences
content_type: feature_gate

_build:
  list: never
  render: false

stages:
- stage: beta
  defaultValue: true
  fromVersion: "1.34"

---
Відмовляє в допуску Podʼу, якщо статичні Podʼи посилаються на інші обʼєкти API.
