---
title: Concepts
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

The Concepts section helps you learn about the parts of the Kubernetes system and the abstractions Kubernetes uses to represent your {{< glossary_tooltip text="cluster" term_id="cluster" length="all" >}}, and helps you obtain a deeper understanding of how Kubernetes works.

{{% /capture %}}

{{% capture body %}}

## Overview

To work with Kubernetes, you use *Kubernetes API objects* to describe your cluster's *desired state*: what applications or other workloads you want to run, what container images they use, the number of replicas, what network and disk resources you want to make available, and more. You set your desired state by creating objects using the Kubernetes API, typically via the command-line interface, `kubectl`. You can also use the Kubernetes API directly to interact with the cluster and set or modify your desired state.

Once you've set your desired state, the Kubernetes {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}} tries to ensure the cluster's current actual state match the desired state you configured. To do so, Kubernetes performs a variety of tasks automatically: starting or restarting containers, scaling the number of replicas of a given application, and more.
Kubernetes achieves this by making use of several elements working together:

* The Kubernetes {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}} is a collection of three processes that manage the behaviour of the cluster. Those processes are: [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/), [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) and [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).
* Each {{< glossary_tooltip text="worker node" term_id="node" >}} in your cluster runs two processes:
  * [kubelet](/docs/reference/command-line-tools-reference/kubelet/), which runs containers as directed by the control plane.
  * [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/), a network proxy which reflects Kubernetes networking services on each node.

## Kubernetes Objects

Kubernetes contains a number of abstractions that represent the state of your system: deployed containerized applications and workloads, their associated network and disk resources, and other information about what your cluster is doing. These abstractions are represented by [objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/) in the Kubernetes API.

The basic Kubernetes objects include:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

In addition, Kubernetes contains a number of higher-level abstractions called Controllers. Controllers build upon the basic objects, and provide additional functionality and convenience features. They include:

* [ReplicaSet](/docs/concepts/workloads/replicaset/)
* [Deployment](/docs/concepts/workloads/deployment/)
* [StatefulSet](/docs/concepts/workloads/statefulset/)
* [DaemonSet](/docs/concepts/workloads/daemonset/)
* [Job](/docs/concepts/workloads/job/)

## Control Plane {#kubernetes-control-plane}

The various parts of the Kubernetes control plane, govern how Kubernetes communicates with your cluster. The control plane maintains a record of all of the Kubernetes objects in the system, and runs continuous control loops to manage those objects' state. At any given time, control loops will respond to changes in the cluster and work to make the actual state of all the objects in the system match the desired state that you provided.

For example, when you use the Kubernetes API to create a Deployment, you provide a new desired state for the system. The control plane records that object creation, and carries out your instructions by starting the required applications and scheduling them to cluster nodes&mdash;thus making the cluster's actual state match the desired state.

The Kubernetes control plane is responsible for maintaining the desired state for your cluster. When you interact with Kubernetes, such as by using the `kubectl` command-line tool, you're communicating with your cluster's Kubernetes control plane. The control plane can be replicated for availability and redundancy.

### Nodes {#kubernetes-nodes}

The nodes in a cluster are the machines (VMs, physical servers, etc) that run your applications and cloud workflows. The Kubernetes control plane directs the behaviour of each node; you'll rarely interact with nodes directly.

#### Object Metadata

* [Annotations](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

* Read an [overview of Kubernetes](/docs/concepts/overview/what-is-kubernetes/)

{{% /capture %}}
