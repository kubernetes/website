---
reviewers:
- thockin
title: Cluster Networking
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
Networking is a central part of Kubernetes, but it can be challenging to
understand exactly how it is expected to work.  There are 4 distinct networking
problems to address:

1. Highly-coupled container-to-container communications: this is solved by
   [pods](/docs/concepts/workloads/pods/pod/) and `localhost` communications.
2. Pod-to-Pod communications: this is the primary focus of this document.
3. Pod-to-Service communications: this is covered by [services](/docs/concepts/services-networking/service/).
4. External-to-Service communications: this is covered by [services](/docs/concepts/services-networking/service/).

{{% /capture %}}


{{% capture body %}}

Kubernetes is all about sharing machines between applications.  Typically,
sharing machines requires ensuring that two applications do not try to use the
same ports.  Coordinating ports across multiple developers is very difficult to
do at scale and exposes users to cluster-level issues outside of their control.

Dynamic port allocation brings a lot of complications to the system - every
application has to take ports as flags, the API servers have to know how to
insert dynamic port numbers into configuration blocks, services have to know
how to find each other, etc.  Rather than deal with this, Kubernetes takes a
different approach.

## The Kubernetes network model

Every `Pod` gets its own IP address. This means you do not need to explicitly
create links between `Pods` and you almost never need to deal with mapping
container ports to host ports.  This creates a clean, backwards-compatible
model where `Pods` can be treated much like VMs or physical hosts from the
perspectives of port allocation, naming, service discovery, load balancing,
application configuration, and migration.

Kubernetes imposes the following fundamental requirements on any networking
implementation (barring any intentional network segmentation policies):

   * pods on a node can communicate with all pods on all nodes without NAT
   * agents on a node (e.g. system daemons, kubelet) can communicate with all
     pods on that node

Note: For those platforms that support `Pods` running in the host network (e.g.
Linux):

   * pods in the host network of a node can communicate with all pods on all
     nodes without NAT

This model is not only less complex overall, but it is principally compatible
with the desire for Kubernetes to enable low-friction porting of apps from VMs
to containers.  If your job previously ran in a VM, your VM had an IP and could
talk to other VMs in your project.  This is the same basic model.

Kubernetes IP addresses exist at the `Pod` scope - containers within a `Pod`
share their network namespaces - including their IP address.  This means that
containers within a `Pod` can all reach each other's ports on `localhost`. This
also means that containers within a `Pod` must coordinate port usage, but this
is no different from processes in a VM.  This is called the "IP-per-pod" model.

How this is implemented is a detail of the particular container runtime in use.

It is possible to request ports on the `Node` itself which forward to your `Pod`
(called host ports), but this is a very niche operation. How that forwarding is
implemented is also a detail of the container runtime. The `Pod` itself is
blind to the existence or non-existence of host ports.

## How to implement the Kubernetes networking model

There are a number of ways that this network model can be implemented.  This
document is not an exhaustive study of the various methods, but hopefully serves
as an introduction to various technologies and serves as a jumping-off point.

The following networking options are sorted alphabetically - the order does not
imply any preferential status.

### ACI

