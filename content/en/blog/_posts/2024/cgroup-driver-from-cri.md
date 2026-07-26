---
layout: blog
title: "Kubernetes 1.31: Autoconfiguration For Node Cgroup Driver (beta)"
date: 2024-08-21
slug: cri-cgroup-driver-lookup-now-beta
author: >
  Peter Hunt (Red Hat)
---

Historically, configuring the correct cgroup driver has been a pain point for users running new
Kubernetes clusters. On Linux systems, there are two different cgroup drivers:
`cgroupfs` and `systemd`. In the past, both the [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
and CRI implementation (like CRI-O or containerd) needed to be configured to use
the same cgroup driver, or else the kubelet would exit with an error. This was a
source of headaches for many cluster admins. However, there is light at the end of the tunnel!

## Automated cgroup driver detection

In v1.28.0, the SIG Node community introduced the feature gate
`KubeletCgroupDriverFromCRI`, which instructs the kubelet to ask the CRI
implementation which cgroup driver to use. A few minor releases of Kubernetes
happened whilst we waited for support to land in the major two CRI implementations
(containerd and CRI-O), but as of v1.31.0, this feature is now beta!

In addition to setting the feature gate, a cluster admin needs to ensure their
CRI implementation is new enough:

- containerd: Support was added in v2.0.0
- CRI-O: Support was added in v1.28.0

Then, they should ensure their CRI implementation is configured to the
cgroup_driver they would like to use.

## Future work

Eventually, support for the kubelet's `cgroupDriver` configuration field will be
dropped, and the kubelet will fail to start if the CRI implementation isn't new
enough to have support for this feature.