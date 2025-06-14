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
启用 `spec.securityContext.seLinuxChangePolicy` 字段。
此字段可用于筛选不希望使用挂载选项来打上 SELinux 标签的 Pod 卷。
当支持使用 SELinux 挂载选项挂载的单个卷在带有不同 SELinux 标签的
Pod（例如特权 Pod 和非特权 Pod）之间共享时，此字段是必需的。

<!--
Enabling the `SELinuxChangePolicy` feature gate requires the feature gate `SELinuxMountReadWriteOncePod` to
be enabled.
-->
想要启用 `SELinuxChangePolicy` 特性门控，需要先启用 `SELinuxMountReadWriteOncePod` 特性门控。
