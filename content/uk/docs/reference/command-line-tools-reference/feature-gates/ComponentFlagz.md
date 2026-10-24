---
title: ComponentFlagz
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

Увімкнення точки доступу flagz компонента. Докладнішу інформацію наведено у [zpages](/docs/reference/instrumentation/zpages/).
