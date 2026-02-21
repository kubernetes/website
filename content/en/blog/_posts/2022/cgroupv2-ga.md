---
layout: blog
title: "Kubernetes 1.25: cgroup v2 graduates to GA"
date: 2022-08-31
slug: cgroupv2-ga-1-25
author: >
  David Porter (Google),
  Mrunal Patel (Red Hat)
---

Kubernetes 1.25 brings cgroup v2 to GA (general availability), letting the
[kubelet](/docs/concepts/overview/components/#kubelet) use the latest container resource
management capabilities.

## What are cgroups?

Effective [resource management](/docs/concepts/configuration/manage-resources-containers/) is a
critical aspect of Kubernetes. This involves managing the finite resources in
your nodes, such as CPU, memory, and storage.

*cgroups* are a Linux kernel capability that establish resource management
functionality like limiting CPU usage or setting memory limits for running
processes.

When you use the resource management capabilities in Kubernetes, such as configuring
[requests and limits for Pods and containers](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits),
Kubernetes uses cgroups to enforce your resource requests and limits.

The Linux kernel offers two versions of cgroups: cgroup v1 and cgroup v2.

## What is cgroup v2?

cgroup v2 is the latest version of the Linux cgroup API. cgroup v2 provides a
unified control system with enhanced resource management capabilities.

cgroup v2 has been in development in the Linux Kernel since 2016 and in recent
years has matured across the container ecosystem. With Kubernetes 1.25, cgroup
v2 support has graduated to general availability.

Many recent releases of Linux distributions have switched over to cgroup v2 by
default so it's important that Kubernetes continues to work well on these new
updated distros.

cgroup v2 offers several improvements over cgroup v1, such as the following:

* Single unified hierarchy design in API
* Safer sub-tree delegation to containers
* Newer features like [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
* Enhanced resource allocation management and isolation across multiple resources
    * Unified accounting for different types of memory allocations (network and kernel memory, etc)
    * Accounting for non-immediate resource changes such as page cache write backs

Some Kubernetes features exclusively use cgroup v2 for enhanced resource
management and isolation. For example,
the [MemoryQoS feature](/blog/2021/11/26/qos-memory-resources/) improves
memory utilization and relies on cgroup v2 functionality to enable it. New
resource management features in the kubelet will also take advantage of the new
cgroup v2 features moving forward.

## How do you use cgroup v2?

Many Linux distributions are switching to cgroup v2 by default; you might start
using it the next time you update the Linux version of your control plane and
nodes!

Using a Linux distribution that uses cgroup v2 by default is the recommended
method. Some of the popular Linux distributions that use cgroup v2 include the
following:

* Container Optimized OS (since M97)
* Ubuntu (since 21.10)
* Debian GNU/Linux (since Debian 11 Bullseye)
* Fedora (since 31)
* Arch Linux (since April 2021)
* RHEL and RHEL-like distributions (since 9)

To check if your distribution uses cgroup v2 by default,
refer to [Check your cgroup version](/docs/concepts/architecture/cgroups/#check-cgroup-version) or
consult your distribution's documentation.

If you're using a managed Kubernetes offering, consult your provider to
determine how they're adopting cgroup v2, and whether you need to take action.

To use cgroup v2 with Kubernetes, you must meet the following requirements:

* Your Linux distribution enables cgroup v2 on kernel version 5.8 or later
* Your container runtime supports cgroup v2. For example:
  * [containerd](https://containerd.io/) v1.4 or later
  * [cri-o](https://cri-o.io/) v1.20 or later
* The kubelet and the container runtime are configured to use the [systemd cgroup driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

The kubelet and container runtime use a [cgroup driver](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
to set cgroup parameters. When using cgroup v2, it's strongly recommended that both
the kubelet and your container runtime use the
[systemd cgroup driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver),
so that there's a single cgroup manager on the system. To configure the kubelet
and the container runtime to use the driver, refer to the
[systemd cgroup driver documentation](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver).

## Migrate to cgroup v2

When you run Kubernetes with a Linux distribution that enables cgroup v2, the
kubelet should automatically adapt without any additional configuration
required, as long as you meet the requirements.

In most cases, you won't see a difference in the user experience when you
switch to using cgroup v2 unless your users access the cgroup file system
directly.

If you have applications that access the cgroup file system directly, either on
the node or from inside a container, you must update the applications to use
the cgroup v2 API instead of the cgroup v1 API.

Scenarios in which you might need to update to cgroup v2 include the following:

* If you run third-party monitoring and security agents that depend on the cgroup file system, update the
  agents to versions that support cgroup v2.
* If you run [cAdvisor](https://github.com/google/cadvisor) as a stand-alone
  DaemonSet for monitoring pods and containers, update it to v0.43.0 or later.
* If you deploy Java applications, prefer to use versions which fully support cgroup v2:
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 and later
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0, and later
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 and later

## Learn more

* Read the [Kubernetes cgroup v2 documentation](/docs/concepts/architecture/cgroups/)
* Read the enhancement proposal, [KEP 2254](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2254-cgroup-v2/README.md)
* Learn more about
  [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html) on Linux Manual Pages
  and [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) on the Linux Kernel documentation


## Get involved

Your feedback is always welcome! SIG Node meets regularly and are available in
the `#sig-node` channel in the Kubernetes [Slack](https://slack.k8s.io/), or
using the SIG [mailing list](https://github.com/kubernetes/community/tree/master/sig-node#contact).

cgroup v2 has had a long journey and is a great example of open source
community collaboration across the industry because it required work across the
stack, from the Linux Kernel to systemd to various container runtimes, and (of
course) Kubernetes.

## Acknowledgments

We would like to thank [Giuseppe Scrivano](https://github.com/giuseppe) who
initiated cgroup v2 support in Kubernetes, and reviews and leadership from the
SIG Node community including chairs [Dawn Chen](https://github.com/dchen1107)
and [Derek Carr](https://github.com/derekwaynecarr).

We'd also like to thank the maintainers of container runtimes like Docker,
containerd and CRI-O, and the maintainers of components like
[cAdvisor](https://github.com/google/cadvisor)
and [runc, libcontainer](https://github.com/opencontainers/runc),
which underpin many container runtimes. Finally, this wouldn't have been
possible without support from systemd and upstream Linux Kernel maintainers.

It's a team effort!
