---
title: "Services, Load Balancing, and Networking"
weight: 60
description: >
  Concepts and resources behind networking in Kubernetes.
---

## The Kubernetes network model

Every [`Pod`](/docs/concepts/workloads/pods/) in your cluster gets its own unique cluster-wide IP address. This is referred to as the "IP-per-pod" model.

This model offers you with the following advantages:

* Clean, backwards-compatible approach where `Pods` can be treated 
much like VMs or physical hosts from the perspectives of port allocation, networking,
* Supports naming, service discovery, [load balancing](/docs/concepts/services-networking/ingress/#load-balancing), 
application configuration and migration.
  
The network model is not only less complex overall, but it is compatible
with the desire for Kubernetes to enable low-friction porting of your apps from VMs
to containers. If your app previously ran in a VM, your VM had an IP address and could
talk to other VMs in your project. This is the same basic model.

Kubernetes imposes the following requirements on any networking
implementation (barring any intentional network segmentation policies):

* Containers in same pod can communicate with each other.
* Pods can communicate with all other pods on the same or separate [nodes](/docs/concepts/architecture/nodes/)
without network address translation (NAT).
* Pods can communicate with other pods on the same or separate nodes using layer 2 bridging, native layer 3 (IPv4, IPv6) networking, tunneling, or other techniques for conveying packets from one pod to another.

Some platforms, such as Linux, support pods running in the host network. Pods attached to the host network of a node can still communicate with all pods on all nodes without NAT.

## Terminology

* IPv4 address - 32 bit IP addresses assigned to pod interfaces, host interfaces, L2 bridges, tunnel end-points and any other network resource requiring IPv4 connectivity. An example is `192.68.13.1`.
  
* IPv6 address - 128 bit IP address assigned to pod interfaces, host interfaces, L2 bridges, L3 routers, tunnel end-points and any other network resources requiring IPv6 connectivity. You can configure one or more IPv6 addresses on an interface. An exampole is `2001:db8:3333:4444:5555:6666:7777:8888.`

* Dual Stack - IPv4 and IPv6 addresses assigned to pod interfaces, host interfaces, L2 bridges, L3 routers, tunnel end-points and any other network resource requiring IPv4 and IPv6 connectivity.

* L2 bridge - a (virtual) [layer 2](https://en.wikipedia.org/wiki/Data_link_layer) bridge.

* Host Network - Network functions residing in user space or the kernel of physical or virtual nodes. 

* Encapsulation - ability to encapsulate an L2 or L3 packets belonging to an `inner network` with an `outer network` header for transport across the `outer network`. This forms a `tunnel` where the encapsulation function is performed at tunnel ingress and de-encapsulation function is performed at tunnel egress. You can think of pods on nodes as the `inner network` and nodes networked together as the `outer network`. [IPIP](https://www.rfc-editor.org/rfc/rfc2003) and [VXLAN](https://www.rfc-editor.org/rfc/rfc7348) are two examples of encapsulation employed in K8s cluster networks.

* [Virtual overlay network](https://book.systemsapproach.org/applications/overlays.html) - Logical or virtual network of tunnels using encapsulation that connect pods running on different nodes. You can imagine the virtual overlay network runs "on top" of the physical underlay network.   

* Physical underlay network - Network resources performing packet forwarding between nodes. 

* Virtual ethernet link ([VETH](https://man7.org/linux/man-pages/man4/veth.4.html)) - Virtual link allowing you to convey packets between namespaces. 

* [Network namespace](https://man7.org/linux/man-pages/man7/network_namespaces.7.html) - Form of isolation where resources share a network stack, memory, processing and so on.

* CNI - Container network interface providing network configuration, IP address allocation and possibly CNI-specific methods for packet forwarding that enables inter-pod networking. 


## Architecture components

The Kubernetes network model introduces a flexible architecture and accompanying components. You can configure and deploy a combination of these different components to assemble an implementation to best meet your cluster networking requirements. 

Figure 1 illustrates the Kubernetes network architecture and accompanying components used in the examples below. 

{{< figure src="/docs/images/k8net-net-arch2.drawio.svg" alt="k8s net arch" class="diagram-large" caption="Figure 1. K8s Network Architecture and Components" >}}

The network architecture and components consist of the following:

* Nodes configured in virtual (VM) or physical (bare-metal) environments.
  
* Pods configured on each node with one or more containers.
  
* Each Pod has its own IP address (Pod IP) ; this is per [_address family_](https://www.iana.org/assignments/address-family-numbers/address-family-numbers.xhtml), so a cluster that uses IPv4 and IPv6 networking assigns one IPv4 address to each Pod, and also assigns one IPv6 address to each Pod.
  
  * Pods run in their own [network namespace](https://man7.org/linux/man-pages/man7/network_namespaces.7.html). All the containers in a pod share this
    network namespace. (Network namespaces are not the same as the Kubernetes
    {{< glossary_tooltip text="namespace" term_id="namespace" >}} concept).
    
  * You can assign an Ethernet mac address to each Pod.
    Kubernetes does not require that a Pod has a unique identity at the data-link layer.
 
* Pods use a virtual point-to-point (p2) "link" between the pod network namespace and root network namespace. This permits pod packets to utilize network functions defined in the root network namespace.  
  
* L2bridge is a virtual L2 bridge that allows attachment, configuration and communications between pods on the same node. Depending on your deployment of container runtimes and CNI, you might know this entity as a `linux bridge`, `docker0`, `cbr0` or `cni0`.

* [Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#:~:text=A%20CNI%20plugin%20is%20required,releases%20of%20the%20CNI%20specification.) allow pods to communicate even when the source pod destination pod are running on different nodes. Network plugins achieve this in different
  ways. 
  
* Virtual overlay network consists of a network of tunnels connecting pods running on different nodes.

* Physical underlay network, composed of L2 switches or L3 routers for example, transport packets between nodes. 

Kubernetes networking provides a number of capabilities. You can look over some of these capabilities and functions described in the examples below.

* [Containers on the same pod](#containers-on-the-same-pod)
* [Pods on the same node](#pods-on-the-same-node)
* [Pods on different nodes using a virtual overlay network](#pods-on-different-nodes-using-a-virtual-overlay-network)
* [Pods on different nodes using a physical underlay network](#pods-on-different-nodes-using-a-physical-underlay-network)

You might discover a different variant of this architecture and components that you prefer to run in your environment. However, it should meet some or all of the network requirements noted above.

### Containers on the same pod

Containers within a pod share their network namespaces including their IP address and MAC addresses.

Containers within a pod can all reach each other's ports on
`localhost:port number`. If you examine a pod you will see a `lo0` interface used for localhost communications between containers in the pod network namespace. 

Figure 2 illustrates an example of localhost communications between two containers on the same pod. You define a pod 1 network namespace that provides pod 1 with its own isolated network stack. Your containers on pod 1 share a single IP and MAC address; Containers on pod 1 are configured with separate port numbers.

{{< figure src="/docs/images/k8net-localhost.drawio.svg" alt="k8s localhost" class="diagram-large" caption="Figure 2. Example of container 1 communication with container 2 using localhost:port number" >}}

Your containers within a pod must coordinate port usage, but this is no different from processes in a VM.  

How you implement this is a detail of the particular container runtime you employ in your environment .

It is possible to request ports or call host ports on the node itself which forward packets to your pod. This is a very niche operation. How you implement this is a detail of the container runtime. The pod itself is blind to the existence or non-existence of host ports.

### Pods on the same node

You cluster deployment might include two or more pods running on the same node. You might also require communications between your pods on the same node. 

Pods operate in their own namespace and have their own IP and MAC addresses. You can think of this as multiple distinct IP computers that want to talk with each other. Inter-pod networking on the same node is no different.

This example of inter-pod networking on the same host requires:

* Communication between the pod network namespaces and root network namespace. The establishment of a veth p2p links accomplishes this.

* L2 or L3 networking between the pods. This example uses a virtual L2 bridge. Your implementation might use a different approach implemented in a network plugin.

Figure 3 illustrates an example of two pods talking each other on the same node. 

{{< figure src="/docs/images/k8net-PodSameHost03.drawio.svg" alt="k8s pods samehost" class="diagram-large" caption="Figure 3. Example of Pod 1 and Pod 2 on Node 1 communicating with each other" >}}

 
### Pods on different nodes

Your Kubernetes deployment might place pods on a network of nodes. With this pod topology, you can distribute your workloads across many pods to increase scale and resiliency. Inter-pod networking between distinct nodes becomes a crucial function of your cluster network. 


#### Container network interface

Add CNI explanation and references.


#### Pods on different nodes using a virtual overlay network

This example uses a virtual overlay network to support inter-pod networking.  

{{< figure src="/docs/images/k8net-net-overlay.drawio.svg" alt="k8s pods virtual overlay" class="diagram-large" caption="Figure 4. Example of Pod 1 - Pod 4 networking on different nodes using a virtual overlay network" >}}

In this example, the network plugin has set up an _virtual overlay network_. Packets that need to go
to a different node are encapsulated and sent over a tunnel mechanism such as
[GENEVE](https://en.wikipedia.org/wiki/Generic_Network_Virtualization_Encapsulation). 

The destination node retrieves the inner packet and sends it to the target Pod, providing that there are no
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) restrictions to block that packet.

#### Pods on different nodes using a physical underlay network

This example uses the physical underlay network to support inter-pod networking. 

{{< figure src="/docs/images/k8net-PodDiffHost-physical-underlay.drawio.svg" alt="k8s pods physical underay" class="diagram-large" caption="Figure 5. Example of Pod 1 - Pod2 networking on different nodes using a physical underlay network" >}}




## Design principles for Kubernetes networking

Kubernetes networking addresses four concerns:
- Containers within a Pod [use networking to communicate](/docs/concepts/services-networking/dns-pod-service/) via loopback.
- Cluster networking provides communication between different Pods.
- The [Service](/docs/concepts/services-networking/service/) API lets you
  [expose an application running in Pods](/docs/tutorials/services/connect-applications-service/)
  to be reachable from outside your cluster.
  - [Ingress](/docs/concepts/services-networking/ingress/) provides extra functionality
    specifically for exposing HTTP applications, websites and APIs.
- You can also use Services to
  [publish services only for consumption inside your cluster](/docs/concepts/services-networking/service-traffic-policy/).

The [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial lets you learn about Services and Kubernetes networking with a hands-on example.

[Cluster Networking](/docs/concepts/cluster-administration/networking/) explains how to set
up networking for your cluster, and also provides an overview of the technologies involved.
