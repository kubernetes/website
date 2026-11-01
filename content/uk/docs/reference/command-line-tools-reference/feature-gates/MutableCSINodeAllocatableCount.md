---
title: MutableCSINodeAllocatableCount
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
---
Робить поле `.spec.drivers[*].allocatable.count` у CSINode змінним. Також увімкнено поле CSIDriver `nodeAllocatableUpdatePeriodSeconds`.

Це дозволяє періодично оновлювати звітну ємність томів, що виділяються для вузла, запобігаючи застряганню подівів зі збереженням стану через застарілу інформацію, на яку покладається планувальник kube-scheduler.
