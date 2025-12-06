---
title: MutableCSINodeAllocatableCount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---

Коли функціональну можливість увімкнено, поле `.spec.drivers[*].allocatable.count` у CSINode стає змінним, а в обʼєкті CSIDriver зʼявляється нове поле `nodeAllocatableUpdatePeriodSeconds`. Це дозволяє періодично оновлювати звітну ємність томів, що виділяються для вузла, запобігаючи застряганню podʼів зі збереженням стану через застарілу інформацію, на яку покладається планувальник kube-scheduler.
