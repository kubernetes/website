---
title: PodHostIPs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
---
Enable the `status.hostIPs` field for pods and the {{< glossary_tooltip term_id="downward-api" text="downward API" >}}.
The field lets you expose host IP addresses to workloads.
