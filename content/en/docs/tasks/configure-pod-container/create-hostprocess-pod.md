---
title: Create a Windows HostProcess Pod
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

Windows HostProcess containers enable you to run containerized 
 workloads on a Windows host. These containers operate as 
normal processes but have access to the host network namespace, 
storage, and devices when given the appropriate user privileges. 
HostProcess containers can be used to deploy CNIs, 
storage configurations, device plugins, kube-proxy, and other 
components to Windows nodes without the need for dedicated proxies or 
the direct installation of host services.

Administrative tasks such as installation of security patches, event 
log collection, and more can be performed without requiring cluster operators to 
log onto each Window node. HostProcess containers can run as any user that is 
available on the host or is in the domain of the host machine, allowing administrators 
to restrict resource access through user permissions. While neither filesystem or process 
isolation are supported, a new volume is created on the host upon starting the container 
to give it a clean and consolidated workspace. HostProcess containers can also be built on 
top of existing Windows base images and do not inherit the same 
[compatibility requirements](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) as Windows server containers.

### When should I use a Windows HostProcess container?

- When you need to perform tasks which require the networking namespace of the host. 
HostProcess containers have access to the host's network interfaces and IP.
- You need access to resources on the host such as the filesystem, event logs, etc.
- Installation of specific devices drivers or services
- Consolidation of administrative tasks and security policies. This reduces the degree of 
privileges needed by Windows nodes.

### Important Notes

- HostProcess containers will **only run when using version 1.5.4 (or higher) of the containerd [container runtime](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)**.
- As of v1.22 HostProcess pods can only run HostProcess containers. This is a current limitation
 of the Windows OS; non-privileged Windows containers cannot share a vNIC with the host IP namespace.
- HostProcess containers run as a process on the host and do not have any degree of 
isolation other than resource constraints imposed on the HostProcess user account. Neither 
filesystem or Hyper-V isolation are supported for HostProcess containers.
- Volume mounts are supported and are mounted under the container volume. See [Volume Mounts](./create-hostprocess-pod#volume-mounts)
- A limited set of host user accounts are available for HostProcess containers by default. See [Choosing a User Account](./create-hostprocess-pod#choosing-a-user-account).
- Resource limits (disk, memory, cpu count) are supported in the same fashion as processes 
on the host.
- Both Named pipe mounts and Unix domain sockets are **not** currently supported and should instead be accessed via their 
path on the host (e.g. \\\\.\\pipe\\\*)

 ## {{% heading "prerequisites" %}}
[todo] Version requirements
[todo] Enabling the feature
- flags that need to be set 
- 

- list of steps needed to build everything


## Creating HostProcess containers

[todo] Deploying HostProcess containers
## Example Manifests

[todo] example specs

## Volume Mounts



## Choosing a User Account

[todo] Recommended user accounts

[todo] Using runas + changing the user


