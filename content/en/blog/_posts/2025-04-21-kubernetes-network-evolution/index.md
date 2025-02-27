---
layout: blog
title: "The Evolution of Networking in Kubernetes: Declarative Networking"
date: 2025-04-21
draft: false
slug: kubernetes-network-evolution
author: Antonio Ojea (Google)
---

Kubernetes is in continuous evolution, and as a distributed system, networking
is an inseparable aspect, needing to evolve to support the platform's ongoing
development. What began with a relatively simple, flat network model has
progressively evolved to accommodate increasingly complex and demanding
workloads. Understanding this journey, from the foundational choice of the
Container Network Interface (CNI) over Docker's Container Network Model (CNM) to
the latest advancements in Dynamic Resource Allocation (DRA) and Declarative
Networking, is important for anyone operating within the Kubernetes ecosystem.
This post illustrates this path, diving into the key decisions and events that
have shaped Kubernetes networking, providing insights into the rationale behind
the current state and the direction of future development.

## The Genesis: Choosing CNI Over CNM

In the early days of Kubernetes, the question of how to manage container
networks was a significant one. Two primary models emerged: the Container
Network Interface (CNI) and Docker's Container Network Model (CNM). Ultimately,
the Kubernetes community opted for CNI, a decision rooted in fundamental
architectural and practical considerations, as explained in Tim Hockin’s blog
[Why Kubernetes Doesn't use
libnetwork](https://blog.kubernetes.io/2016/01/why-kubernetes-doesnt-use-libnetwork/).

The core principle behind CNI was to provide a flexible and focused interface
for network plugins. The emphasis was on a standardized mechanism that allowed
various network providers to integrate seamlessly with Kubernetes by
implementing a simple set of executables. Early discussions in 2015 within the
[`kubernetes-sig-network` mailing
list](https://groups.google.com/g/kubernetes-sig-network/c/5MWRPxsURUw) reveal a
strong desire for stable base plugins that could be extended to meet diverse
networking needs. The pluggable design of CNI allowed for the integration of
various network plugins, supporting different network topologies and
requirements within Kubernetes.

## The Road to Declarative Networking: Key Milestones

With CNI established as the foundation, the Kubernetes community began to work
on more advanced networking requirements, particularly the need for a more
declarative networking support. This journey was marked by several key
initiatives and discussions:

### The Network Plumbing Working Group (NPWG)

The Network Plumbing Working Group (NPWG) was formed at Kubecon NA '17 in Austin
to initially work towards implementing a common standard addressing how one
might attach multiple networks to pods in Kubernetes. The work of the NPWG has
culminated in a [standard Multi-Network Custom Resource Definition
(CRD)](https://github.com/k8snetworkplumbingwg/multi-net-spec). The [Multus
CNI](https://github.com/k8snetworkplumbingwg/multus-cni) is the reference
implementation of this multi-network definition, demonstrating how pods can have
multiple network interfaces, although it uses in an imparative model that limits
leveraging some Kubernetes properties.

### KEP-3698 (Multi-Network): Reviving the Discussion

The first significant step towards directly addressing multi-network
requirements within the core Kubernetes project was the introduction of
[KEP-3698
(Multi-Network)](https://github.com/kubernetes/enhancements/pull/3700). This
Kubernetes Enhancement Proposal aimed to define user stories and requirements
for multi-network functionality in Kubernetes. However, early feedback indicated
that the KEP was perceived as too abstract and broad, attempting to encompass a
wide range of use cases, from simply attaching multiple interfaces to more
complex network virtualization scenarios.

A core goal of KEP-3698 was to introduce an API object to Kubernetes describing
networks that Pods can attach to and to evolve the current Kubernetes networking
model to support multiple networks in a backward-compatible way. The initial
focus was on defining what users wanted to achieve with multi-networking, such
as connecting Pods to each other in a manner defined by the network object, and
exposing basic network interface information for each attachment.

Discussions around the KEP revealed challenges related to integrating
multi-networking in existing Kubernetes architecture. For instance, there were
questions about how network probes would function on non-default networks,
problem that will be tackled in a separate KEP
[https://github.com/kubernetes/enhancements/pull/4558](https://github.com/kubernetes/enhancements/pull/4558),
and the implications for other core functionalities like DNS and network
policies in a multi-network environment. KEP-3698 did an important work on
clarifying the end user multi-networking requirements. This lack of defined
semantics and standard implementations, coupled with the anticipated need to
rewrite existing Kubernetes components, ultimately led the community to explore
more feasible alternative approaches.
 
### KNI (Kubernetes Networking Interface) KEP: A Reimagined Approach to CNI

As discussions around the limitations of the existing CNI interface for
supporting advanced workloads continued, the [KNI (Kubernetes Networking
Interface) KEP (KEP-4477)](https://github.com/kubernetes/enhancements/pull/4477)
emerged. KNI proposed a more radical reimagining of Kubernetes networking,
aiming to reduce the number of layers involved by introducing a gRPC API. The
goal was to consolidate networking into a single layer, potentially simplifying
troubleshooting and development.

However, the KNI proposal also started an intense debate. Concerns were raised
about the necessity of introducing an entirely new API and RPC service in a core
component like the Kubelet, instead of improving the existing CNI and CRI
(Container Runtime Interface). The potential for significant technical debt and
disruption was also a major consideration. Ultimately, the [KNI KEP was
closed](https://github.com/kubernetes/enhancements/pull/4477#event-11626847588),
signaling a shift in focus towards more incremental and integrated solutions.

### Contributor Summit Paris (KubeCon 2024): Towards Modular Network Drivers

To address the continuing challenges and ensure a clearer path forward, SIG
Network Tech Leads proposed a more modular development model called Kubernetes
Network Drivers. This proposal was presented at the [Future of k8s
networking](https://kcseu2024.sched.com/event/1aOqO/future-of-k8s-networking?iframe=no&w=100%&sidebar=yes&bg=no)
session during the Contributor Summit in Paris at KubeCon 2024, and it
incorporated feedback from earlier discussions.

{{< figure src="kubernetes_network_driver.png" alt="kubernetes network drivers"
>}}

This approach aimed to break down the complex problem of Kubernetes networking
into smaller, more manageable components for integration, suggesting a move away
from monolithic solutions towards a more composable architecture. This
initiative seeks to provide a clearer framework for developing and integrating
advanced networking functionalities into Kubernetes.

### DRA, NRI, and Runtime Specification Changes: Foundational Building Blocks

A significant advancement in supporting more complex and declarative networking
was the integration of Dynamic Resource Allocation (DRA). Building upon DRA's
ongoing work to abstract hardware in core Kubernetes components, the Kubernetes
Network Driver model offered a streamlined path forward. By moving the
ResourceClaim to the pod level, network interfaces could be treated as
first-class resources, simplifying the user experience to a basic request of
"give me a network."

To facilitate the integration of network resources with DRA, the Node Resource
Interface (NRI), which has roots in the CNI model but evolved towards a gRPC
service model, was enhanced to support network development functions
([https://github.com/containerd/nri/pull/119](https://github.com/containerd/nri/pull/119)).
Furthermore, a significant advancement occurred at the OCI runtime level. A
proposal to offload the Network Interfaces plumbing to the runtime (`runc`) was
approved
([https://github.com/opencontainers/runtime-spec/pull/1271](https://github.com/opencontainers/runtime-spec/pull/1271))
during Kubecon London 2025. This change, driven by observed inefficiencies and
complexities in managing network interfaces using CNI plugins for simple network
interfaces operations, allows the OCI runtime specification to natively support
the declarative attachment of network interfaces to containers. This shift will
simplify integrations and improve efficiency, particularly for workloads heavily
reliant on network interfaces like AI/ML.

## Today's Landscape: DRA in Action and the Declarative Network Vision

Today, the Kubernetes networking landscape is characterized by building upon
these foundational advancements. DRA is now being used to expose network
resources at the node level that can be referenced by Pods. The introduction of
the [IPAddress object](https://github.com/kubernetes/enhancements/issues/1880)
as Generally Available (GA) in Kubernetes 1.33 provides a standardized way to
represent IP addresses in a Kubernetes cluster. Furthermore, [KEP-4817: DRA
Resource Claim Status with standardized network interface
data](https://github.com/kubernetes/enhancements/issues/4817), which is reaching
Beta in Kubernetes 1.34, will standardize the output of additional network
interfaces within the ResourceClaim Status, to allow the interoperability of
different networking solutions utilizing DRA.

The [Gateway API](https://gateway-api.sigs.k8s.io/) is exploring the definition
of [ClusterIP
Services](https://github.com/kubernetes-sigs/gateway-api/pull/3608) to enable
advanced traffic management across multiple network domains. This evolution
towards higher-level abstractions, following an user-centric approach, focusing
on intent rather than low-level details, making declarative networking possible.

Concrete implementations are emerging that leverage DRA for network management.
Projects like
[`kubernetes-sigs/cni-dra-driver`](https://github.com/kubernetes-sigs/cni-dra-driver)
and [`google/dranet`](https://github.com/google/dranet) demonstrate how DRA can
be utilized to manage network attachments and provide declarative networking
capabilities, illustrating the practical application of these evolving APIs.

## Conclusion: A Journey of Adaptation and Innovation

In summary, Kubernetes networking is evolving to meet the growing demands of
modern applications and to directly address users and developers feedback. The
future points towards declarative networking achieved through composable network
drivers, a departure from monolithic designs that will simplify upgrades and
foster greater compatibility, ultimately enabling more complex and demanding
workloads to thrive.

## Get involved with SIG Network

The current SIG-Network [KEPs](https://github.com/orgs/kubernetes/projects/10)
and
[issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork)
on GitHub illustrate the SIG’s areas of work.

[SIG Network
meetings](https://github.com/kubernetes/community/tree/master/sig-network) are a
friendly, welcoming venue for you to connect with the community and share your
ideas. Looking forward to hearing from you!
