---
title: ClearingNominatedNodeNameAfterBinding
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.34"
---

Дозволяє очищати `.status.nominatedNodeName` щоразу, коли Podʼи привʼязуються до вузлів.
