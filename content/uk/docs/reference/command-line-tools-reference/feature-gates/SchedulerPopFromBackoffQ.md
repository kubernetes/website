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
Покращує поведінку черги планування, виштовхуючи pod'и з backoffQ, коли activeQ порожній. Це дозволяє обробляти потенційно заплановані pod'и якнайшвидше, усуваючи штрафний ефект черги backoff.
