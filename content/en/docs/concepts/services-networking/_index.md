---
title: "Services, Load Balancing, and Networking"
weight: 60
description: >
  Concepts and resources behind networking in Kubernetes.
---

## The Kubernetes network model

The Kubernetes network model enables container networking within a pod and between pods on the same or different nodes. 

Figure 1 depicts a cluster with a control plane, couple of nodes (VM or physical) attached to a network, each with pods containing one more containers. In addition, each pod has its own IP address called a `pod IP`.

{{< figure src="/docs/images/k8s-net-model-arch2a.drawio.svg" alt="diagram for k8net model cluster" class="diagram-large" caption="Figure 1. High-level example of a K8s cluster supporting container networking" >}}

The other K8s network components shown in figure consist of the following:

* `Local pod networking` - optional component that enables pod-to-pod communications in the same node. You might know this as a `virtual L2 bridge` which is just one possible implementation.

* `Network plugins` - sets up IP addressing for pods and their containers, and allow pods to communicate even when the source pod and destination pod are running on different nodes. Different network plugins achieve this in different ways with examples including tunneling or IP routing.

In the single node (Node 1) case, you have connectivity between containers running on a single pod such as Pod 1. You also have connectivity between containers running on two or more pods on the same node with the example here being Pod 1 and Pod 7 running on Node 1.  

In the multi-node case (Node 1 and Node 2), you have container communications between pods on nodes connected via a network. In the example above, Pod 7 on Node 1 can talk to Pod 21 on Node 2.

{{< note >}}
The network model permits all pods to talk to all other pods on the cluster. However, you might implement policies in your cluster to limit what pods can talk to other pods.   
{{< /note >}}

The network model describes how pods and their associated pod IPs can integrate with the larger network to support container networking. 

[comment]: <> (this comment comes from the "good talk .." webinar referenced below.)

