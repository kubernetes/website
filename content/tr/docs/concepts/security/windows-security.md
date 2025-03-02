---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title:    Security For Windows Nodes
content_type: concept
weight: 40
---

<!-- overview -->

This page describes security considerations and best practices specific to the Windows operating system.

<!-- body -->

## Protection for Secret data on nodes

On Windows, data from Secrets are written out in clear text onto the node's local
storage (as compared to using tmpfs / in-memory filesystems on Linux). As a cluster
operator, you should take both of the following additional measures:

1. Use file ACLs to secure the Secrets' file location.
1. Apply volume-level encryption using
   [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server).

## Container users

[RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername)
can be specified for Windows Pods or containers to execute the container
processes as specific user. This is roughly equivalent to
[RunAsUser](/docs/concepts/security/pod-security-policy/#users-and-groups).

Windows containers offer two default user accounts, ContainerUser and ContainerAdministrator.
The differences between these two user accounts are covered in
[When to use ContainerAdmin and ContainerUser user accounts](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts)
within Microsoft's _Secure Windows containers_ documentation.

Local users can be added to container images during the container build process.

{{< note >}}

* [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) based images run as
  `ContainerUser` by default
* [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) based images run as
  `ContainerAdministrator` by default

{{< /note >}}

Windows containers can also run as Active Directory identities by utilizing
[Group Managed Service Accounts](/docs/tasks/configure-pod-container/configure-gmsa/)

## Pod-level security isolation

Linux-specific pod security context mechanisms (such as SELinux, AppArmor, Seccomp, or custom
POSIX capabilities) are not supported on Windows nodes.

Privileged containers are [not supported](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)
on Windows.
Instead [HostProcess containers](/docs/tasks/configure-pod-container/create-hostprocess-pod)
can be used on Windows to perform many of the tasks performed by privileged containers on Linux.
