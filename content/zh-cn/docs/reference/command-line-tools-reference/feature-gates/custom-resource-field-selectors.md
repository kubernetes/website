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

<!--
Enable `selectableFields` in the
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} API to allow filtering
of custom resource **list**, **watch** and **deletecollection** requests.
-->
在 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} API 中启用
`selectableFields`，以针对 **list**、**watch** 和 **deletecollection** 请求过滤自定义资源。
