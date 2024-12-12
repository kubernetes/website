---
title: "Services, Load Balancing, and Networking"
weight: 60
description: >
  Concepts and resources behind networking in Kubernetes.
---

The [Kubernetes network model](#kubernetes-network-model) enables container networking within
a {{< glossary_tooltip text="pod" term_id="pod" >}} and between pods on the same or different
{{< glossary_tooltip text="nodes" term_id="node" >}}.

Kubernetes networking addresses four concerns:

- Containers within a Pod can [communicate](/docs/concepts/services-networking/dns-pod-service/) via loopback.
- All Pods within a cluster can address (as in, find the IP address) of another
  Pod, without address translation. Providing that security policies allow it,
  any two Pods can communicate directly.
- The [Service](/docs/concepts/services-networking/service/) API lets you
  [expose an application running in Pods](/docs/tutorials/services/connect-applications-service/)
  to be reachable from outside your cluster.
  - [Ingress](/docs/concepts/services-networking/ingress/) provides extra functionality
    specifically for exposing HTTP applications, websites and APIs.
  - [Gateway API](/docs/concepts/services-networking/gateway/) is an {{<glossary_tooltip text="add-on" term_id="addons">}}
    that provides an expressive, extensible, and role-oriented family of API kinds for modeling service networking.
  - [Ingress](/docs/concepts/services-networking/ingress/) and [Gateway](https://gateway-api.sigs.k8s.io/) provide
    extra functionality specifically for exposing your applications, websites and APIs, usually to clients outside
    the cluster.
  You can also use Services to
  [publish services only for consumption inside your cluster](/docs/concepts/services-networking/service-traffic-policy/).

The [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial lets you learn
about Services and Kubernetes networking with a hands-on example.

Read on to learn more about the [Kubernetes network model](#kubernetes-network-model).

## The Kubernetes network model {#kubernetes-network-model}

Figure 1 depicts a cluster with a control plane, a small number of nodes (VM or physical) attached to a network, each
with pods containing one more containers. In addition, each pod has its own IP address called a _pod IP_.

{{< figure src="/docs/images/k8s-net-model-arch.svg" alt="Diagram of Kubernetes networking" class="diagram-large" caption="Figure 1. High-level example of a Kubernetes cluster, illustrating container networking." >}}

The other K8s network components shown in figure consist of the following:

* _Local pod networking_ - optional component that enables pod-to-pod communications in the same node. You might recognize
this as a virtual layer 2 bridge (which is just one possible implementation).

* [_Network plugins_](#network-plugins) - sets up IP addressing for pods and their containers, and allow pods to communicate
even when the source pod and destination pod are running on different nodes. Different network plugins achieve this in
different ways with examples including tunneling or IP routing.

Processes with a pod, such as the processes within Pod 1, can communicate automatically. Kubernetes
and the container runtime provide no special support as these processes all see a common local
network within the container sandbox.

You can also have connectivity between containers running on two or more different pods on the same node; for example
Pod 7 communicating with Pod 1, with both Pods (and their containers) running on Node 1. The network plugin(s)
that you deploy are responsible for the routes or other means to make sure that
these packets arrive at the right destination.

In the cross-node case, you have container communications between pods on nodes connected
via the cluster network. In the example above, Pod 7 on Node 1 can talk to Pod 21 on Node 2.

{{< note >}}
The network model permits all pods to talk to all other pods on the cluster. However, you might implement policies in your cluster to limit what pods can talk to other pods.
{{< /note >}}

The network model describes how pods and their associated pod IPs can integrate with the larger network to support
container networking.

[comment]: <> (All diagrams.net figures are available at: https://drive.google.com/drive/folders/1MPOeuJ3wTzptutZX_6GKpLK8ljnojKE8?usp=sharing)

[comment]: <> (good talk on K8 network models at https://www.cncf.io/wp-content/uploads/2020/08/CNCF_Webinar_-Kubernetes_network_models.pdf)

Kubernetes IP addresses exist at the Pod scope. For example, on Linux, containers
within a Pod share their network namespaces - including their IP address, and any
network address from a lower layer, such as a MAC address.
This means that containers within a Pod can all reach each other's ports on
`localhost`. This also means that containers within a Pod must coordinate port
usage (the same way that different processes on a physical server need to coordinate
port use. This model, as used in Kubernetes, is called the _IP-per-pod_ model.

How this is implemented is a detail of the particular container runtime in use.

It is possible to request and configure ports on the node itself (named _host ports_),
that forward to a port on your Pod.
The Pod itself is not aware of the existence or non-existence of host ports.

## Networking integrations and customizations

Only a few parts of this model are implemented by Kubernetes itself.
For the other parts, Kubernetes defines the APIs, but the
corresponding functionality is provided by external components, some
of which are optional:

* The pod network itself is managed by a
  [pod network implementation](/docs/concepts/cluster-administration/addons/#networking-and-network-policy).
  On Linux, most container runtimes use the
  {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}}
  to interact with the pod network implementation, so these
  implementations are often called _CNI plugins_.

* Kubernetes provides a default implementation of service proxying,
  called {{< glossary_tooltip term_id="kube-proxy">}}, but some pod
  network implementations instead use their own service proxy that
  is more tightly integrated with the rest of the implementation.

* Network policy (and the optional NetworkPolicy API) is commonly also implemented
  by the pod network implementation.
  (Some simpler pod network implementations don't implement NetworkPolicy, or an
  administrator may choose to configure the pod network without NetworkPolicy support. In these
  cases, the NetworkPolicy API will still be present in your cluster, but it will have no effect.)

* (On Linux), Pod network namespace setup is handled by system-level software implementing the
  [Container Runtime Interface](/docs/concepts/architecture/cri/)

* There are many [implementations of the Gateway API](https://gateway-api.sigs.k8s.io/implementations/),
  some of which are specific to particular cloud environments, some more
  focused on "bare metal" environments, and others more generic.

* The old [Ingress](/docs/concepts/services-networking/ingress/) API also has many
  implementations, including many third party integrations.

## Network plugins

[Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) set up IP
addressing for Pods and their containers, and allow pods to communicate even when the source Pod and
destination Pod are running on different nodes. Different network plugins achieve this in different ways
with examples including tunneling or IP routing.

{{< note >}}
Network plugins are also known as _CNI_ or _CNI plugins_.
{{< /note >}}

### Requirements {#networking-requirements}

Every [Pod](/docs/concepts/workloads/pods/) in your cluster gets its own unique cluster-wide IP address called a _pod IP_.

If you have deployed an [IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack/) cluster,
then you - or your network plugin(s) - must allocate pod IPs for IPv4 and IPv6 for each pod. This is
performed per [_address family_](https://www.iana.org/assignments/address-family-numbers/address-family-numbers.xhtml),
with one for IPv4 addresses and one for IPv6 addresses.

Kubernetes imposes the following requirements on any networking implementation (barring any intentional network
segmentation policies):

* Containers in the same pod can communicate with each other.
* Pods can communicate with all other Pods on the same or separate [nodes](/docs/concepts/architecture/nodes/)
  without network address translation (NAT).
* Agents on a node (e.g. system daemons, kubelet) can communicate with all pods on that node.

## Host network

Kubernetes also supports pods running in the host network. Pods attached to the host network of a node can still
communicate with all pods on all nodes; again, without NAT.
Pods running in the host network do not require a working network plugin. For example, many network plugin
implementations operate as Pods, and the Pods that run the plugin are in host network mode so that they can start
before the cluster network is ready.

Traffic between nodes might go via the host network (potentially using _encapsulation_); different cluster network
designs make different choices here.

The kubelet needs to establish bidirectional communication with the API server (within the control plane),
so there must be an IP address in the host network for the kubelet to use.

## {{% heading "whatsnext" %}}

### Network plugins {#whats-next-network-plugins}


* CNI [Specification](https://www.cni.dev/docs/spec/)

* CNI [Documentation](https://www.cni.dev/docs/)

* [Reference plugins](https://www.cni.dev/plugins/current/#reference-plugins)

* [Introduction to CNI](https://youtu.be/YjjrQiJOyME) (video)

* [CNI deep dive](https://youtu.be/zChkx-AB5Xc) (video)

### Cluster networking

For an administrative perspective on networking for your cluster, read
[Cluster Networking](/docs/concepts/cluster-administration/networking/).

