---
layout: blog
title: "Kubernetes v1.36: User Namespaces in Kubernetes are finally GA"
date: 2026-04-23T10:35:00-08:00
slug: kubernetes-v1-36-userns-ga
author: >
  Rodrigo Campos Catelin (Amutable),
  Giuseppe Scrivano (Red Hat)
---
After several years of development, User Namespaces support in
Kubernetes reached General Availability (GA) with the v1.36 release.
This is a Linux-only feature.

For those of us working on low level container runtimes and rootless
technologies, this has been a long awaited milestone. We finally
reached the point where "rootless" security isolation can be used for
Kubernetes workloads.

This feature also enables a critical pattern: running workloads with
privileges and still being confined in the user namespace.  When
`hostUsers: false` is set, capabilities like `CAP_NET_ADMIN` become
**namespaced**, meaning they grant administrative power over container
local resources without affecting the host.  This effectively enables
new use cases that were not possible before without running a fully
privileged container.

## The Problem with UID 0

A process running as root inside a container is also seen from the
kernel as root on the host.  If an attacker manages to break out of
the container, whether through a kernel vulnerability or a
misconfigured mount, they are root on the host.

While there are many security measures in place for running
containers, these measures don't change the underlying identity of the
process, it still has some "parts" of root.

## The engine: ID-mapped mounts

The road to GA wasn't just about the Kubernetes API; it was about
making the kernel work for us.  In the early stages, one of the
biggest blockers was volume ownership.  If you mapped a container to a
high UID range, the Kubelet had to recursively `chown` every file in
the attached volume so the container could read/write them.  For large
volumes, this was such an expensive operation that destroyed startup
performance.

The key enabler was *ID-mapped mounts* (introduced in Linux
5.12 and refined in later versions). Instead of rewriting file
ownership on disk, the kernel remaps it at mount time.

When a volume is mounted into a Pod with User Namespaces enabled, the
kernel performs a transparent translation of the UIDs (user ids) and
GIDs (group ids). To the container, the files appear owned by
UID 0. On disk, file ownership is unchanged — no `chown` is needed.
This is an `O(1)` operation, instant and efficient.

## Using it in Kubernetes v1.36

Using user namespaces is straightforward: all you need to do is set
`hostUsers: false` in your Pod spec. No changes to your container
images, no complex configuration. The interface remains the same one
introduced during the Alpha phase. In the `spec` for a Pod (or PodTemplate), you explicitly
opt-out of the host user namespace:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: isolated-workload
spec:
  hostUsers: false
  containers:
  - name: app
    image: fedora:42
    securityContext:
      runAsUser: 0
```

For more details on how user namespaces work in practice and demos of
CVEs rated HIGH mitigated, see the previous blog posts:
[User Namespaces alpha](/blog/2022/10/03/userns-alpha/),
[User Namespaces stateful pods in alpha](/blog/2023/09/13/userns-alpha/),
[User Namespaces beta](/blog/2024/04/22/userns-beta/), and
[User Namespaces enabled by default](/blog/2025/04/25/userns-enabled-by-default/).

## Getting involved

If you're interested in user namespaces or want to contribute, here
are some useful links:

- [User Namespaces documentation](/docs/concepts/workloads/pods/user-namespaces/)
- [KEP-127: Support User Namespaces](https://kep.k8s.io/127)
- [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)

## Acknowledgments

This feature has been years in the making: the first KEP was opened
10 years ago by other contributors, and we have been actively working
on it for the last 6 years. We'd like to thank everyone who
contributed across SIG Node, the container runtimes, and the Linux
kernel. Special thanks to the reviewers and early adopters who helped
shape the design through multiple alpha and beta cycles.
