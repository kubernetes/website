---
# Removed from Kubernetes
title: ReadOnlyAPIDataVolumes
content_type: feature_gate

build:
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
Встановлює [`configMap`](/docs/reference/storage/volume-types/#configmap),  [`secret`](/docs/reference/storage/volume-types/#secret), [`downwardAPI`](/docs/reference/storage/volume-types/#downwardapi) та [`projected`](/docs/reference/storage/volume-types/#projected) {{< glossary_tooltip term_id="volume" text="тому" >}} для монтування в режимі "тільки читання".

Починаючи з Kubernetes v1.10, ці типи томів завжди є тільки для читання, і ви не можете відмовитися від цього.
