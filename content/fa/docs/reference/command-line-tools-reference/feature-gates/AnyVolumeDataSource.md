---
title: AnyVolumeDataSource
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.23"
  - stage: beta
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
    locked: true
---

فعال کردن استفاده از هر منبع سفارشی به عنوان `DataSource` یک {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}.
