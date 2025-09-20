---
title: MatchLabelKeysInPodTopologySpreadSelectorMerge
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

Вмикає обʼєднання селекторів, побудованих з `matchLabelKeys`, у `labelSelector` [обмеженнях поширення топології Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/). Цю функцію можна увімкнути, коли функція `matchLabelKeys` увімкнена за допомогою прапорця функції `MatchLabelKeysInPodTopologySpread`.
