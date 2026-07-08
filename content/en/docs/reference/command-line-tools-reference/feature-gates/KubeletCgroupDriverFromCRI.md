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

See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver)
for more details.