---
title: KubeletCrashLoopBackOffMax
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Дозволяє підтримувати конфігуровані максимальні значення backoff для кожного вузла для перезапуску контейнерів у стані CrashLoopBackOff. Для більш детальної інформації перевірте поле `crashLoopBackOff.maxContainerRestartPeriod` у [kubelet config file](/docs/reference/config-api/kubelet-config.v1beta1/).
