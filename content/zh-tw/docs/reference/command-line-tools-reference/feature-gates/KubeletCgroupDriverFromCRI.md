---
title: KubeletCgroupDriverFromCRI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enable detection of the kubelet cgroup driver
configuration option from the {{<glossary_tooltip term_id="cri" text="CRI">}}.
This feature gate is now on for all clusters. However, it only works on nodes
where there is a CRI container runtime that supports the `RuntimeConfig`
CRI call. If the CRI supports this feature, the kubelet ignores the
`cgroupDriver` configuration setting (or deprecated `--cgroup-driver` command
line argument). If the container runtime
doesn't support it, the kubelet falls back to using the driver configured using
the `cgroupDriver` configuration setting.
The kubelet will stop falling back to this configuration in Kubernetes 1.36.
Thus, users must upgrade their CRI container runtime to a version that supports
the `RuntimeConfig` CRI call by then. Admins can use the metric
`kubelet_cri_losing_support` to see if there are any nodes in their cluster that
will lose support in 1.36. The following CRI versions support this CRI call:

* containerd: Support was added in v2.0.0
* CRI-O: Support was added in v1.28.0
-->
啓用檢測來自 {{<glossary_tooltip term_id="cri" text="CRI">}}
的 kubelet CGroup 驅動配置選項。
此特性門控現已對所有集羣開啓。然而，它僅在有支持 `RuntimeConfig`
CRI 調用的 CRI 容器運行時的節點上工作。如果 CRI 支持此特性，
kubelet 將忽略 `cgroupDriver` 配置設置（或已棄用的 `--cgroup-driver` 命令行參數）。
如果容器運行時不支持它，則 kubelet 將回退到使用通過 `cgroupDriver` 配置設置進行配置的驅動。
kubelet 將在 Kubernetes 1.36 中停止回退到此配置。因此，用戶必須升級其 CRI 容器運行時到支持
`RuntimeConfig` CRI 調用的版本。管理員可以使用指標
`kubelet_cri_losing_support` 來查看集羣中是否有節點將在 1.36 版本中失去支持。
以下 CRI 版本支持此 CRI 調用：

* containerd：在 v2.0.0 版本中添加了對此特性的支持
* CRI-O：在 v1.28.0 版本中添加了對此特性的支持

<!--
See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver)
for more details.
-->
詳情參見[配置 CGroup 驅動](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
