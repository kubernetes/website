---
title: KubeletInUserNamespace
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
---
Вмикає підтримку запуску kubelet у {{<glossary_tooltip text="просторі імен користувачів" term_id="userns">}}. Див. розділ [Запуск компонентів вузла Kubernetes від імені не-root користувача](/docs/tasks/administer-cluster/kubelet-in-userns/).
