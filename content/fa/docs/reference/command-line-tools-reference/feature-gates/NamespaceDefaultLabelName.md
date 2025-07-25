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
سرور API را طوری پیکربندی کنید که یک {{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/metadata.name` تغییرناپذیر را روی همه فضاهای نام، شامل نام namespace، تنظیم کند.