[Cisco Application Centric Infrastructure](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html) offers an integrated overlay and underlay SDN solution that supports containers, virtual machines, and bare metal servers. [ACI](https://www.github.com/noironetworks/aci-containers) provides container networking integration for ACI. An overview of the integration is provided [here](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf).

### AOS from Apstra

[AOS](http://www.apstra.com/products/aos/) is an Intent-Based Networking system that creates and manages complex datacenter environments from a simple integrated platform.  AOS leverages a highly scalable distributed design to eliminate network outages while minimizing costs.

The AOS Reference Design currently supports Layer-3 connected hosts that eliminate legacy Layer-2 switching problems.  These Layer-3 hosts can be Linux servers (Debian, Ubuntu, CentOS) that create BGP neighbor relationships directly with the top of rack switches (TORs).  AOS automates the routing adjacencies and then provides fine grained control over the route health injections (RHI) that are common in a Kubernetes deployment.

AOS has a rich set of REST API endpoints that enable Kubernetes to quickly change the network policy based on application requirements.  Further enhancements will integrate the AOS Graph model used for the network design with the workload provisioning, enabling an end to end management system for both private and public clouds.

AOS supports the use of common vendor equipment from manufacturers including Cisco, Arista, Dell, Mellanox, HPE, and a large number of white-box systems and open network operating systems like Microsoft SONiC, Dell OPX, and Cumulus Linux.

Details on how the AOS system works can be accessed here: http://www.apstra.com/products/how-it-works/

### Big Cloud Fabric from Big Switch Networks

[Big Cloud Fabric](https://www.bigswitch.com/container-network-automation) is a cloud native networking architecture, designed to run Kubernetes in private cloud/on-premises environments. Using unified physical & virtual SDN, Big Cloud Fabric tackles inherent container networking problems such as load balancing, visibility, troubleshooting, security policies & container traffic monitoring.

With the help of the Big Cloud Fabric's virtual pod multi-tenant architecture, container orchestration systems such as Kubernetes, RedHat OpenShift, Mesosphere DC/OS & Docker Swarm will be natively integrated alongside with VM orchestration systems such as VMware, OpenStack & Nutanix. Customers will be able to securely inter-connect any number of these clusters and enable inter-tenant communication between them if needed.

BCF was recognized by Gartner as a visionary in the latest [Magic Quadrant](http://go.bigswitch.com/17GatedDocuments-MagicQuadrantforDataCenterNetworking_Reg.html). One of the BCF Kubernetes on-premises deployments (which includes Kubernetes, DC/OS & VMware running on multiple DCs across different geographic regions) is also referenced [here](https://portworx.com/architects-corner-kubernetes-satya-komala-nio/).

### Cilium

[Cilium](https://github.com/cilium/cilium) is open source software for
providing and transparently securing network connectivity between application
containers. Cilium is L7/HTTP aware and can enforce network policies on L3-L7
using an identity based security model that is decoupled from network
addressing.

### CNI-Genie from Huawei

[CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) is a CNI plugin that enables Kubernetes to [simultaneously have access to different implementations](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-cni-plugins/README.md#what-cni-genie-feature-1-multiple-cni-plugins-enables) of the [Kubernetes network model](https://git.k8s.io/website/docs/concepts/cluster-administration/networking.md#kubernetes-model) in runtime. This includes any implementation that runs as a [CNI plugin](https://github.com/containernetworking/cni#3rd-party-plugins), such as [Flannel](https://github.com/coreos/flannel#flannel), [Calico](http://docs.projectcalico.org/), [Romana](http://romana.io), [Weave-net](https://www.weave.works/products/weave-net/).

CNI-Genie also supports [assigning multiple IP addresses to a pod](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-ips/README.md#feature-2-extension-cni-genie-multiple-ip-addresses-per-pod), each from a different CNI plugin.

### cni-ipvlan-vpc-k8s
[cni-ipvlan-vpc-k8s](https://github.com/lyft/cni-ipvlan-vpc-k8s) contains a set 
of CNI and IPAM plugins to provide a simple, host-local, low latency, high
throughput, and compliant networking stack for Kubernetes within Amazon Virtual
Private Cloud (VPC) environments by making use of Amazon Elastic Network
Interfaces (ENI) and binding AWS-managed IPs into Pods using the Linux kernel's
IPvlan driver in L2 mode.

The plugins are designed to be straightforward to configure and deploy within a
VPC. Kubelets boot and then self-configure and scale their IP usage as needed 
without requiring the often recommended complexities of administering overlay 
networks, BGP, disabling source/destination checks, or adjusting VPC route 
tables to provide per-instance subnets to each host (which is limited to 50-100
entries per VPC). In short, cni-ipvlan-vpc-k8s significantly reduces the 
network complexity required to deploy Kubernetes at scale within AWS.

### Contiv

[Contiv](https://github.com/contiv/netplugin) provides configurable networking (native l3 using BGP, overlay using vxlan,  classic l2, or Cisco-SDN/ACI) for various use cases. [Contiv](http://contiv.io) is all open sourced.

### Contrail / Tungsten Fabric

[Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), based on [Tungsten Fabric](https://tungsten.io), is a truly open, multi-cloud network virtualization and policy management platform. Contrail and Tungsten Fabric are integrated with various orchestration systems such as Kubernetes, OpenShift, OpenStack and Mesos, and provide different isolation modes for virtual machines, containers/pods and bare metal workloads.

### DANM

[DANM](https://github.com/nokia/danm) is a networking solution for telco workloads running in a Kubernetes cluster. It's built up from the following components:

   * A CNI plugin capable of provisioning IPVLAN interfaces with advanced features
   * An in-built IPAM module with the capability of managing multiple, cluster-wide, discontinuous L3 networks and provide a dynamic, static, or no IP allocation scheme on-demand
   * A CNI metaplugin capable of attaching multiple network interfaces to a container, either through its own CNI, or through delegating the job to any of the popular CNI solution like SRI-OV, or Flannel in parallel
   * A Kubernetes controller capable of centrally managing both VxLAN and VLAN interfaces of all Kubernetes hosts
   * Another Kubernetes controller extending Kubernetes' Service-based service discovery concept to work over all network interfaces of a Pod

With this toolset DANM is able to provide multiple separated network interfaces, the possibility to use different networking back ends and advanced IPAM features for the pods.

### Flannel

[Flannel](https://github.com/coreos/flannel#flannel) is a very simple overlay
network that satisfies the Kubernetes requirements. Many
people have reported success with Flannel and Kubernetes.

### Google Compute Engine (GCE)

For the Google Compute Engine cluster configuration scripts, [advanced
routing](https://cloud.google.com/vpc/docs/routes) is used to
assign each VM a subnet (default is `/24` - 254 IPs).  Any traffic bound for that
subnet will be routed directly to the VM by the GCE network fabric.  This is in
addition to the "main" IP address assigned to the VM, which is NAT'ed for
outbound internet access.  A linux bridge (called `cbr0`) is configured to exist
on that subnet, and is passed to docker's `--bridge` flag.

Docker is started with:

```shell
DOCKER_OPTS="--bridge=cbr0 --iptables=false --ip-masq=false"
```

This bridge is created by Kubelet (controlled by the `--network-plugin=kubenet`
flag) according to the `Node`'s `.spec.podCIDR`.

Docker will now allocate IPs from the `cbr-cidr` block.  Containers can reach
each other and `Nodes` over the `cbr0` bridge.  Those IPs are all routable
within the GCE project network.

GCE itself does not know anything about these IPs, though, so it will not NAT
them for outbound internet traffic.  To achieve that an iptables rule is used
to masquerade (aka SNAT - to make it seem as if packets came from the `Node`
itself) traffic that is bound for IPs outside the GCE project network
(10.0.0.0/8).

```shell
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth0 -j MASQUERADE
```

Lastly IP forwarding is enabled in the kernel (so the kernel will process
packets for bridged containers):

```shell
sysctl net.ipv4.ip_forward=1
```

The result of all this is that all `Pods` can reach each other and can egress
traffic to the internet.

### Jaguar

[Jaguar](https://gitlab.com/sdnlab/jaguar) is an open source solution for Kubernetes's network based on OpenDaylight. Jaguar provides overlay network using vxlan and Jaguar CNIPlugin provides one IP address per pod.

### Knitter

[Knitter](https://github.com/ZTE/Knitter/) is a network solution which supports multiple networking in Kubernetes. It provides the ability of tenant management and network management. Knitter includes a set of end-to-end NFV container networking solutions besides multiple network planes, such as keeping IP address for applications, IP address migration, etc.

### Kube-router

[Kube-router](https://github.com/cloudnativelabs/kube-router) is a purpose-built networking solution for Kubernetes that aims to provide high performance and operational simplicity. Kube-router provides a Linux [LVS/IPVS](http://www.linuxvirtualserver.org/software/ipvs.html)-based service proxy, a Linux kernel forwarding-based pod-to-pod networking solution with no overlays, and iptables/ipset-based network policy enforcer.

### L2 networks and linux bridging

If you have a "dumb" L2 network, such as a simple switch in a "bare-metal"
environment, you should be able to do something similar to the above GCE setup.
Note that these instructions have only been tried very casually - it seems to
work, but has not been thoroughly tested.  If you use this technique and
perfect the process, please let us know.

Follow the "With Linux Bridge devices" section of [this very nice
tutorial](http://blog.oddbit.com/2014/08/11/four-ways-to-connect-a-docker/) from
Lars Kellogg-Stedman.

### Multus (a Multi Network plugin)

[Multus](https://github.com/Intel-Corp/multus-cni) is a Multi CNI plugin to support the Multi Networking feature in Kubernetes using CRD based network objects in Kubernetes.

Multus supports all [reference plugins](https://github.com/containernetworking/plugins) (eg. [Flannel](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel), [DHCP](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/dhcp), [Macvlan](https://github.com/containernetworking/plugins/tree/master/plugins/main/macvlan)) that implement the CNI specification and 3rd party plugins (eg. [Calico](https://github.com/projectcalico/cni-plugin), [Weave](https://github.com/weaveworks/weave), [Cilium](https://github.com/cilium/cilium), [Contiv](https://github.com/contiv/netplugin)). In addition to it, Multus supports [SRIOV](https://github.com/hustcat/sriov-cni), [DPDK](https://github.com/Intel-Corp/sriov-cni), [OVS-DPDK & VPP](https://github.com/intel/vhost-user-net-plugin) workloads in Kubernetes with both cloud native and NFV based applications in Kubernetes.

### NSX-T

[VMware NSX-T](https://docs.vmware.com/en/VMware-NSX-T/index.html) is a network virtualization and security platform. NSX-T can provide network virtualization for a multi-cloud and multi-hypervisor environment and is focused on emerging application frameworks and architectures that have heterogeneous endpoints and technology stacks. In addition to vSphere hypervisors, these environments include other hypervisors such as KVM, containers, and bare metal.

[NSX-T Container Plug-in (NCP)](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) provides integration between NSX-T and container orchestrators such as Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS platforms such as Pivotal Container Service (PKS) and OpenShift.

### Nuage Networks VCS (Virtualized Cloud Services)

[Nuage](http://www.nuagenetworks.net) provides a highly scalable policy-based Software-Defined Networking (SDN) platform. Nuage uses the open source Open vSwitch for the data plane along with a feature rich SDN Controller built on open standards.

The Nuage platform uses overlays to provide seamless policy-based networking between Kubernetes Pods and non-Kubernetes environments (VMs and bare metal servers). Nuage's policy abstraction model is designed with applications in mind and makes it easy to declare fine-grained policies for applications.The platform's real-time analytics engine enables visibility and security monitoring for Kubernetes applications.

### OpenVSwitch

[OpenVSwitch](https://www.openvswitch.org/) is a somewhat more mature but also
complicated way to build an overlay network.  This is endorsed by several of the
"Big Shops" for networking.

### OVN (Open Virtual Networking)

OVN is an opensource network virtualization solution developed by the
Open vSwitch community.  It lets one create logical switches, logical routers,
stateful ACLs, load-balancers etc to build different virtual networking
topologies.  The project has a specific Kubernetes plugin and documentation
at [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes).

### Project Calico

[Project Calico](http://docs.projectcalico.org/) is an open source container networking provider and network policy engine.

Calico provides a highly scalable networking and network policy solution for connecting Kubernetes pods based on the same IP networking principles as the internet, for both Linux (open source) and Windows (proprietary - available from [Tigera](https://www.tigera.io/essentials/)).  Calico can be deployed without encapsulation or overlays to provide high-performance, high-scale data center networking.  Calico also provides fine-grained, intent based network security policy for Kubernetes pods via its distributed firewall.

Calico can also be run in policy enforcement mode in conjunction with other networking solutions such as Flannel, aka [canal](https://github.com/tigera/canal), or native GCE, AWS or Azure networking.

### Romana

[Romana](http://romana.io) is an open source network and security automation solution that lets you deploy Kubernetes without an overlay network. Romana supports Kubernetes [Network Policy](/docs/concepts/services-networking/network-policies/) to provide isolation across network namespaces.

### Weave Net from Weaveworks

[Weave Net](https://www.weave.works/products/weave-net/) is a
resilient and simple to use network for Kubernetes and its hosted applications.
Weave Net runs as a [CNI plug-in](https://www.weave.works/docs/net/latest/cni-plugin/)
or stand-alone.  In either version, it doesn't require any configuration or extra code
to run, and in both cases, the network provides one IP address per pod - as is standard for Kubernetes.

{{% /capture %}}

{{% capture whatsnext %}}

The early design of the networking model and its rationale, and some future
plans are described in more detail in the [networking design
document](https://git.k8s.io/community/contributors/design-proposals/network/networking.md).

{{% /capture %}}
