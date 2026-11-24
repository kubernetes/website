---
title: DRADeviceBindingConditions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
    toVersion: "1.37"
  - stage: stable
    defaultValue: true
    fromVersion: "1.38"
---
Enables support for [device binding conditions](/docs/concepts/resource-management/dynamic-resource-allocation/how-dra-works/#device-binding-conditions)
in the {{< glossary_tooltip text="DRA" term_id="dra" >}} related fields.
This allows for thorough device readiness checks and attachment processes before Bind phase.