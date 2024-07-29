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
---

Enable `selectableFields` in the
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} API to allow filtering
of custom resource **list**, **watch** and **deletecollection** requests.
