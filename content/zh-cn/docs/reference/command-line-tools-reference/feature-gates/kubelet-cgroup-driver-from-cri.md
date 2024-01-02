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
---

<!--
Enable detection of the kubelet cgroup driver
configuration option from the {{<glossary_tooltip term_id="cri" text="CRI">}}.
You can use this feature gate on nodes with a kubelet that supports the feature gate
and where there is a CRI container runtime that supports the `RuntimeConfig`
CRI call. If both CRI and kubelet support this feature, the kubelet ignores the
`cgroupDriver` configuration setting (or deprecated `--cgroup-driver` command
line argument). If you enable this feature gate and the container runtime
doesn't support it, the kubelet falls back to using the driver configured using
the `cgroupDriver` configuration setting.
See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver)
for more details.
-->
启用检测来自 {{<glossary_tooltip term_id="cri" text="CRI">}}
的 kubelet cgroup 驱动配置选项。你可以在支持该特性门控的 kubelet 节点上使用此特性门控，
也可以在支持 `RuntimeConfig` CRI 调用的 CRI 容器运行时所在节点上使用此特性门控。
如果 CRI 和 kubelet 都支持此特性，kubelet 将忽略 `cgroupDriver` 配置设置（或已弃用的 `--cgroup-driver` 命令行参数）。
如果你启用此特性门控但容器运行时不支持它，则 kubelet 将回退到使用通过 `cgroupDriver` 配置设置进行配置的驱动。
详情参见[配置 cgroup 驱动](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。
