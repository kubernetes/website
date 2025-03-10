---
title: PodLifecycleSleepActionAllowZero
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

Дозволяє встановлювати нульове значення для дії `sleep` в [хуках життєвого циклу контейнера](/docs/concepts/containers/container-lifecycle-hooks/).
