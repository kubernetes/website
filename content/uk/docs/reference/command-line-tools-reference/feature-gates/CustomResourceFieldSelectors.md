---
title: CustomResourceFieldSelectors
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

Вмикає `selectableFields` в API {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, щоб дозволити фільтрацію запитів **list**, **watch** та **deletecollection** для власних ресурсів.
