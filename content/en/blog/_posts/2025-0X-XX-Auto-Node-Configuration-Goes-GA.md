---
layout: blog
title: "Kubernetes 1.34: Autoconfiguration for Node Cgroup Driver Goes GA"
date: 2025-0X-XX
draft: true
slug: cri-cgroup-driver-lookup-now-GA
author: Peter Hunt (Red Hat)
---

Historically, configuring the correct cgroup driver has been a pain point for users running new
Kubernetes clusters. On Linux systems, there are two different cgroup drivers:
`cgroupfs` and `systemd`. In the past, both the [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
and CRI implementation (like CRI-O or containerd) needed to be configured to use
the same cgroup driver, or else the kubelet would exit with an error. This was a
source of headaches for many cluster admins. Now, we've (almost) arrived at the end of
that headache.

## Automated cgroup driver detection

In v1.28.0, the SIG Node community introduced the feature gate
`KubeletCgroupDriverFromCRI`, which instructs the kubelet to ask the CRI
implementation which cgroup driver to use. After many releases of waiting for
each CRI implementation to have major versions released and packaged in major
operating systems, this feature has gone GA as of Kubernetes 1.34.0.

In addition to setting the feature gate, a cluster admin needs to ensure their
CRI implementation is new enough:

- containerd: Support was added in v2.0.0
- CRI-O: Support was added in v1.28.0

## Announcement: containerd v1.y is deprecated

While CRI-O releases versions that match Kubernetes versions, and thus CRI-O
versions without this behavior are no longer supported, containerd maintains its
own release cycle. containerd support for this feature is only in v2.0 and
later, but Kubernetes 1.34 still supports containerd 1.7 and other LTS releases
of containerd.

The Kubernetes SIG node community has agreed on a final release for containerd v1.y support:
Kubernetes 1.36.0. An admin can discover if containerd is not new enough on any of their nodes,
with the metric `kubelet_cri_losing_support`. If this metric is present, and the
`version` label is `1.36.0`, that means your containerd version must be upgraded
to v2.0 or later by the time your kubelets are upgraded to v1.36.0.
