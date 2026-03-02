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
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"

---
Коли ця опція увімкнена, kube-scheduler використовує `.status.nominatedNodeName`, щоб вказати, де буде прив’язаний Pod. Поле `.status.nominatedNodeName` встановлюється, коли kube-scheduler запускає витіснення подів або передбачає, що фаза WaitOnPermit або PreBinding триватиме відносно довго. Інші компоненти можуть читати та використовувати `.status.nominatedNodeName`, але не повинні встановлювати його.

Коли ця опція вимкнена, kube-scheduler встановлює `.status.nominatedNodeName` лише перед запуском витіснення.
