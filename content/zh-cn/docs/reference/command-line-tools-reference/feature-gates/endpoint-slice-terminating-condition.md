---
title: EndpointSliceTerminatingCondition
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.25"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"    

removed: true  
---
<!--
Enables EndpointSlice `terminating` and `serving`
 condition fields.
-->
启用 EndpointSlice 的 `terminating` 和 `serving` 状况字段。
