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
Ensure that pods using an image are authorized to access the image
with the provided credentials, even if the image is already present.
 See [Ensure Image Pull Credential Verification](/docs/concepts/containers/images#ensureimagepullcredentialverification).
