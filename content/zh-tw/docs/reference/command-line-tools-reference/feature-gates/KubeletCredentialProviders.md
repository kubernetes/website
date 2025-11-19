---
title: KubeletCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.23"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.28"

removed: true
---

<!--
Enable kubelet exec credential providers for
image pull credentials.
-->
啓用 kubelet exec 憑據提供程序以獲取鏡像拉取憑據。
