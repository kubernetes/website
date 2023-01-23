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
  
This model is not only less complex overall, but it is compatible
with the desire for Kubernetes to enable low-friction porting of your apps from VMs
to containers. If your job previously ran in a VM, your VM had an IP and could
talk to other VMs in your project.  This is the same basic model.

Kubernetes imposes the following fundamental requirements on any networking
implementation (barring any intentional network segmentation policies):

* containers in same pod can communicate with each other
* pods can communicate with all other pods on the same or separate [nodes](/docs/concepts/architecture/nodes/)
without network address translation (NAT)
* pods can communicate with other pods on same or separate nodes using L2 bridging, native L3 (IPv4, IPv6) networking, or a CNI-specific form of tunnel encapsulation. 

[//]: # (Not sure the agent communications is part of the K8s network model)

[//]: # (Need a picture of a host network as it relates to pods. Do we want to include picture and explanation of kernel network stack? Kernel bypass could be described later)

Note: For those platforms that support `Pods` running in the host network (e.g.
Linux), when pods are attached to the host network of a node they can still communicate 
with all pods on all nodes without NAT.

## Architecture

The Kubernetes network model introduces an architecture that allows you to support your cluster networking requirements.

Figure 1 illustrates the general Kubernetes network architecture.

{{< figure src="/docs/images/k8net-Pod-arch-template.drawio.svg" alt="k8s net arch" class="diagram-large" caption="Figure 1. K8s Network Architecture" >}}

The components of the architecture consist of the following:

* Nodes that can be virtual (VM) or physical.
* Pods configured on each node with one or more containers.
* Pods on each node that come with their own IP (v4, v6, dualstack) address and run in their own network namespace.
* Pods use a virtual "link" between the network namespace pod interface and root network namespace.
* L2bridge allows communications between pods on the same node or different nodes.
* CNI plugin supporting different forms of pod networking. Some employ and virtual overlay network in which Pod packets are encapsulated and tunneled between pods on different hosts. Others utilize native network functions. 

Add closing sentence.

### Containers on the same pod

Kubernetes IP addresses exist at the `Pod` scope - containers within a `Pod`
share their network namespaces - including their IP address and MAC address.
Containers within a `Pod` can all reach each other's ports on
`localhost`. 

{{< figure src="/docs/images/k8net-localhost-PodSameHost.drawio.svg" alt="k8s net arch2" class="diagram-large" caption="Figure 2. Container localhost and L2 bridging" >}}

This also means that your containers within a `Pod` must coordinate port
usage, but this is no different from processes in a VM.  This is called the
"IP-per-pod" model.

How this is implemented is a detail of the particular container runtime in use.

It is possible to request ports on the `Node` itself which forward to your `Pod`
(called host ports), but this is a very niche operation. How that forwarding is
implemented is also a detail of the container runtime. The `Pod` itself is
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
