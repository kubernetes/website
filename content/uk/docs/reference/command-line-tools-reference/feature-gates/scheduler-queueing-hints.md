---
title: SchedulerQueueingHints
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: false
    fromVersion: "1.29"
---
Дозволяє [покращення підказок планувальника](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md), що дозволяє зменшити кількість марних перезапитів. Планувальник повторно спробує запланувати Podʼи, якщо щось зміниться у кластері, що може призвести до того, що Pod буде заплановано. Підказки щодо черги — це внутрішні сигнали, які дозволяють планувальнику відфільтрувати зміни у кластері, які мають відношення до незапланованого Podʼа, на основі попередніх спроб планування.
