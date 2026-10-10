---
# Removed from Kubernetes
title: ReadOnlyAPIDataVolumes
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.8"
    toVersion: "1.9"
  - stage: stable
    fromVersion: "1.10"
    toVersion: "1.10"

removed: true  
---
Set [`configMap`](/docs/concepts/storage/volumes/#configmap), 
[`secret`](/docs/concepts/storage/volumes/#secret), 
[`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi) and 
[`projected`](/docs/concepts/storage/volumes/#projected) 
{{< glossary_tooltip term_id="volume" text="volumes" >}} to be mounted read-only.

Since Kubernetes v1.10, these volume types are always read-only and you cannot opt out.
