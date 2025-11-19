---
title: KubeletServiceAccountTokenForCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enable kubelet to send the service account token bound to the pod for which the image is being pulled to the credential provider plugin.
-->
允許 kubelet 在拉取鏡像時，將綁定到 Pod 的服務賬戶令牌發送給憑據提供程序插件。
