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
Forces the Kubelet to re-verify image pull credentials,
even for cached or pre-pulled images. Does not require
authenticating to the registry when pulling an image 
with the same digest and credentials.
 See [Ensure Image Pull Credential Verification](/docs/concepts/containers/images#ensureimagepullcredentialverification).
