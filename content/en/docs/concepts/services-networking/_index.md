---
title: "Services, Load Balancing, and Networking"
weight: 60
description: >
  Concepts and resources behind networking in Kubernetes.
---

## The Kubernetes network model

The Kubernetes network model enables container networking within a Pod and between Pods on the same or different nodes. Figure 1 depicts a cluster with a control plane and a couple of nodes, each with Pods containing one more containers. It points to the location in your cluster where the basic container network functions apply.

{{< figure src="/docs/images/k8s-net-model-intro2.drawio.svg" alt="diagram for k8net model intro showing network function location" class="diagram-large" caption="Figure 1. K8s cluster showing where container network functions are performed" >}}

In the single node (Node 1) case, you have connectivity between containers running on a single Pod, and between containers running on two or more Pods on the same node. 

In the multi-node case (Node 1 and Node 2), you have container communications between Pods on nodes connected via a network(s). In this case you will require network functions on both nodes.

You can look over container networking functions described in the _examples_ below.

* [Containers on the same pod](#containers-on-the-same-pod)
* [Pods on the same node](#pods-on-the-same-node)
* [Pods on different nodes using a physical network](#pods-on-different-nodes-using-a-physical-network)
* [Pods on different nodes using a virtual overlay network](#pods-on-different-nodes-using-a-virtual-overlay-network)

{{< note >}}
The container networking _examples_ shown below do not imply or describe a specific implementation. They are simply examples used to illustrate the container network functions defined in the K8s network model.  
{{< /note >}}

## Requirements

Every [Pod](/docs/concepts/workloads/pods/) in your cluster gets its own unique cluster-wide IP address called a _pod IP_. 

If you have deployed an [IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack/) cluster,
then you - or your network plugin(s) - must allocate pod IPs for IPv4 and IPv6 for each pod.

This is performed per [_address family_](https://www.iana.org/assignments/address-family-numbers/address-family-numbers.xhtml), with one for IPv4 addresses and one for IPv6 addresses. You can assign an Ethernet MAC address to each Pod. Kubernetes does not require that a Pod has a unique identity at the data-link layer.

Kubernetes imposes the following requirements on any networking
implementation (barring any intentional network segmentation policies):

* Containers in same Pod can communicate with each other.
* Pods can communicate with all other Pods on the same or separate [nodes](/docs/concepts/architecture/nodes/)
without network address translation (NAT).
* Pods can communicate with other Pods on the same or separate nodes using layer 2 bridging, native layer 3 (IPv4, IPv6) networking, MPLS, segment routing, tunneling, or other techniques for conveying packets from one Pod to another.

Some platforms, such as Linux and Windows, support Pods running in the host network. Pods attached to the host network of a node can still communicate with all Pods on all nodes without NAT.

{{< note >}}
Some of the terms used in describing K8s networking might be new or require more details. To review these terms, see [K8s network terminology](#terminology).
{{< /note >}}

### Containers on the same pod

Inter-container connectivity on the same Pod makes use of pod IPs, network namespaces and localhost networking.

Pods run in their own [network namespace](https://man7.org/linux/man-pages/man7/network_namespaces.7.html). All the containers in a Pod share this network namespace. (Network namespaces are not the same as the Kubernetes {{< glossary_tooltip text="namespace" term_id="namespace" >}} concept).

Figure 2 illustrates an example of localhost communications between two containers on the same Pod. 

{{< figure src="/docs/images/k8s-localhost-02.drawio.svg" alt="diagram of K8s local networking for containers in a single Pod" class="diagram-large" caption="Figure 2. Example of container communications within the same Pod using localhost:port number" >}}

Your Pod 1 containers share a network namespace, IP address and MAC address. However, you do need to configure separate port numbers for each container.

### Pods on the same node

Inter-pod connectivity on the same node utilize pod IPs, Pod and root network namespaces, [veth links](https://man7.org/linux/man-pages/man4/veth.4.html) and a [virtual L2 bridge](https://en.wikipedia.org/wiki/Data_link_layer).

Pods operate in their own network namespace and have their own IP and MAC addresses. You can think of this as multiple distinct IP computers (pods), that wish to talk with each other through a L2 bridge. Inter-pod networking on the same node is no different.

This example of inter-pod networking on the same node requires:

* Root network namespace for the node. 

* Veth links enabling communication between the Pod network namespace and root network namespace. 

* L2 or L3 networking between the Pods. This example uses a virtual L2 bridge. You might use a different approach supported by your network plugin.

Figure 3 illustrates an example of two Pods talking to each other on the same node. 

{{< figure src="/docs/images/k8net-PodSameHost04.drawio.svg" alt="diagram of 2 Pods on the same node using an L2 bridge" class="diagram-large" caption="Figure 3. Example of Pod 1 and Pod 2 on the same node communicating through a L2 bridge" >}}

### Pods on different nodes

#### Physical network

Your Kubernetes deployment might place Pods on a network of nodes. With this topology, you can distribute your workloads across many Pods to increase scale and resiliency. Inter-pod networking between distinct nodes becomes a crucial function for your cluster network. 

In all scenarios involving inter-node Pod networking (physical or virtual), you will have a physical network in place. This provides you with communications between different network resources needed for K8s and non-K8s application support, APIs, metrics collection, operations and troubleshooting. 

For a K8s-specific example, you could have a process call the control plane API server to issue an HTTP request to a node kubelet. 

Figure 4 depicts the physical network supporting this API example.

{{< figure src="/docs/images/k8s-api-to-kubelet-example.drawio.svg" alt="diagram of k8s API server to node kubelet" class="diagram-large" caption="Figure 4. Example of control plane to node communications using the physical network" >}}

In addition to addressing your K8s inter-node Pod networking requirements, your physical network can support NTP, IPsec IKEv2, OAM tasks and others specific to your environment.

{{< note >}}
The physical network can transport encapsulated (used in virtual overlay networks) and non-encapsulated pod packets.
{{< /note >}}

#### Pods on different nodes using a physical network

This example uses Pod and root network namespaces, veth links, network plugins and the physical network. 

Figure 5 illustrates an example where Pods on different nodes use the physical network to communicate.

{{< figure src="/docs/images/k8s-net-phys-net.drawio.svg" alt="diagram of inter-node Pod networking using physical network " class="diagram-large" caption="Figure 5. Example of Pod 1 - Pod 2 networking on different nodes using a physical network" >}}

The network plugin exposes Pods (pod IP) to the physical network addressing and forwarding. In essence your Pods become IP host end-points reachable by all other end-points on the physical network. You can leverage existing network transport, address management, performance, security and operational best-practices to support your Pod networking requirements.

To ensure Pod access integrity, you should apply [pod security](/docs/concepts/security/pod-security-standards) measures along with one or more network functions designed to protect hosts from malicious attacks. Examples include packet filters, address management, network segmentation, authentication and encryption. 

The physical network approach offers you several advantages:

* Common physical network to handle K8s and non-K8s traffic.
* Optimal network performance.
* Enhanced security with a CNI plugin that handles encrypted communications such as IPsec or TLS.

The challenges to you include CNI plugin management and non-K8s network operations impact to your cluster.

For more information on two examples of physical network implementations, see [Calico BGP](https://github.com/projectcalico/calico) and [Cilium native-routing](https://docs.cilium.io/en/v1.13/network/concepts/routing/#native-routing).

#### Pods on different nodes using a virtual overlay network

You can address your inter-node pod networking requirements by deploying a [virtual overlay network](https://book.systemsapproach.org/applications/overlays.html). This approach employs virtual tunnels to form a separate logical _overlay network_ for the express purpose of transporting packets from one pod to another.

Figure 6 illustrates the notion of a virtual overlay network running through (or on top of) a physical underlay network.   

{{< figure src="/docs/images/k8s-net-vert-overlay-big2.drawio.svg" alt="diagram of virtual overlay network running on top of a physical underlay network." class="diagram-large" caption="Figure 6. Example of a virtual overlay network" >}}
 
Pods 1, 2 and 3 are networked together through a mesh of virtual tunnels. Your encapsulated pod packets injected into a virtual tunnel are transported from one node to another across your physical underlay network. 

{{< note >}}
A physical network is sometimes referred to as a _physical underlay network_. This because it is transporting virtual overlay network packets.   
{{< /note >}}

Figure 7 shows an example of a virtual overlay network composed of two pods running on separate nodes and connected via virtual overlay network tunnel. It uses pod and root network namespaces, network plugins, tunnel encapsuation/decapsulation, and a physical underlay network.
 
{{< figure src="/docs/images/k8s-net-virtual-overlay.drawio.svg" alt="diagram of 2 x k8s pods on separate nodes using virtual tunnels" class="diagram-large" caption="Figure 7. Example of Pod 1 - Pod 2 networking on different nodes using a virtual overlay network tunnel" >}}

In this example, the network plugin has set up a _virtual overlay network_. Pod packets sourced on one node and destined for Pods 
on a different node are encapsulated and sent over a tunnel mechanism such as [GENEVE](https://en.wikipedia.org/wiki/Generic_Network_Virtualization_Encapsulation). 

The destination node retrieves the encapsulated pod packet, strips off the encap header, and then sends it to the target Pod, providing that there are no
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) restrictions to block that packet.

The virtual overlay approach offers you several advantages: 

* Isolates the virtual overlay network from the physical underlay network. 
* Enhanced security with a CNI plugin that handles encrypted communications such as IPsec or TLS.
  
The challenges to you include CNI plugin management, tunnel encap/decap performance overhead and network troubleshooting.

For more information on two examples of virtual overlay network implementations, see [Flannel](https://github.com/flannel-io/flannel) and [Weavenet](https://www.weave.works/docs/net/latest/overview/). 

#### Network plugin references

* [Documentation](https://www.cni.dev/docs/)

* [Specification](https://www.cni.dev/docs/spec/)

* [Supported container runtimes](https://github.com/containernetworking/cni#container-runtimes)

* [Reference plugins](https://www.cni.dev/plugins/current/#reference-plugins)

* [3rd party plugins](https://github.com/containernetworking/cni#3rd-party-plugins)

* [Introduction to CNI](https://youtu.be/YjjrQiJOyME)

* [CNI deep dive](https://youtu.be/zChkx-AB5Xc)

* [Webinar: Kubernetes and Networks](https://www.youtube.com/watch?v=GgCA2USI5iQ)

#### Terminology

* Physical network - Network resources such as routers or switches that forward packets between nodes.

* [Virtual overlay network](https://book.systemsapproach.org/applications/overlays.html) - Logical or virtual network of tunnels using encapsulation to connect Pods running on different nodes.

* [Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) set up IP
  addressing for Pods and their containers, and allow Pods to communicate even when the source Pod and
  destination Pod are running on different nodes. Different network plugins achieve this in different ways
  with examples including tunneling or IP routing.

{{< note >}}
Network plugins are also known as _CNI_ or _CNI plugins_. To learn more about K8s CNI network plugins, see [network plugin references](#network-plugin-references).
{{< /note >}}

* L2 bridge - a (virtual) [layer 2](https://en.wikipedia.org/wiki/Data_link_layer) bridge enabling inter-pod connectivity on the same host.

* Encapsulation - Ability to encapsulate L2 or L3 packets belonging to an `inner network` with an `outer network` header for transport across the `outer network`. This forms a `tunnel` where the encapsulation function is performed at tunnel ingress and de-encapsulation function is performed at tunnel egress. You can think of Pods on nodes as the `inner network` and nodes networked together as the `outer network`. [IPIP](https://www.rfc-editor.org/rfc/rfc2003) and [VXLAN](https://www.rfc-editor.org/rfc/rfc7348) are two examples of encapsulation employed in K8s cluster networks.

* [Virtual ethernet link](https://man7.org/linux/man-pages/man4/veth.4.html) (veth) - Virtual link allowing you to convey packets between namespaces.

* [Network namespace](https://man7.org/linux/man-pages/man7/network_namespaces.7.html) - Form of isolation where resources such as Pods share a network stack. You will also a default _root network namespace_ offering up a network stack for the Pod and node connectivity.

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
