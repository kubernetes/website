---
layout: blog
title: "Kubernetes 1.26: Windows HostProcess Containers Are Generally Available"
date: 2022-12-13
slug: windows-host-process-containers-ga
author: >
  Brandon Smith (Microsoft),
  Mark Rossetti (Microsoft)
---

The long-awaited day has arrived: HostProcess containers, the Windows equivalent to Linux privileged
containers, has finally made it to **GA in Kubernetes 1.26**!

What are HostProcess containers and why are they useful?

Cluster operators are often faced with the need to configure their nodes upon provisioning such as
installing Windows services, configuring registry keys, managing TLS certificates,
making network configuration changes, or even deploying monitoring tools such as a Prometheus's node-exporter.
Previously, performing these actions on Windows nodes was usually done by running PowerShell scripts
over SSH or WinRM sessions and/or working with your cloud provider's virtual machine management tooling.
HostProcess containers now enable you to do all of this and more with minimal effort using Kubernetes native APIs.

With HostProcess containers you can now package any payload
into the container image, map volumes into containers at runtime, and manage them like any other Kubernetes workload.
You get all the benefits of containerized packaging and deployment methods combined with a reduction in
both administrative and development cost.
Gone are the days where cluster operators would need to manually log onto
Windows nodes to perform administrative duties.

[HostProcess containers](/docs/tasks/configure-pod-container/create-hostprocess-pod/) differ
quite significantly from regular Windows Server containers.
They are run directly as processes on the host with the access policies of
a user you specify. HostProcess containers run as either the built-in Windows system accounts or
ephemeral users within a user group defined by you. HostProcess containers also share
the host's network namespace and access/configure storage mounts visible to the host.
On the other hand, Windows Server containers are highly isolated and exist in a separate
execution namespace. Direct access to the host from a Windows Server container is explicitly disallowed
by default.

## How does it work?

Windows HostProcess containers are implemented with Windows [_Job Objects_](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects),
a break from the previous container model which use server silos.
Job Objects are components of the Windows OS which offer the ability to
manage a group of processes as a group (also known as a _job_) and assign resource constraints to the
group as a whole. Job objects are specific to the Windows OS and are not associated with
the Kubernetes [Job API](/docs/concepts/workloads/controllers/job/). They have no process
or file system isolation,
enabling the privileged payload to view and edit the host file system with the
desired permissions, among other host resources. The init process, and any processes
it launches (including processes explicitly launched by the user) are all assigned to the
job object of that container. When the init process exits or is signaled to exit,
all the processes in the job will be signaled to exit, the job handle will be
closed and the storage will be unmounted.

HostProcess and Linux privileged containers enable similar scenarios but differ
greatly in their implementation (hence the naming difference). HostProcess containers
have their own [PodSecurityContext](/docs/reference/generated/kubernetes-api/v1.25/#windowssecuritycontextoptions-v1-core) fields.
Those used to configure Linux privileged containers **do not** apply. Enabling privileged access to a Windows host is a
fundamentally different process than with Linux so the configuration and
capabilities of each differ significantly. Below is a diagram detailing the
overall architecture of Windows HostProcess containers:

{{< figure src="hpc_architecture.svg" alt="HostProcess Architecture" >}}

Two major features were added prior to moving to stable: the ability to run as local user accounts, and
a simplified method of accessing volume mounts. To learn more, read
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).

## HostProcess containers in action

Kubernetes SIG Windows has been busy putting HostProcess containers to use - even before GA!
They've been very excited to use HostProcess containers for a number of important activities
that were a pain to perform in the past.

Here are just a few of the many use use cases with example deployments:

- [CNI solutions and kube-proxy](https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/hostprocess/calico#calico-example)
- [windows-exporter](https://github.com/prometheus-community/windows_exporter/blob/master/kubernetes/windows-exporter-daemonset.yaml)
- [csi-proxy](https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/hostprocess/csi-proxy)
- [Windows-debug container](https://github.com/jsturtevant/windows-debug)
- [ETW event streaming](https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/hostprocess/eventflow-logger)

## How do I use it?

A HostProcess container can be built using any base image of your choosing, however, for convenience we have
created [a HostProcess container base image](https://github.com/microsoft/windows-host-process-containers-base-image).
This image is only a few KB in size and does not inherit any of the same compatibility requirements as regular Windows
server containers which allows it to run on any Windows server version.

To use that Microsoft image, put this in your `Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/oss/kubernetes/windows-host-process-containers-base-image:v1.0.0
```

You can run HostProcess containers from within a
[HostProcess Pod](/docs/concepts/workloads/pods/#privileged-mode-for-containers).

To get started with running Windows containers,
see the general guidance for [deploying Windows nodes](/docs/setup/production-environment/windows/).
If you have a compatible node (for example: Windows as the operating system
with containerd v1.7 or later as the container runtime), you can deploy a Pod with one
or more HostProcess containers.
See the [Create a Windows HostProcess Pod - Prerequisites](/docs/tasks/configure-pod-container/create-hostprocess-pod/#before-you-begin)
for more information.

Please note that within a Pod, you can't mix HostProcess containers with normal Windows containers.

## How can I learn more?

- Work through [Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/)

- Read about Kubernetes [Pod Security Standards](/docs/concepts/security/pod-security-standards/) and [Pod Security Admission](/docs/concepts/security/pod-security-admission/)

- Read the enhancement proposal [Windows Privileged Containers and Host Networking Mode](https://github.com/kubernetes/enhancements/tree/master/keps/sig-windows/1981-windows-privileged-container-support) (KEP-1981)

- Watch the [Windows HostProcess for Configuration and Beyond](https://www.youtube.com/watch?v=LcXT9pVkwvo) KubeCon NA 2022 talk

## How do I get involved?

Get involved with [SIG Windows](https://github.com/kubernetes/community/tree/master/sig-windows)
to contribute!
