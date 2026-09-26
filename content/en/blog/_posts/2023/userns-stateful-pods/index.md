---
layout: blog
title: "User Namespaces: Now Supports Running Stateful Pods in Alpha!"
date: 2023-09-13
slug: userns-alpha
author: >
  Rodrigo Campos Catelin (Microsoft),
  Giuseppe Scrivano (Red Hat),
  Sascha Grunert (Red Hat)
---

Kubernetes v1.25 introduced support for user namespaces for only stateless
pods. Kubernetes 1.28 lifted that restriction, after some design changes were
done in 1.27.

The beauty of this feature is that:
 * it is trivial to adopt (you just need to set a bool in the pod spec)
 * doesn't need any changes for **most** applications
 * improves security by _drastically_ enhancing the isolation of containers and
   mitigating CVEs rated HIGH and CRITICAL.

This post explains the basics of user namespaces and also shows:
 * the changes that arrived in the recent Kubernetes v1.28 release
 * a **demo of a vulnerability rated as HIGH** that is not exploitable with user namespaces
 * the runtime requirements to use this feature
 * what you can expect in future releases regarding user namespaces.

## What is a user namespace?

A user namespace is a Linux feature that isolates the user and group identifiers
(UIDs and GIDs) of the containers from the ones on the host. The indentifiers
in the container can be mapped to indentifiers on the host in a way where the
host UID/GIDs used for different containers never overlap. Even more, the
identifiers can be mapped to *unprivileged* non-overlapping UIDs and GIDs on the
host. This basically means two things:

 * As the UIDs and GIDs for different containers are mapped to different UIDs
   and GIDs on the host, containers have a harder time to attack each other even
   if they escape the container boundaries. For example, if container A is running
   with different UIDs and GIDs on the host than container B, the operations it
   can do on container B's files and process are limited: only read/write what a
   file allows to others, as it will never have permission for the owner or
   group (the UIDs/GIDs on the host are guaranteed to be different for
   different containers).

 * As the UIDs and GIDs are mapped to unprivileged users on the host, if a
   container escapes the container boundaries, even if it is running as root
   inside the container, it has no privileges on the host. This greatly
   protects what host files it can read/write, which process it can send signals
   to, etc.

Furthermore, capabilities granted are only valid inside the user namespace and
not on the host.

Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capabilities
were granted to the container, the capabilities are valid on the host too. None
of this is true when using user namespaces (modulo bugs, of course 🙂).

## Changes in 1.28

As already mentioned, starting from 1.28, Kubernetes supports user namespaces
with stateful pods. This means that pods with user namespaces can use any type
of volume, they are no longer limited to only some volume types as before.

The feature gate to activate this feature was renamed, it is no longer
`UserNamespacesStatelessPodsSupport` but from 1.28 onwards you should use
`UserNamespacesSupport`. There were many changes done and the requirements on
the node hosts changed. So with Kubernetes 1.28 the feature flag was renamed to
reflect this.

## Demo

Rodrigo created a demo which exploits [CVE 2022-0492][cve-link] and shows how
the exploit can occur without user namespaces. He also shows how it is not
possible to use this exploit from a Pod where the containers are using this
feature.

This vulnerability is rated **HIGH** and allows **a container with no special
privileges to read/write to any path on the host** and launch processes as root
on the host too.

{{< youtube id="M4a2b4KkXN8" title="Mitigation of CVE-2022-0492 on Kubernetes by enabling User Namespace support">}}

Most applications in containers run as root today, or as a semi-predictable
non-root user (user ID 65534 is a somewhat popular choice). When you run a Pod
with containers using a userns, Kubernetes runs those containers as unprivileged
users, with no changes needed in your app.

This means two containers running as user 65534 will effectively be mapped to
different users on the host, limiting what they can do to each other in case of
an escape, and if they are running as root, the privileges on the host are
reduced to the one of an unprivileged user.

[cve-link]: https://unit42.paloaltonetworks.com/cve-2022-0492-cgroups/

## Node system requirements

There are requirements on the Linux kernel version as well as the container
runtime to use this feature.

On Linux you need Linux 6.3 or greater. This is because the feature relies on a
kernel feature named idmap mounts, and support to use idmap mounts with tmpfs
was merged in Linux 6.3.

If you are using CRI-O with crun, this is [supported in CRI-O
1.28.1][CRIO-release] and crun 1.9 or greater. If you are using CRI-O with runc,
this is still not supported.

containerd support is currently targeted for containerd 2.0; it is likely that
it won't matter if you use it with crun or runc.

Please note that containerd 1.7 added _experimental_ support for user
namespaces as implemented in Kubernetes 1.25 and 1.26. The redesign done in 1.27
is not supported by containerd 1.7, therefore it only works, in terms of user
namespaces support, with Kubernetes 1.25 and 1.26.

One limitation present in containerd 1.7 is that it needs to change the
ownership of every file and directory inside the container image, during Pod
startup. This means it has a storage overhead and can significantly impact the
container startup latency. Containerd 2.0 will probably include a implementation
that will eliminate the startup latency added and the storage overhead. Take
this into account if you plan to use containerd 1.7 with user namespaces in
production.

None of these containerd limitations apply to [CRI-O 1.28][CRIO-release].

[CRIO-release]: https://github.com/cri-o/cri-o/releases/tag/v1.28.1

## What’s next?

Looking ahead to Kubernetes 1.29, the plan is to work with SIG Auth to integrate user
namespaces to Pod Security Standards (PSS) and the Pod Security Admission. For
the time being, the plan is to relax checks in PSS policies when user namespaces are
in use. This means that the fields `spec[.*].securityContext` `runAsUser`,
`runAsNonRoot`, `allowPrivilegeEscalation` and `capabilities` will not trigger a
violation if user namespaces are in use. The behavior will probably be controlled by
utilizing a API Server feature gate, like `UserNamespacesPodSecurityStandards`
or similar.

## How do I get involved?

You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact us directly:
- GitHub: @rata @giuseppe @saschagrunert
- Slack: @rata @giuseppe @sascha
