---
title: ConstrainedImpersonation
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Дозволяє імперсонацію, яка обмежується конкретними запитами, та яка не є всеосяжною.