[comment]: <> (All diagrams.net figures are available at: https://drive.google.com/drive/folders/1MPOeuJ3wTzptutZX_6GKpLK8ljnojKE8?usp=sharing)

[comment]: <> (good talk on K8 network models at https://www.cncf.io/wp-content/uploads/2020/08/CNCF_Webinar_-Kubernetes_network_models.pdf)

[comment]: <> (You can look over container networking functions described in the _examples_ below.)

[comment]: <> (* [Containers on the same pod]&#40;#containers-on-the-same-pod&#41;)

[comment]: <> (* [Pods on the same node]&#40;#pods-on-the-same-node&#41;)

[comment]: <> (* [Pods on different nodes using a physical network]&#40;#pods-on-different-nodes-using-a-physical-network&#41;)

[comment]: <> (* [Pods on different nodes using a virtual overlay network]&#40;#pods-on-different-nodes-using-a-virtual-overlay-network&#41;)



[comment]: <> ({{< note >}})

[comment]: <> (The container networking _examples_ shown below do not imply or describe a specific implementation. They are simply examples used to illustrate the container network functions defined in the K8s network model.  )

[comment]: <> ({{< /note >}})

## Requirements

Every [Pod](/docs/concepts/workloads/pods/) in your cluster gets its own unique cluster-wide IP address called a _pod IP_. 

If you have deployed an [IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack/) cluster,
then you - or your network plugin(s) - must allocate pod IPs for IPv4 and IPv6 for each pod. This is performed per [_address family_](https://www.iana.org/assignments/address-family-numbers/address-family-numbers.xhtml), with one for IPv4 addresses and one for IPv6 addresses. 

Kubernetes imposes the following requirements on any networking implementation (barring any intentional network segmentation policies):

* Containers in same pod can communicate with each other.
* Pods can communicate with all other Pods on the same or separate [nodes](/docs/concepts/architecture/nodes/)
without network address translation (NAT).
* Agents on a node (e.g. system daemons, kubelet) can communicate with all pods on that node.

Some platforms, such as Linux and Windows, support pods running in the host network. Pods attached to the host network of a node can still communicate with all pods on all nodes without NAT.

{{< note >}}
Some of the terms used in describing K8s networking might be new or require more details. To review these terms, see [K8s network terminology](#terminology).
{{< /note >}}

## Implementation examples

{{< warning >}}
This section provides you with several implementation example diagrams. These diagrams serve as a visual guide to help you understand pod networking integration. Please note that these are just _examples_. There are multiple methods that you can use to meet your cluster requirements. 
{{< /warning >}}


### Containers on the same pod

In this example, inter-container connectivity on the same pod makes use of pod IPs, network namespaces and localhost networking.

Pods run in their own [network namespace](https://man7.org/linux/man-pages/man7/network_namespaces.7.html). All the containers in a pod share this network namespace. (Network namespaces are not the same as the Kubernetes {{< glossary_tooltip text="namespace" term_id="namespace" >}} concept).

Figure 2 illustrates this example of localhost communications between two containers on the same Pod. 

{{< figure src="/docs/images/k8s-localhost-02.drawio.svg" alt="diagram of K8s local networking for containers in a single Pod" class="diagram-large" caption="Figure 2. Example of container communications within the same Pod using localhost:port number" >}}

Your Pod 1 containers share a network namespace and an IP address. However, you do need to configure separate port numbers for each container.

### Pods on the same node

In this example, inter-pod connectivity on the same node utilizes pod IPs, pod and root network namespaces, [veth links](https://man7.org/linux/man-pages/man4/veth.4.html), and a [virtual L2 bridge](https://en.wikipedia.org/wiki/Data_link_layer).

Pods operate in their own network namespace and have their own IP addresses. You can think of this as multiple distinct IP computers (pods), that wish to talk with each other through a L2 bridge. Inter-pod networking on the same node is no different.

This particular example of inter-pod networking on the same node employs the following:

* Root network namespace for the node. 

* Veth links enabling communication between the pod network namespace and root network namespace. 

* L2 or L3 networking between the Pods. This example uses a virtual L2 bridge for local pod networking. 

Figure 3 illustrates an example of two pods talking to each other on the same node. 

{{< figure src="/docs/images/k8net-PodSameHost04.drawio.svg" alt="diagram of 2 Pods on the same node using an L2 bridge" class="diagram-large" caption="Figure 3. Example of Pod 1 and Pod 2 on the same node communicating through a L2 bridge" >}}

[comment]: <> (### Pods on different nodes)

[comment]: <> (#### Physical network)

[comment]: <> (Your Kubernetes deployment might place Pods on a network of nodes. With this topology, you can distribute your workloads across many Pods to increase scale and resiliency. Inter-pod networking between distinct nodes becomes a crucial function for your cluster network. )

[comment]: <> (In all scenarios involving inter-node Pod networking &#40;physical or virtual&#41;, you will have a physical network in place. This provides you with communications between different network resources needed for K8s and non-K8s application support, APIs, metrics collection, operations and troubleshooting. )

[comment]: <> (For a K8s-specific example, you could have a process call the control plane API server to issue an HTTP request to a node kubelet. )

[comment]: <> (Figure 4 depicts the physical network supporting this API example.)

[comment]: <> ({{< figure src="/docs/images/k8s-api-to-kubelet-example.drawio.svg" alt="diagram of k8s API server to node kubelet" class="diagram-large" caption="Figure 4. Example of control plane to node communications using the physical network" >}})

[comment]: <> (In addition to addressing your K8s inter-node Pod networking requirements, your physical network can support NTP, IPsec IKEv2, OAM tasks and others specific to your environment.)


[comment]: <> (#### Pods on different nodes using a physical network)

[comment]: <> (This example uses Pod and root network namespaces, veth links, network plugins and the physical network. )

[comment]: <> (Figure 5 illustrates an example where Pods on different nodes use the physical network to communicate.)

[comment]: <> ({{< figure src="/docs/images/k8s-net-phys-net.drawio.svg" alt="diagram of inter-node Pod networking using physical network " class="diagram-large" caption="Figure 5. Example of Pod 1 - Pod 2 networking on different nodes using a physical network" >}})

[comment]: <> (The network plugin exposes Pods &#40;pod IP&#41; to the physical network addressing and forwarding. In essence your Pods become IP host end-points reachable by all other end-points on the physical network. You can leverage existing network transport, address management, performance, security and operational best-practices to support your Pod networking requirements.)

[comment]: <> (To ensure Pod access integrity, you should apply [pod security]&#40;/docs/concepts/security/pod-security-standards&#41; measures along with one or more network functions designed to protect hosts from malicious attacks. Examples include packet filters, address management, network segmentation, authentication and encryption. )

[comment]: <> (The physical network approach offers you several advantages:)

[comment]: <> (* Common physical network to handle K8s and non-K8s traffic.)

[comment]: <> (* Optimal network performance.)

[comment]: <> (* Enhanced security with a CNI plugin that handles encrypted communications such as IPsec or TLS.)

[comment]: <> (The challenges to you include CNI plugin management and non-K8s network operations impact to your cluster.)

[comment]: <> (For more information on two examples of physical network implementations, see [Calico BGP]&#40;https://github.com/projectcalico/calico&#41; and [Cilium native-routing]&#40;https://docs.cilium.io/en/v1.13/network/concepts/routing/#native-routing&#41;.)

#### Pods on different nodes using a virtual overlay network

This example illustrates the use of a [virtual overlay network](https://book.systemsapproach.org/applications/overlays.html) to address your inter-node pod networking requirements. This approach employs virtual tunnels to form a separate _virtual overlay network_ to transport packets from one pod to another across the network.

Figure 4 illustrates the notion of a virtual overlay network. Pods 1, 2 and 3 are networked together through a mesh of virtual tunnels.  

{{< figure src="/docs/images/k8s-net-vert-overlay-big2.drawio.svg" alt="diagram of virtual overlay network running on top of a physical underlay network." class="diagram-large" caption="Figure 4. Example of a virtual overlay network" >}}
 
 

[comment]: <> (At the source node, your source pod packets are encapsulated in a new header so they can be transported across the network. Your encapsulated source pod packets are then injected into a virtual tunnel and delivered across the network to the destination node. Upon arrival, the packets are de-encapsulated forwarded on to the destination pod.  )

[comment]: <> ({{< note >}})

[comment]: <> (A physical network is sometimes referred to as a _physical underlay network_. This because it is transporting virtual overlay network packets.   )

[comment]: <> ({{< /note >}})

Figure 5 shows an example of a virtual overlay network composed of two pods running on separate nodes and connected via a virtual overlay network tunnel. It uses pod and root network namespaces, network plugins and tunnel encapsuation/decapsulation.
 
{{< figure src="/docs/images/k8s-net-virtual-overlay.drawio.svg" alt="diagram of 2 x k8s pods on separate nodes using virtual tunnels" class="diagram-large" caption="Figure 5. Example of Pod 1 - Pod 2 networking on different nodes using a virtual overlay network tunnel" >}}

In this example, the network plugin has set up a _virtual overlay network_. Pod packets sourced on one node and destined for pods 
on a different node are encapsulated and sent over a tunnel mechanism such as [GENEVE](https://en.wikipedia.org/wiki/Generic_Network_Virtualization_Encapsulation). 

The destination node retrieves the encapsulated pod packet, strips off the encapsulation header, and then sends it to the target pod, providing that there are no
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) restrictions to block that packet.

[comment]: <> (The virtual overlay approach offers you several advantages: )

[comment]: <> (* Isolates the virtual overlay network from the physical underlay network. )

[comment]: <> (* Enhanced security with a CNI plugin that handles encrypted communications such as IPsec or TLS.)
  
[comment]: <> (The challenges to you include CNI plugin management, tunnel encap/decap performance overhead and network troubleshooting.)

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

[comment]: <> (* Physical network - Network resources such as routers or switches that forward packets between nodes.)

* [Virtual overlay network](https://book.systemsapproach.org/applications/overlays.html) - Logical or virtual network of tunnels using encapsulation to connect Pods running on different nodes.

* [Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) set up IP
  addressing for Pods and their containers, and allow pods to communicate even when the source Pod and
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
