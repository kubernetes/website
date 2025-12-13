---
title: SELinuxChangePolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Enables `spec.securityContext.seLinuxChangePolicy` field.
This field can be used to opt-out from applying the SELinux label to the pod
volumes using mount options. This is required when a single volume that supports
mounting with SELinux mount option is shared between Pods that have different
SELinux labels, such as a privileged and unprivileged Pods.
-->
啓用 `spec.securityContext.seLinuxChangePolicy` 字段。
此字段可用於篩選不希望使用掛載選項來打上 SELinux 標籤的 Pod 卷。
當支持使用 SELinux 掛載選項掛載的單個卷在帶有不同 SELinux 標籤的
Pod（例如特權 Pod 和非特權 Pod）之間共享時，此字段是必需的。

<!--
Enabling the `SELinuxChangePolicy` feature gate requires the feature gate `SELinuxMountReadWriteOncePod` to
be enabled.
-->
想要啓用 `SELinuxChangePolicy` 特性門控，需要先啓用 `SELinuxMountReadWriteOncePod` 特性門控。
