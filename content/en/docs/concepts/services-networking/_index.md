---
title: "Services, Load Balancing, and Networking"
weight: 60
description: >
  Concepts and resources behind networking in Kubernetes.
---

## The Kubernetes network model

Every [`Pod`](/docs/concepts/workloads/pods/) in a cluster gets its own unique cluster-wide IP address
(one address per IP address family). 
This means you do not need to explicitly create links between `Pods` and you 
almost never need to deal with mapping container ports to host ports.  
This creates a clean, backwards-compatible model where `Pods` can be treated 
much like VMs or physical hosts from the perspectives of port allocation, 
naming, service discovery, [load balancing](/docs/concepts/services-networking/ingress/#load-balancing), 
application configuration, and migration.

Kubernetes imposes the following fundamental requirements on any networking
implementation (barring any intentional network segmentation policies):

   * pods can communicate with all other pods on any other [node](/docs/concepts/architecture/nodes/) 
     without NAT
   * agents on a node (e.g. system daemons, kubelet) can communicate with all
     pods on that node

{{< note >}}
For those platforms that support `Pods` running in the host network (such as Linux), when pods are attached to the host network of a node they can still communicate with all pods on all nodes without NAT.
{{< /note >}}

This model is not only less complex overall, but it is principally compatible
with the desire for Kubernetes to enable low-friction porting of apps from VMs
to containers.  If your job previously ran in a VM, your VM had an IP and could
talk to other VMs in your project.  This is the same basic model.

Kubernetes IP addresses exist at the `Pod` scope - containers within a `Pod`
share their network namespaces - including their IP address and MAC address.
This means that containers within a `Pod` can all reach each other's ports on
`localhost`. This also means that containers within a `Pod` must coordinate port
usage, but this is no different from processes in a VM.  This is called the
"IP-per-pod" model.

How this is implemented is a detail of the particular container runtime in use.

It is possible to request ports on the `Node` itself which forward to your `Pod`
(called host ports), but this is a very niche operation. How that forwarding is
implemented is also a detail of the container runtime. The `Pod` itself is
blind to the existence or non-existence of host ports.

Kubernetes networking addresses four concerns:
- Containers within a Pod [use networking to communicate](/docs/concepts/services-networking/dns-pod-service/) via loopback.
- Cluster networking provides communication between different Pods.
- The [Service](/docs/concepts/services-networking/service/) API lets you
  [expose an application running in Pods](/docs/tutorials/services/connect-applications-service/)
  to be reachable from outside your cluster.
  - [Ingress](/docs/concepts/services-networking/ingress/) provides extra functionality
    specifically for exposing HTTP applications, websites and APIs.
  - [Gateway API](/docs/concepts/services-networking/gateway/) is an {{<glossary_tooltip text="add-on" term_id="addons">}}
    that provides an expressive, extensible, and role-oriented family of API kinds for modeling service networking.
- You can also use Services to
  [publish services only for consumption inside your cluster](/docs/concepts/services-networking/service-traffic-policy/).

The [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial lets you learn about Services and Kubernetes networking with a hands-on example.

[Cluster Networking](/docs/concepts/cluster-administration/networking/) explains how to set
up networking for your cluster, and also provides an overview of the technologies involved.
