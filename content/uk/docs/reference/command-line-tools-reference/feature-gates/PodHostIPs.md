---
title: PodHostIPs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
removed: true

---

Вмикає поле `status.hostIPs` для Podʼів та {{< glossary_tooltip term_id="downward-api" text="downward API" >}}. Це поле дозволяє вам показувати IP-адреси хостів робочим навантаженням.
