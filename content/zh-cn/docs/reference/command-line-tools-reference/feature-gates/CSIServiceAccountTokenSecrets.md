---
title: CSIServiceAccountTokenSecrets
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---

<!--
Enables CSI drivers to opt-in for receiving service account tokens from kubelet
through the dedicated secrets field in NodePublishVolumeRequest instead of the volume_context field.
-->
允许 CSI 驱动选择通过 NodePublishVolumeRequest 中专用的 secrets 字段而不是通过
volume_context 字段从 kubelet 接收服务账号令牌。
