---
reviewers:
- thockin
title: Cluster Networking
content_type: concept
weight: 50
---

<!-- overview -->
Networking is a central part of Kubernetes, but it can be challenging to
understand exactly how it is expected to work.  There are 4 distinct networking
problems to address:

1. Highly-coupled container-to-container communications: this is solved by
   {{< glossary_tooltip text="Pods" term_id="pod" >}} and `localhost` communications.
2. Pod-to-Pod communications: this is the primary focus of this document.
3. Pod-to-Service communications: this is covered by [Services](/docs/concepts/services-networking/service/).
4. External-to-Service communications: this is also covered by Services.

<!-- body -->

Kubernetes is all about sharing machines between applications.  Typically,
sharing machines requires ensuring that two applications do not try to use the
same ports.  Coordinating ports across multiple developers is very difficult to
do at scale and exposes users to cluster-level issues outside of their control.

Dynamic port allocation brings a lot of complications to the system - every
application has to take ports as flags, the API servers have to know how to
insert dynamic port numbers into configuration blocks, services have to know
how to find each other, etc.  Rather than deal with this, Kubernetes takes a
different approach.

To learn about the Kubernetes networking model, see [here](/docs/concepts/services-networking/).

## How to implement the Kubernetes network model

The network model is implemented by the container runtime on each node. The most common container runtimes use [Container Network Interface](https://github.com/containernetworking/cni) (CNI) plugins to manage their network and security capabilities. Many different CNI plugins exist from many different vendors. Some of these provide only basic features of adding and removing network interfaces, while others provide more sophisticated solutions, such as integration with other container orchestration systems, running multiple CNI plugins, advanced IPAM features etc.

See [this page](/docs/concepts/cluster-administration/addons/#networking-and-network-policy) for a non-exhaustive list of networking addons supported by Kubernetes.

## {{% heading "whatsnext" %}}

The early design of the networking model and its rationale, and some future
plans are described in more detail in the
[networking design document](https://git.k8s.io/design-proposals-archive/network/networking.md).
