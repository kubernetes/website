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
Ensure that pods requesting an image are authorized to access the image
with the provided credentials when the image is already present on the node.
See [Ensure Image Pull Credential Verification](/docs/concepts/containers/images#ensureimagepullcredentialverification).
