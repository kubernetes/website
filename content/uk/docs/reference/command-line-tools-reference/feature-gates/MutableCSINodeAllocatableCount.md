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
Коли увімкнено цю функцію, поле `CSINode.Spec.Drivers[*].Allocatable.Count` стає змінним, а в обʼєкті `CSIDriver` зʼявляється нове поле, `NodeAllocatableUpdatePeriodSeconds`. Це дозволяє періодично оновлювати том, що виділяється для вузла, запобігаючи застряганню podʼів зі збереженням стану через застарілу інформацію, на яку покладається планувальник `kube-scheduler`.
