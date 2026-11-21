---
title: SchedulerPopFromBackoffQ
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
Покращує поведінку черги планування, виштовхуючи Podʼи з backoffQ, коли activeQ порожній. Це дозволяє обробляти потенційно придатні для планування Podʼи якнайшвидше, усуваючи штрафний ефект черги backoff.
