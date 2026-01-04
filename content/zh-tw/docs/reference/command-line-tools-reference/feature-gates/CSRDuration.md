---
# Removed from Kubernetes
title: CSRDuration
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"

removed: true  
---
<!--
Allows clients to request a duration for certificates issued
via the Kubernetes CSR API.
-->
允許客戶端爲通過 Kubernetes CSR API 簽署的證書申請有效期限。
