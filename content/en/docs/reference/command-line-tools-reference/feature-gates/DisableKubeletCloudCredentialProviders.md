---
title: DisableKubeletCloudCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"

---
Enabling the feature gate deactivated the legacy in-tree functionality within the
kubelet, that allowed the kubelet to to authenticate to a cloud provider container registry
for container image pulls.
