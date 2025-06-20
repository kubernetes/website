---
title: KubeletEnsureSecretPulledImages
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
Ensure that pods requesting an image are authorized to access the image
with the provided credentials when the image is already present on the node.
See [Ensure Image Pull Credential Verification](/docs/concepts/containers/images#ensureimagepullcredentialverification).
-->
确保请求某镜像的 Pod 在节点上已有此镜像的情况下，能够使用所提供的凭据授权访问此镜像。  
参见[确保镜像拉取凭据验证](/zh-cn/docs/concepts/containers/images#ensureimagepullcredentialverification)。
