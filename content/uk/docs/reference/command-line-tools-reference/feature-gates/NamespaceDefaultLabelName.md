---
# Removed from Kubernetes
title: NamespaceDefaultLabelName
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"

removed: true
---
Налаштуйте API Server на встановлення незмінної {{< glossary_tooltip text="мітки" term_id="label" >}} `kubernetes.io/metadata.name` у всіх просторах назв, що містить назву простору назв.
