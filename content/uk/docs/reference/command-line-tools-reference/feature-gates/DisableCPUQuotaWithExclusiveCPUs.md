---
title: DisableCPUQuotaWithExclusiveCPUs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
Коли функціональна можливість `DisableCPUQuotaWithExclusiveCPUs` увімкнена (типово), Kubernetes **не** застосовує квоту на використання CPU для Podʼів, які використовують [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed) {{< glossary_tooltip text="клас QoS" term_id="qos-class" >}}.

Ви можете вимкнути функціональну можливість `DisableCPUQuotaWithExclusiveCPUs`, щоб відновити попередню поведінку.
