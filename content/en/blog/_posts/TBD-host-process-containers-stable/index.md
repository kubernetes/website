---
layout: blog
title: "Kubernetes 1.26: Windows HostProcess stables stable"
date: TBD
slug: host-process-containers-stable
---

**Authors**: Mark Rossetti (Microsoft) and Brandon Smith (Microsoft)

The long-awaited day has arrived: HostProcess containers, the Windows equivalent to Linux privileged
containers, has finally made it to **GA in Kubernetes 1.26**!

Let's recap - what are HostProcess containers and why are they useful? Cluster operators
are often faced with the need to configure their nodes upon provisioning. Whether it's
installing services, certificates, network configs, device plugins, or even monitoring solutions like
prometheus, HostProcess containers enable you to it all with minimal effort.

You can create your own ultra-thin HostProcess container image to be run directly as
a process on the host directly after spinning up a new node. All you need to do is define
and test your administrative workload once, package it into a container, and have Kubernetes
deploy the workload automatically. It removes the need to exec into the node or configure
VMSS extensions to perform these administrative actions. You get all the benefits of
containerized packaging and deployment methods combined with a reduction in both administrative
and development cost.

HostProcess containers differ quite significantly from regular Windows Server containers.
They are run directly as processes on the host and can run under the access policies of
a user you specify. HostProcess containers can be run using built-in system accounts or
as ephemeral users within a user group defined by you. HostProcess containers also share
the host's network namespace and access/configure storage mounts visible to the host.
On the other hand, Windows Server containers are highly isolated and exist in a separate
silo'd namespace.

Until now, scenarios common to Linux privileged containers, such as kube-proxy (via kubeadm),
storage, and networking, all required proxy solutions to enable functionality on Windows.
With HostProcess containers users have direct access to the node without the need for
any workarounds. Gone are the days where cluster operators would need to manually log onto
Windows nodes to perform administrative duties - instead replaced with a continuous
development pipeline.

## How does it work?

Windows HostProcess containers are implemented with Windows _Job Objects_, a break from the
previous container model using server silos. Job objects are components of the Windows OS which offer the ability to
manage a group of processes as a group (a.k.a. _jobs_) and assign resource constraints to the
group as a whole. Job objects are specific to the Windows OS and are not associated with the Kubernetes [Job API](https://kubernetes.io/docs/concepts/workloads/controllers/job/). They have no process or file system isolation,
enabling the privileged payload to view and edit the host file system with the
correct permissions, among other host resources. The init process, and any processes
it launches or that are explicitly launched by the user, are all assigned to the
job object of that container. When the init process exits or is signaled to exit,
all the processes in the job will be signaled to exit, the job handle will be
closed and the storage will be unmounted.

HostProcess and Linux privileged containers enable similar scenarios but differ
greatly in their implementation (hence the naming difference). HostProcess containers
have their own pod security policies. Those used to configure Linux privileged
containers **do not** apply. Enabling privileged access to a Windows host is a
fundamentally different process than with Linux so the configuration and
capabilities of each differ significantly. Below is a diagram detailing the
overall architecture of Windows HostProcess containers:

{{< figure src="hpc-architecture.png" alt="HostProcess Architecture" >}}

### User Accounts

**TODO**

### File Management

**TODO**

### HostProcess Base Image

**TODO**

## Use Cases

**TODO**

## How do I use it?

**TODO** Building an HPC

HostProcess containers can be run from within a
[HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod).
With the feature enabled on Kubernetes version 1.22, a containerd container runtime of
1.7 or higher, and the latest version of hcsshim, deploying a pod spec with the
[correct HostProcess configuration](/docs/tasks/configure-pod-container/create-hostprocess-pod/#before-you-begin) 
will enable you to run HostProcess containers. To get started with running
Windows containers see the general guidance for [Windows in Kubernetes](/docs/setup/production-environment/windows/)

## How can I learn more?

- Work through [Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/)

- Read about Kubernetes [Pod Security Standards](/docs/concepts/security/pod-security-standards/)

- Read the enhancement proposal [Windows Privileged Containers and Host Networking Mode](https://github.com/kubernetes/enhancements/tree/master/keps/sig-windows/1981-windows-privileged-container-support) (KEP-1981)

## How do I get involved?

HostProcess containers are in active development. SIG Windows welcomes suggestions from the community.
Get involved with [SIG Windows](https://github.com/kubernetes/community/tree/master/sig-windows)
to contribute!
