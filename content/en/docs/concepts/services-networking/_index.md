---
title: "Services, Load Balancing, and Networking"
weight: 60
description: >
  Concepts and resources behind networking in Kubernetes.
---

[//]: # (Change section to Kubernetes network model and update docs references )
## The Kubernetes network model

Every [`Pod`](/docs/concepts/workloads/pods/) in your cluster gets its own unique cluster-wide IP address. This is referred to as the "IP-per-pod" model.

[//]: # (Understand the ports related to TCP/UDP. Don't think host ports is useful for the reader as this point.) 
[//]: # (This means you do not need to explicitly create links between `Pods` and you
almost never need to deal with mapping container ports to host ports.)  

This model provides you with the following advantages:

* clean, backwards-compatible model approach where `Pods` can be treated 
much like VMs or physical hosts. from the perspectives of port allocation, networking,
* supports naming, service discovery, [load balancing](/docs/concepts/services-networking/ingress/#load-balancing), 
application configuration and migration.
  
The network model is not only less complex overall, but it is compatible
with the desire for Kubernetes to enable low-friction porting of your apps from VMs
to containers. If your job previously ran in a VM, your VM had an IP and could
talk to other VMs in your project.  This is the same basic model.

Kubernetes imposes the following requirements on any networking
implementation (barring any intentional network segmentation policies):

* containers in same pod can communicate with each other
* pods can communicate with all other pods on the same or separate [nodes](/docs/concepts/architecture/nodes/)
without network address translation (NAT)
* pods can communicate with other pods on the same or separate nodes using L2 bridging, native L3 (IPv4, IPv6) networking, tunneling, or other CNI-specific techniques for conveying packets from one pod to another.  

Some platforms, such as Linux, support `Pods` running in the host network. Pods attached to the host network of a node can still communicate 
with all pods on all nodes without NAT.

## Architecture

The Kubernetes network model introduces an architecture that allows you to support your cluster networking requirements.

Figure 1 illustrates the general Kubernetes network architecture.

{{< figure src="/docs/images/k8net-Pod-arch-template.drawio.svg" alt="k8s net arch" class="diagram-large" caption="Figure 1. K8s Network Architecture" >}}

The components of the architecture consist of the following:

* Nodes that can be virtual (VM) or physical.
  
* Pods configured on each node with one or more containers.
  
* Pods on each node that come with their own IP (v4-only, v6-only, 4/6 dual stack) and MAC address(es) run in their own network namespace.
  
* Pods use a virtual "link" between the pod network namespace and root network namespace. This permits pod packets to utilize network functions defined in the root network namespace 
  
* L2bridge allows communications between pods on the same node. 
  
* CNI plugin supporting different forms of inter-pod networking. Some plugins employ a virtual overlay network in which packets are encapsulated and tunneled between pods on different nodes. Other CNI plugins use L3 IP networking to route packets between pods on different hosts. You have a multitude of CNI plugins that can best meet your cluster network requirements.

You might discover a different variant of this architecture that you prefer to run in your environment. However, it should meet the network requirements noted above. 

### Containers on the same pod

Kubernetes IP addresses exist at the `Pod` scope - containers within a `Pod`
share their network namespaces - including their IP address and MAC address.
Containers within a `Pod` can all reach each other's ports on
`localhost`. 

Figure 2 illustrates localhost communications between two containers on the same pod. You define a pod 1 network namespace that essentially provides pod 1 with its own network stack. Containers on pod 1 share a single IP and MAC address; containers on pod 1 are configured with separate port numbers.

{{< figure src="/docs/images/k8net-localhost.drawio.svg" alt="k8s localhost" class="diagram-large" caption="Figure 2. Container 1 - Container 2 using localhost" >}}

Your containers within a `Pod` must coordinate port
usage, but this is no different from processes in a VM.  

How this is implemented is a detail of the particular container runtime you employ in your environment .

It is possible to request ports, call host ports on the `Node` itself which forward packets to your `Pod`. This is a very niche operation. How that forwarding is
implemented is a detail of the container runtime. The `Pod` itself is
blind to the existence or non-existence of host ports.

### Pods on the same node.

Reference figure 2 with more details on components and data path

### Pods on different nodes

Create new figure with CNI details and data path. Include multiple examples.

## Network Concerns

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
