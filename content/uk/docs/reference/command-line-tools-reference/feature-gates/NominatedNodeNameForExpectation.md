---
title: NominatedNodeNameForExpectation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"

---

Коли функціональну можливість увімкнено, kube-scheduler використовує `.status.nominatedNodeName`, щоб вказати, де буде привʼязано Pod. Зовнішні компоненти також можуть записувати в `.status.nominatedNodeName` для Pod, щоб надати запропоноване розміщення.
