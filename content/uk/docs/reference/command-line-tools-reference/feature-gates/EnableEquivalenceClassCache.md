---
# Removed from Kubernetes
title: EnableEquivalenceClassCache
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.12"
  - stage: deprecated
    fromVersion: "1.13"
    toVersion: "1.23"    

removed: true  
---
Дозволяє планувальнику кешувати еквівалентність вузлів при плануванні Podʼів.
