---
title: DefaultPodSysctls
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає поле `defaultPodSysctls` у [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/), що дозволяє адміністраторам вузлів вказувати типовий набір параметрів ядра (sysctl), привʼязаних до простору імен, які `kubelet` застосовує до всіх Podʼів на вузлі. Докладні відомості див. у розділі [Налаштування Sysctls для всіх Podʼів](/docs/tasks/administer-cluster/sysctl-cluster/#setting-sysctls-for-all-pods).
