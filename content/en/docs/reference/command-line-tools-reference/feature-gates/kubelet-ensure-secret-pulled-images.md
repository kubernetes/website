---
title: KubeletEnsureSecretPulledImages
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
---
Enables kubelet to ensure images pulled with pod `imagePullSecrets` are authenticated by other pods that do not have the same credentials.
This featuregate enables the admins to configure the newly introduced fields of the [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration) namely `pullImageSecretRecheck` and `pullImageSecretRecheckPeriod`
More details about the use-cases of these configuration fields and the featuregate are defined [here](/docs/concepts/containers/images/#use-cases)
