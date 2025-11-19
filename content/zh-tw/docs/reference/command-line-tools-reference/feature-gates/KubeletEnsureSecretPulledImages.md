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
確保請求某鏡像的 Pod 在節點上已有此鏡像的情況下，能夠使用所提供的憑據授權訪問此鏡像。  
參見[確保鏡像拉取憑據驗證](/zh-cn/docs/concepts/containers/images#ensureimagepullcredentialverification)。
