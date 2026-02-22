---
layout: blog
title: 'Alpha in v1.22: Windows HostProcess Containers'
date: 2021-08-16
slug: windows-hostprocess-containers
author: >
   Brandon Smith (Microsoft)
---

Kubernetes v1.22 introduced a new alpha feature for clusters that
include Windows nodes: HostProcess containers.

HostProcess containers aim to extend the Windows container model to enable a wider 
range of Kubernetes cluster management scenarios. HostProcess containers run 
directly on the host and maintain behavior and access similar to that of a regular 
process. With HostProcess containers, users can package and distribute management 
operations and functionalities that require host access while retaining versioning 
and deployment methods provided by containers. This allows Windows containers to 
be used for a variety of device plugin, storage, and networking management scenarios 
in Kubernetes. With this comes the enablement of host network mode—allowing
HostProcess containers to be created within the host's network namespace instead of 
their own. HostProcess containers can also be built on top of existing Windows server 
2019 (or later) base images, managed through the Windows container runtime, and run 
as any user that is available on or in the domain of the host machine.

Linux privileged containers are currently used for a variety of key scenarios in 
Kubernetes, including kube-proxy (via kubeadm), storage, and networking scenarios. 
Support for these scenarios in Windows previously required workarounds via proxies 
or other implementations. Using HostProcess containers, cluster operators no longer 
need to log onto and individually configure each Windows node for administrative 
tasks and management of Windows services. Operators can now utilize the container 
model to deploy management logic to as many clusters as needed with ease. 

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

{{< figure src="hostprocess-architecture.png" alt="HostProcess Architecture" >}}

## How do I use it?

HostProcess containers can be run from within a 
[HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod). 
With the feature enabled on Kubernetes version 1.22, a containerd container runtime of 
1.5.4 or higher, and the latest version of hcsshim, deploying a pod spec with the 
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
