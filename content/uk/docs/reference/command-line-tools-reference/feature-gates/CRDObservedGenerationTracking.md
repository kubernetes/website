---
title: CRDObservedGenerationTracking
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.35"
---
Дозволяє відстежувати спостережену генерацію в умовах CRD. Встановлення значення false призведе до того, що в умовах CRD спостережена генерація буде видалена.
