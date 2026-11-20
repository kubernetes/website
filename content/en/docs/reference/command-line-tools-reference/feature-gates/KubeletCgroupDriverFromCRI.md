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
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.34"
---
Enable detection of the kubelet cgroup driver
configuration option from the {{<glossary_tooltip term_id="cri" text="CRI">}}.
The detection only works on nodes
where there is a CRI container runtime that supports the `RuntimeConfig`
CRI call. If the CRI supports this feature, the kubelet ignores the
`cgroupDriver` configuration setting (or deprecated `--cgroup-driver` command
line argument). If the container runtime
doesn't support that RPC, the kubelet uses a legacy mechanism based on checking
the `cgroupDriver` configuration setting.
The kubelet will stop falling back to this configuration in a future release
of Kubernetes.
Thus, users must upgrade their CRI container runtime to a version that supports
the `RuntimeConfig` CRI call. Admins can use the metric
`kubelet_cri_losing_support` to see if there are any nodes in their cluster that
rely on the legacy behavior.
