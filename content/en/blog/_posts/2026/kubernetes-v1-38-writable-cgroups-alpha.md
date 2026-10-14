---
layout: blog
title: "Kubernetes v1.38: Writable cgroups for unprivileged containers (alpha)"
draft: true
slug: kubernetes-v1-38-writable-cgroups-alpha
author: >
  [Chris Henzie](https://github.com/chrishenzie) (Google),
  [Divya Rani](https://github.com/Divya063)
---

Placeholder for the
[KEP-5474](https://github.com/kubernetes/enhancements/issues/5474) writable
cgroups feature blog.

<!-- TODO: Introduce the `cgroupOptions` field in a container's `securityContext` and the `CgroupOptions` feature gate. -->

## Why writable cgroups?

<!-- TODO: Use cases from the KEP: nested containers, and dividing a container's resources between its processes. -->

## How to use it

<!-- TODO: Example Pod with `cgroupOptions.mountMode: ReadWrite`, and the meaning of each `mountMode` value. -->

## Node requirements

<!-- TODO: cgroup v2 with `nsdelegate`, `cgroupsPerQOS`, container runtime support, and Node Declared Features scheduling. -->

## Limits on the cgroups a Pod creates

<!-- TODO: The cgroup count and depth limits that the kubelet sets. -->

## What's next?

<!-- TODO: Beta plans for v1.39, and how to give feedback to SIG Node. -->
