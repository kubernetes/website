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
---

<!--
Enable kubelet to send the service account token bound to the pod for which the image is being pulled to the credential provider plugin.
-->
允许 kubelet 在拉取镜像时，将绑定到 Pod 的服务账户令牌发送给凭据提供程序插件。
