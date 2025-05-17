---
title: ServiceAccountTokenPodNodeInfo
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

Керує тим, чи вбудовувати імʼя вузла та uid для повʼязаного з ним вузла при видачі токенів службових облікових записів, привʼязаних до обʼєктів Pod.
