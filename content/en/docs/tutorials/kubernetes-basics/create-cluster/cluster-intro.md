---
title: Using Minikube to Create a Cluster
weight: 10
---

## {{% heading "objectives" %}}

* Learn what a Kubernetes cluster is.
* Learn what Minikube is.
* Start a Kubernetes cluster on your computer.

## Kubernetes Clusters

{{% alert %}}
_Kubernetes is a production-grade, open-source platform that orchestrates
the placement (scheduling) and execution of application containers
within and across computer clusters._
{{% /alert %}}

**Kubernetes coordinates a highly available cluster of computers that are connected
to work as a single unit.** The abstractions in Kubernetes allow you to deploy
containerized applications to a cluster without tying them specifically to individual
machines. To make use of this new model of deployment, applications need to be packaged
in a way that decouples them from individual hosts: they need to be containerized.
Containerized applications are more flexible and available than in past deployment models,
where applications were installed directly onto specific machines as packages deeply
integrated into the host. **Kubernetes automates the distribution and scheduling of
application containers across a cluster in a more efficient way.** Kubernetes is an
open-source platform and is production-ready.

A Kubernetes cluster consists of two types of resources:

* The **Control Plane** coordinates the cluster
* **Nodes** are the workers that run applications

### Cluster Diagram

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**The Control Plane is responsible for managing the cluster.** The Control Plane
coordinates all activities in your cluster, such as scheduling applications, maintaining
applications' desired state, scaling applications, and rolling out new updates.

{{% alert %}}
_Control Planes manage the cluster and the nodes that are used to host the running
applications._
{{% /alert %}}

**A node is a VM or a physical computer that serves as a worker machine in a Kubernetes
cluster.** Each node has a Kubelet, which is an agent for managing the node and
communicating with the Kubernetes control plane. The node should also have tools for
handling container operations, such as {{< glossary_tooltip text="containerd" term_id="containerd" >}}
or {{< glossary_tooltip term_id="cri-o" >}}. A Kubernetes cluster that handles production
traffic should have a minimum of three nodes because if one node goes down, both an
[etcd](/docs/concepts/architecture/#etcd) member and a control plane instance are lost,
and redundancy is compromised. You can mitigate this risk by adding more control plane nodes.

When you deploy applications on Kubernetes, you tell the control plane to start
the application containers. The control plane schedules the containers to run on
the cluster's nodes. **Node-level components, such as the kubelet, communicate
with the control plane using the [Kubernetes API](/docs/concepts/overview/kubernetes-api/)**,
which the control plane exposes. End users can also use the Kubernetes API directly
to interact with the cluster.

A Kubernetes cluster can be deployed on either physical or virtual machines. To
get started with Kubernetes development, you can use Minikube. Minikube is a lightweight
Kubernetes implementation that creates a VM on your local machine and deploys a
simple cluster containing only one node. Minikube is available for Linux, macOS,
and Windows systems. The Minikube CLI provides basic bootstrapping operations for
working with your cluster, including start, stop, status, and delete.

## {{% heading "whatsnext" %}}

* Tutorial [Hello Minikube](/docs/tutorials/hello-minikube/).
* Learn more about [Cluster Architecture](/docs/concepts/architecture/).