---
title: Cgroup V2
content_type: concept
weight: 50
---

<!-- overview -->

On Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
are used to constrain resources that are allocated to processes.

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and the
underlying container runtime need to interface with control groups to enforce
[resource mangement for pods and
containers](/docs/concepts/configuration/manage-resources-containers/) and set
resources such as cpu/memory requests and limits.

There are two versions of cgroups in linux: cgroupv1 and cgroupv2. Cgroupv2 is
the new generation of the cgroup API.

<!-- body -->


## Cgroup version 2 {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Cgroup v2 is the next version of the cgroup Linux API. Cgroup v2 provides a
unified control system, which provides enhanced resource management
capabilities.

The new version offers several improvements over cgroup v1, some of these improvements are:

- cleaner and easier to use API with a unified hierarchy
- safe sub-tree delegation to containers
- newer features like Pressure Stall Information
- enhanced accounting and isolation across multiple resources
  - accounting for network memory


Some kubernetes features exclusively rely on on cgroupv2 for enhanced resource
management and isolation. For example, the
[MemoryQoS](/blog/2021/11/26/qos-memory-resources/) feature improves memory QoS
and relies on cgroupv2 primitives. New upcoming resource management
capabilities in kubelet will depend on cgroupv2 as well.


## Using cgroupv2

To use cgroupv2, it is recommended to use a Linux distribution which enables
cgroupv2 out of the box. Most new modern linux distributions have switched over
to cgroupv2 by default.

To check if your distribution is using cgroupv2, follow the steps [below](#check-cgroup-version).

To use cgroupv2 the following requirements must be met:

* OS distribution enables cgroupv2
* Linux Kernel version is >= 5.8
* Container runtime supports cgroupv2
  * [containerd](https://containerd.io/) since 1.4
  * [cri-o](https://cri-o.io/) since 1.20
* Kubelet and container runtime are configured to use the [systemd cgroup driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

### Linux Distribution cgroupv2 support

Many Linux Distributions have already switched over to use cgroupv2 by default, for example:

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* Container Optimized OS M97
* Ubuntu (since 21.10, 22.04+ recommended)
* Debian GNU/Linux (since Debian 11 buster)
* Fedora (since 31)
* Arch Linux (since April 2021)
* RHEL and RHEL-like distributions (since 9)

To check if your distribution is using cgroupv2, refer to your distribution's
documentation or follow the steps [below](#check-cgroup-version) to verify the
configuration.

You can also enable cgroupv2 manually on your Linux distribution by modifying
the kernel boot arguments in the GRUB command line, and setting
`systemd.unified_cgroup_hierarchy=1`, however it's recommended to use a
distribution that already enables cgroupv2 by default.


### Migrating to cgroupv2

To migrate to cgroupv2, update to a newer kernel version that enables cgroupv2
by default, ensure your container runtime supports cgroupv2, and configure
kubelet and container runtime are configured to use the [systemd cgroup
driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver).

Kubelet will automatically detect that the OS is running on cgroupv2 and will
perform accordingly, no additional configuration is required.

There should not be any noticeable difference in the user experience when
switching to cgroup v2, unless users are accessing the cgroup file system
directly, either on the node or from within the containers.

Cgroup V2 uses a new API as compared to cgroup V1, so if there are any
applications that directly access the cgroup file system, they need to be
updated to newer versions that support cgroupv2. For example:

* Some third party monitoring and security agents may be dependent on cgroup filesystem.
 Update them to the latest versions that support cgroupv2
* If you are running [cAdvisor](https://github.com/google/cadvisor) as a
 daemonset for monitoring pods and containers, update it to latest version (v0.45.0)
* If you use JDK (Java workload), prefer to use JDK 11.0.16 and later or JDK 15
 and later, which [fully support
 cgroupv2](https://bugs.openjdk.org/browse/JDK-8230305)


## Identifying cgroup version used on Linux Nodes  {#check-cgroup-version}

The cgroup version is dependent on the Linux distribution being used and the
default cgroup version configured on the OS. To check which cgroup version your
OS Distro is using, you can run the `stat -fc %T /sys/fs/cgroup/` command on
the node and check if the output is `cgroup2fs`:

```shell
# On a cgroupv2 node:
$ stat -fc %T /sys/fs/cgroup/
cgroup2fs

# On a cgroupv1 node:
$ stat -fc %T /sys/fs/cgroup/
tmpfs
```

## {{% heading "whatsnext" %}}

- Learn more about [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Learn more about [container runtime](/docs/concepts/architecture/cri)
- Learn more about [cgroup drivers](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
