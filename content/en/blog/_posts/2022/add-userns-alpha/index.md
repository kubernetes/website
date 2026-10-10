---
layout: blog
title: "Kubernetes 1.25: alpha support for running Pods with user namespaces"
date: 2022-10-03
slug: userns-alpha
author: >
  Rodrigo Campos (Microsoft),
  Giuseppe Scrivano (Red Hat)
---

Kubernetes v1.25 introduces the support for user namespaces.

This is a major improvement for running secure workloads in
Kubernetes.  Each pod will have access only to a limited subset of the
available UIDs and GIDs on the system, thus adding a new security
layer to protect from other pods running on the same system.

## How does it work?
A process running on Linux can use up to 4294967296 different UIDs and
GIDs.

User namespaces is a Linux feature that allows mapping a set of users
in the container to different users in the host, thus restricting what
IDs a process can effectively use.
Furthermore, the capabilities granted in a new user namespace do not
apply in the host initial namespaces.

## Why is it important?
There are mainly two reasons why user namespaces are important:

- improve security since they restrict the IDs a pod can use, so each
pod can run in its own separate environment with unique IDs.

- enable running workloads as root in a safer manner.

In a user namespace we can map the root user inside the pod to a
non-zero ID outside the container, containers believe in running as
root while they are a regular unprivileged ID from the host point of
view.

The process can keep capabilities that are usually restricted to
privileged pods and do it in a safe way since the capabilities granted
in a new user namespace do not apply in the host initial namespaces.

## How do I enable user namespaces?
At the moment, user namespaces support is opt-in, so you must enable
it for a pod setting `hostUsers` to `false` under the pod spec stanza:
```
apiVersion: v1
kind: Pod
spec:
  hostUsers: false
  containers:
  - name: nginx
    image: docker.io/nginx
```

The feature is behind a feature gate, so make sure to enable
the `UserNamespacesStatelessPodsSupport` gate before you can use
the new feature.

The runtime must also support user namespaces:

* containerd: support is planned for the 1.7 release.  See containerd
  issue [#7063][containerd-userns-issue] for more details.

* CRI-O: v1.25 has support for user namespaces.

Support for this in `cri-dockerd` is [not planned][CRI-dockerd-issue] yet.

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74
[containerd-userns-issue]: https://github.com/containerd/containerd/issues/7063

## How do I get involved?
You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact us directly:
- GitHub / Slack: @rata @giuseppe
