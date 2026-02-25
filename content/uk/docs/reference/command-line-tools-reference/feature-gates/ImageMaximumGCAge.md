---
title: ImageMaximumGCAge
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
    toVersion: "1.34"
  - stage: stable
    defaultValue: true
    fromVersion: "1.35"
---
Вмикає поле конфігурації kubelet `imageMaximumGCAge`, що дозволяє адміністратору вказати вік, після якого образ буде викинуто у смітник.
