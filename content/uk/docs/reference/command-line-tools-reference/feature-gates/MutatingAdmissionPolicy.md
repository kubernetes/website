---
title: MutatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---

Вмикає підтримку [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/) для використання мутацій [CEL](/docs/reference/using-api/cel/) у контролі допуску.

У версіях Kubernetes v1.30 та v1.31 ця функціональна можливість існувала, але не мала жодного ефекту.
