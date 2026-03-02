---
title: QOSReserved
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.11"
---
Дозволяє резервувати ресурси на рівні QoS, запобігаючи тим самим тому, щоб підсистеми на рівнях QoS нижчого рівня виходили за межі ресурсів, запитаних на рівнях QoS вищого рівня (наразі лише памʼять).
