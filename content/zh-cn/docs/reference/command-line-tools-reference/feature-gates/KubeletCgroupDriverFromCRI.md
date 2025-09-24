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
启用检测来自 {{<glossary_tooltip term_id="cri" text="CRI">}}
的 kubelet CGroup 驱动配置选项。
此特性门控现已对所有集群开启。然而，它仅在有支持 `RuntimeConfig`
CRI 调用的 CRI 容器运行时的节点上工作。如果 CRI 支持此特性，
kubelet 将忽略 `cgroupDriver` 配置设置（或已弃用的 `--cgroup-driver` 命令行参数）。
如果容器运行时不支持它，则 kubelet 将回退到使用通过 `cgroupDriver` 配置设置进行配置的驱动。
kubelet 将在 Kubernetes 1.36 中停止回退到此配置。因此，用户必须升级其 CRI 容器运行时到支持
`RuntimeConfig` CRI 调用的版本。管理员可以使用指标
`kubelet_cri_losing_support` 来查看集群中是否有节点将在 1.36 版本中失去支持。
以下 CRI 版本支持此 CRI 调用：

* containerd：在 v2.0.0 版本中添加了对此特性的支持
* CRI-O：在 v1.28.0 版本中添加了对此特性的支持

<!--
See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver)
for more details.
-->
详情参见[配置 CGroup 驱动](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
