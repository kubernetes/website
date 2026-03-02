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
Встановлює [`configMap`](/docs/concepts/storage/volumes/#configmap),  [`secret`](/docs/concepts/storage/volumes/#secret), [`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi) та [`projected`](/docs/concepts/storage/volumes/#projected) {{< glossary_tooltip term_id="volume" text="тому" >}} для монтування в режимі "тільки читання".

Починаючи з Kubernetes v1.10, ці типи томів завжди є тільки для читання, і ви не можете відмовитися від цього.
