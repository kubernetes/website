---
layout: blog
title: "Kubernetes 1.34: Autoconfiguration for Node Cgroup Driver Goes GA"
date: 2025-09-12
slug: cri-cgroup-driver-lookup-now-GA
author: Peter Hunt (Red Hat), Sergey Kanzhelev (Google)
---

Historically, configuring the correct cgroup driver has been a pain point for users running new
Kubernetes clusters. On Linux systems, there are two different cgroup drivers:
`cgroupfs` and `systemd`. In the past, both the [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
and CRI implementation (like CRI-O or containerd) needed to be configured to use
the same cgroup driver, or else the kubelet would misbehave without any explicit
error message. This was a source of headaches for many cluster admins. Now, we've
(almost) arrived at the end of that headache.

## Automated cgroup driver detection

In v1.28.0, the SIG Node community introduced the feature gate
`KubeletCgroupDriverFromCRI`, which instructs the kubelet to ask the CRI
implementation which cgroup driver to use. You can read more [here](/blog/2024/08/21/cri-cgroup-driver-lookup-now-beta/).
After many releases of waiting for each CRI implementation to have major versions released
and packaged in major operating systems, this feature has gone GA as of Kubernetes 1.34.0.

In addition to setting the feature gate, a cluster admin needs to ensure their
CRI implementation is new enough:

- containerd: Support was added in v2.0.0
- CRI-O: Support was added in v1.28.0

## Announcement: Kubernetes is deprecating containerd v1.y support

While CRI-O releases versions that match Kubernetes versions, and thus CRI-O
versions without this behavior are no longer supported, containerd maintains its
own release cycle. containerd support for this feature is only in v2.0 and
later, but Kubernetes 1.34 still supports containerd 1.7 and other LTS releases
of containerd.

The Kubernetes SIG Node community has formally agreed upon a final support
timeline for containerd v1.y. The last Kubernetes release to offer this support
will be the last released version of v1.35, and support will be dropped in
v1.36.0. To assist administrators in managing this future transition,
a new detection mechanism is available. You are able to monitor
the `kubelet_cri_losing_support` metric to determine if any nodes in your cluster
are using a containerd version that will soon be outdated. The presence of
this metric with a version label of `1.36.0` will indicate that the node's containerd
runtime is not new enough for the upcoming requirements. Consequently, an
administrator will need to upgrade containerd to v2.0 or a later version before,
or at the same time as, upgrading the kubelet to v1.36.0.