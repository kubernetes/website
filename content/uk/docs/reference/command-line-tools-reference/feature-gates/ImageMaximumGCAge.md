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
---
Вмикає поле конфігурації kubelet `imageMaximumGCAge`, що дозволяє адміністратору вказати вік, після якого образ буде викинуто у смітник.
