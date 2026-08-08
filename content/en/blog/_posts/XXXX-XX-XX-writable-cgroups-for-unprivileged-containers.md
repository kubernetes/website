---
layout: blog
title: "Writable Cgroups for Unprivileged Containers"
date: XXXX-XX-XX
slug: writable-cgroups-for-unprivileged-containers
draft: true
author: >
  Divya Rani (GitLab)
  Chris Henzie (Google)
---

<!--
SKELETON / PLACEHOLDER — KEP-5474 (Enable Writable Cgroups), alpha in v1.37.
Use XX for the date in both the front matter `date:` and the filename until the
comms team assigns a publication date. Remove `draft: true` before publishing.
Tracking: https://github.com/kubernetes/enhancements/issues/5474
-->

Kubernetes v1.37 introduces (as an alpha feature) the ability for unprivileged
containers to be granted writable access to their own cgroup subtree on cgroup v2
nodes, via a new `cgroupOptions` field in the container `securityContext`.

## The problem

<!-- TODO: Why unprivileged workloads need to manage their own cgroups today
Mention the motivating workloads: Docker-in-Docker, Ray, KubeVirt. -->

## What's new in v1.37

<!-- TODO: Introduce the API. Short example. -->

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: writable-cgroups-example
spec:
  containers:
  - name: app
    image: myapp:latest
    securityContext:
      cgroupOptions:
        mountMode: Writable
```

## How it works

<!-- TODO:
- cgroup v2 + nsdelegate isolation model (container manages only its own subtree).
- The kubelet sets cgroup.max.descendants / cgroup.max.depth on the Pod-level cgroup
  to bound descendant cgroup creation.
- Runtime support is advertised at the node level (NodeFeatures); the kubelet
  fails fast if the runtime does not support it.
-->

## How to try it out

<!-- TODO:
- Requirements: cgroup v2 node with nsdelegate, a runtime that supports the CRI
  cgroup_mount_mode field (containerd / CRI-O versions TBD).
- Enable the `CgroupOptions` feature gate on kube-apiserver and kubelet.
- A short, copy-pasteable verification (mount | grep cgroup2 shows rw; mkdir in
  /sys/fs/cgroup succeeds).
-->

## Security considerations

<!-- TODO: nsdelegate guarantees, Pod Security Standards interaction, why it stays
opt-in and restricted by default. -->

## What's next

<!-- TODO: Beta plans — feature gate on by default, both containerd and CRI-O
shipping support, optional user-tunable maxDescendants/maxDepth overrides. -->

## Getting involved

<!-- TODO: SIG Node, the KEP link, how to give feedback as an early adopter. -->

This work is tracked in [KEP-5474](https://github.com/kubernetes/enhancements/issues/5474)
by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
