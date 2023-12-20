---
# Removed from Kubernetes
title: NamespaceDefaultLabelName
content_type: feature_gate

_build:
  list: never
  render: false
---
Configure the API Server to set an immutable
{{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/metadata.name`
on all namespaces, containing the namespace name.
