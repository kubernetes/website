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
確保請求某映像檔的 Pod 在節點上已有此映像檔的情況下，能夠使用所提供的憑據授權訪問此映像檔。  
參見[確保映像檔拉取憑據驗證](/zh-cn/docs/concepts/containers/images#ensureimagepullcredentialverification)。
