---
title: RelaxedServiceNameValidation
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"

---

Уможливлює спрощену перевірку імен обʼєктів Service, дозволяючи використовувати [імена міток RFC 1123](/docs/concepts/overview/working-with-objects/names/#dns-label-names) замість [імен міток RFC 1035](/docs/concepts/overview/working-with-objects/names/#rfc-1035-label-names).

Ця функція дозволяє іменам обʼєктів Service починатися з цифри.
