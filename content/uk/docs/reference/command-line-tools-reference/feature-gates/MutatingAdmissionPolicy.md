---
title: MutatingAdmissionPolicy
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.33"
  - stage: beta
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
---

Вмикає підтримку [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/), що дозволяє [CEL](/docs/reference/using-api/cel/) використовувати мутації під час контролю допуску.

У версіях Kubernetes v1.30 та v1.31 ця функціональна можливість існувала, але не мала жодного ефекту.
