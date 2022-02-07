---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title:    Security For Windows Nodes
content_type: concept
weight: 75
---

<!-- overview -->

This page describes security considerations and best practices specific to the Windows operating system.

<!-- body -->

On Windows, data from Secrets are written out in clear text onto the node's local
storage (as compared to using tmpfs / in-memory filesystems on Linux). As a cluster
operator, you should take both of the following additional measures:

1. Use file ACLs to secure the Secrets' file location.
1. Apply volume-level encryption using [BitLocker](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server).

[RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername)
can be specified for Windows Pods or containers to execute the container
processes as a node-default user. This is roughly equivalent to
[RunAsUser](/docs/concepts/policy/pod-security-policy/#users-and-groups).

Linux-specific pod security context privileges such as SELinux, AppArmor, Seccomp, or capabilities (POSIX capabilities), and others are not supported.

Privileged containers are [not supported](#compatibility-v1-pod-spec-containers-securitycontext) on Windows.
Instead [HostProcess containers](/docs/tasks/configure-pod-container/create-hostprocess-pod) can be used on Windows to perform many of the tasks performed by privileged containers on Linux.
