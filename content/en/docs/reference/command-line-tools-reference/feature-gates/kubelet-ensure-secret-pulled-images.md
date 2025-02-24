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
Forces the Kubelet to re-verify image pull credentials
for pre-puled images.
 See [Pre-pulled Image Authentication](/docs/concepts/containers/images#prepulledimageauthentication).
