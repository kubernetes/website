---
layout: blog
title: "DIY: Create Your Own Cloud with Kubernetes (Part 2)"
slug: diy-create-your-own-cloud-with-kubernetes-part-2
date: 2024-04-05T07:35:00+00:00
author: >
  Andrei Kvapil (Ænix)
---

Continuing our series of posts on how to build your own cloud using just the Kubernetes ecosystem.
In the [previous article](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/), we
explained how we prepare a basic Kubernetes distribution based on Talos Linux and Flux CD.
In this article, we'll show you a few various virtualization technologies in Kubernetes and prepare
everything need to run virtual machines in Kubernetes, primarily storage and networking.

We will talk about technologies such as KubeVirt, LINSTOR, and Kube-OVN.

But first, let's explain what virtual machines are needed for, and why can't you just use docker
containers for building cloud?
The reason is that containers do not provide a sufficient level of isolation.
Although the situation improves year by year, we often encounter vulnerabilities that allow
escaping the container sandbox and elevating privileges in the system.

On the other hand, Kubernetes was not originally designed to be a multi-tenant system, meaning
the basic usage pattern involves creating a separate Kubernetes cluster for every independent
project and development team.

Virtual machines are the primary means of isolating tenants from each other in a cloud environment.
In virtual machines, users can execute code and programs with administrative privilege, but this
doesn't affect other tenants or the environment itself. In other words, virtual machines allow to
achieve [hard multi-tenancy isolation](/docs/concepts/security/multi-tenancy/#isolation), and run
in environments where tenants do not trust each other.

## Virtualization technologies in Kubernetes

There are several different technologies that bring virtualization into the Kubernetes world:
[KubeVirt](https://kubevirt.io/) and [Kata Containers](https://katacontainers.io/)
are the most popular ones. But you should know that they work differently.

**Kata Containers** implements the CRI (Container Runtime Interface) and provides an additional
level of isolation for standard containers by running them in virtual machines.
But they work in a same single Kubernetes-cluster.

{{< figure src="kata-containers.svg" caption="A diagram showing how container isolation is ensured by running containers in virtual machines with Kata Containers" alt="A diagram showing how container isolation is ensured by running containers in virtual machines with Kata Containers" >}}

**KubeVirt** allows running traditional virtual machines using the Kubernetes API. KubeVirt virtual
machines are run as regular linux processes in containers. In other words, in KubeVirt, a container
is used as a sandbox for running virtual machine (QEMU) processes.
This can be clearly seen in the figure below, by looking at how live migration of virtual machines
is implemented in KubeVirt. When migration is needed, the virtual machine moves from one container
to another.

{{< figure src="kubevirt-migration.svg" caption="A diagram showing live migration of a virtual machine from one container to another in KubeVirt" alt="A diagram showing live migration of a virtual machine from one container to another in KubeVirt" >}}

There is also an alternative project - [Virtink](https://github.com/smartxworks/virtink), which
implements lightweight virtualization using
[Cloud-Hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor) and is initially focused
on running virtual Kubernetes clusters using the Cluster API.

Considering our goals, we decided to use KubeVirt as the most popular project in this area.
Besides we have extensive expertise and already made a lot of contributions to KubeVirt.

KubeVirt is [easy to install](https://kubevirt.io/user-guide/operations/installation/) and allows
you to run virtual machines  out-of-the-box using
[containerDisk](https://kubevirt.io/user-guide/virtual_machines/disks_and_volumes/#containerdisk)
feature - this allows you to store and distribute VM images directly as OCI images from container
image registry.
Virtual machines with containerDisk are well suited for creating Kubernetes worker nodes and other
VMs that do not require state persistence.

For managing persistent data, KubeVirt offers a separate tool, Containerized Data Importer (CDI).
It allows for cloning PVCs and populating them with data from base images. The CDI is necessary
if you want to automatically provision persistent volumes for your virtual machines, and it is
  also required for the KubeVirt CSI Driver, which is used to handle persistent volumes claims
  from tenant Kubernetes clusters.

But at first, you have to decide where and how you will store these data.

## Storage for Kubernetes VMs

With the introduction of the CSI (Container Storage Interface), a wide range of technologies that
integrate with Kubernetes has become available.
In fact, KubeVirt fully utilizes the CSI interface, aligning the choice of storage for
virtualization closely with the choice of storage for Kubernetes itself.
However, there are nuances, which you need to consider. Unlike containers, which typically use a
standard filesystem, block devices are more efficient for virtual machine.

Although the CSI interface in Kubernetes allows the request of both types of volumes: filesystems
and block devices, it's important to verify that your storage backend supports this.

Using block devices for virtual machines eliminates the need for an additional abstraction layer,
such as a filesystem, that makes it more performant and in most cases enables the use of the
_ReadWriteMany_ mode. This mode allows concurrent access to the volume from multiple nodes, which
is a critical feature for enabling the live migration of virtual machines in KubeVirt.

The storage system can be external or internal (in the case of hyper-converged infrastructure).
Using external storage in many cases makes the whole system more stable, as your data is stored
separately from compute nodes.

{{< figure src="storage-external.svg" caption="A diagram showing external data storage communication with the compute nodes" alt="A diagram showing external data storage communication with the compute nodes" >}}

External storage solutions are often popular in enterprise systems because such storage is
frequently provided by an external vendor, that takes care of its operations. The integration with
Kubernetes involves only a small component installed in the cluster - the CSI driver. This driver
is responsible for provisioning volumes in this storage and attaching them to pods run by Kubernetes.
However, such storage solutions can also be implemented using purely open-source technologies.
One of the popular solutions is [TrueNAS](https://www.truenas.com/) powered by
[democratic-csi](https://github.com/democratic-csi/democratic-csi) driver.

{{< figure src="storage-local.svg" caption="A diagram showing local data storage running on the compute nodes" alt="A diagram showing local data storage running on the compute nodes" >}}

On the other hand, hyper-converged systems are often implemented using local storage (when you do
not need replication) and with software-defined storages, often installed directly in Kubernetes,
such as [Rook/Ceph](https://rook.io/), [OpenEBS](https://openebs.io/),
[Longhorn](https://longhorn.io/), [LINSTOR](https://linbit.com/linstor/), and others.

{{< figure src="storage-clustered.svg" caption="A diagram showing clustered data storage running on the compute nodes" alt="A diagram showing clustered data storage running on the compute nodes" >}}

A hyper-converged system has its advantages. For example, data locality: when your data is stored
locally, access to such data is faster. But there are disadvantages as such a system is usually
more difficult to manage and maintain.

At Ænix, we wanted to provide a ready-to-use solution that could be used without the need to
purchase and setup an additional external storage, and that was optimal in terms of speed and
resource utilization. LINSTOR became that solution.
The time-tested and industry-popular technologies such as LVM and ZFS as backend gives confidence
that data is securely stored. DRBD-based replication is incredible fast and consumes a small amount
of computing resources.

For installing LINSTOR in Kubernetes, there is the Piraeus project, which already provides a
ready-made block storage to use with KubeVirt.

{{< note >}}
In case you are using Talos Linux, as we described in the
[previous article](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/), you will
need to enable the necessary kernel modules in advance, and configure piraeus as described in the
[instruction](https://github.com/piraeusdatastore/piraeus-operator/blob/v2/docs/how-to/talos.md).
{{< /note >}}

## Networking for Kubernetes VMs

Despite having the similar interface - CNI, The network architecture in Kubernetes is actually more
complex and typically consists of many independent components that are not directly connected to
each other. In fact, you can split Kubernetes networking into four layers, which are described below.

### Node Network (Data Center Network)

The network through which nodes are interconnected with each other. This network is usually not
managed by Kubernetes, but it is an important one because, without it, nothing would work.
In practice, the bare metal infrastructure usually has more than one of such networks e.g.
one for node-to-node communication, second for storage replication, third for external access, etc.

{{< figure src="net-nodes.svg" caption="A diagram showing the role of the node network (data center network) on the Kubernetes networking scheme" alt="A diagram showing the role of the node network (data center network) on the Kubernetes networking scheme" >}}

Configuring the physical network interaction between nodes goes beyond the scope of this article,
as in most situations, Kubernetes utilizes already existing network infrastructure.

### Pod Network

This is the network provided by your CNI plugin. The task of the CNI plugin is to ensure transparent
connectivity between all containers and nodes in the cluster. Most CNI plugins implement a flat
network from which separate blocks of IP addresses are allocated for use on each node.

{{< figure src="net-pods.svg" caption="A diagram showing the role of the pod network (CNI-plugin) on the Kubernetes network scheme" alt="A diagram showing the role of the pod network (CNI-plugin) on the Kubernetes network scheme" >}}

In practice, your cluster can have several CNI plugins managed by
[Multus](https://github.com/k8snetworkplumbingwg/multus-cni). This approach is often used in
virtualization solutions based on KubeVirt - [Rancher](https://www.rancher.com/) and
[OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift/virtualization).
The primary CNI plugin is used for integration with Kubernetes services, while additional CNI
plugins are used to implement private networks (VPC) and integration with the physical networks
of your data center.

The [default CNI-plugins](https://github.com/containernetworking/plugins/tree/main/plugins) can
be used to connect bridges or physical interfaces. Additionally, there are specialized plugins
such as [macvtap-cni](https://github.com/kubevirt/macvtap-cni) which are designed to provide
more performance.

One additional aspect to keep in mind when running virtual machines in Kubernetes is the need for
IPAM (IP Address Management), especially for secondary interfaces provided by Multus. This is
commonly managed by a DHCP server operating within your infrastructure. Additionally, the allocation
of MAC addresses for virtual machines can be managed by
[Kubemacpool](https://github.com/k8snetworkplumbingwg/kubemacpool).

Although in our platform, we decided to go another way and fully rely on
[Kube-OVN](https://www.kube-ovn.io/). This CNI plugin is based on OVN (Open Virtual Network) which
was originally developed for OpenStack and it provides a complete network solution for virtual
machines in Kubernetes, features Custom Resources for managing IPs and MAC addresses, supports
live migration with preserving IP addresses between the nodes, and enables the creation of VPCs
for physical network separation between tenants.

In Kube-OVN you can assign separate subnets to an entire namespace or connect them as additional
network interfaces using Multus.

### Services Network

In addition to the CNI plugin, Kubernetes also has a services network, which is primarily needed
for service discovery.
Contrary to traditional virtual machines, Kubernetes is originally designed to run pods with a
random address.
And the services network provides a convenient abstraction (stable IP addresses and DNS names)
that will always direct traffic to the correct pod.
The same approach is also commonly used with virtual machines in clouds despite the fact that
their IPs are usually static.

{{< figure src="net-services.svg" caption="A diagram showing the role of the services network (services network plugin) on the Kubernetes network scheme" alt="A diagram showing the role of the services network (services network plugin) on the Kubernetes network scheme" >}}


The implementation of the services network in Kubernetes is handled by the services network plugin,
The standard implementation is called **kube-proxy** and is used in most clusters.
But nowadays, this functionality might be provided as part of the CNI plugin. The most advanced
implementation is offered by the [Cilium](https://cilium.io/) project, which can be run in kube-proxy replacement mode.

Cilium is based on the eBPF technology, which allows for efficient offloading of the Linux
networking stack, thereby improving performance and security compared to traditional methods based
on iptables.

In practice, Cilium and Kube-OVN can be easily
[integrated](https://kube-ovn.readthedocs.io/zh-cn/stable/en/advance/with-cilium/) to provide a
unified solution that offers seamless, multi-tenant networking for virtual machines, as well as
advanced network policies and combined services network functionality.

### External Traffic Load Balancer

At this stage, you already have everything needed to run virtual machines in Kubernetes.
But there is actually one more thing.
You still need to access your services from outside your cluster, and an external load balancer
will help you with organizing this.

For bare metal Kubernetes clusters, there are several load balancers available:
[MetalLB](https://metallb.universe.tf/), [kube-vip](https://kube-vip.io/),
[LoxiLB](https://www.loxilb.io/), also [Cilium](https://docs.cilium.io/en/latest/network/lb-ipam/) and
[Kube-OVN](https://kube-ovn.readthedocs.io/zh-cn/latest/en/guide/loadbalancer-service/)
provides built-in implementation.

The role of a external load balancer is to provide a stable address available externally and direct
external traffic to the services network.
The services network plugin will direct it to your pods and virtual machines as usual.

{{< figure src="net-loadbalancer.svg" caption="A diagram showing the role of the external load balancer on the Kubernetes network scheme" alt="The role of the external load balancer on the Kubernetes network scheme" >}}

In most cases, setting up a load balancer on bare metal is achieved by creating floating IP address
on the nodes within the cluster, and announce it externally using ARP/NDP or BGP protocols.

After exploring various options, we decided that MetalLB is the simplest and most reliable solution,
although we do not strictly enforce the use of only it.

Another benefit is that in L2 mode, MetalLB speakers continuously check their neighbour's state by
sending preforming liveness checks using a memberlist protocol.
This enables failover that works independently of Kubernetes control-plane.

## Conclusion

This concludes our overview of virtualization, storage, and networking in Kubernetes.
The technologies mentioned here are available and already pre-configured on the
[Cozystack](https://github.com/aenix-io/cozystack) platform, where you can try them with no limitations.

In the [next article](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-3/),
I'll detail how, on top of this, you can implement the provisioning of fully functional Kubernetes
clusters with just the click of a button.
