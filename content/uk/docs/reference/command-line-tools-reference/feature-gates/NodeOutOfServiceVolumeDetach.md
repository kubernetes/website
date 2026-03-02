---
title: NodeOutOfServiceVolumeDetach
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.31"

removed: true
---

Коли вузол позначено як такий, що не працює, за допомогою taint `node.kubernetes.io/out-of-service`, то Podʼи на цьому вузлі будуть примусово видалені, якщо вони не можуть толерувати цю позначку, а операції відʼєднання томів для Podʼів, що завершують роботу на цьому вузлі, будуть виконані негайно. Видалені Podʼи можуть бути швидко відновлені на інших вузлах.
