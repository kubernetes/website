---
title: Concepts
---

The Concepts section helps you learn about the parts of the Kubernetes system and the abstractions Kubernetes uses to represent your cluster, and helps you obtain a deeper understanding of how Kubernetes works.

## Overview

To work with Kubernetes, you use *Kubernetes API objects* to describe your cluster's *desired state*: what applications or other workloads you want to run, what container images they use, the number of replicas, what network and disk resources you want to make available, and more. You set your desired state by creating objects using the Kubernetes API, typically via the command-line interface, `kubectl`. You can also use the Kubernetes API directly to interact with the cluster and set or modify your desired state.

Once you've set your desired state, the *Kubernetes Control Plane* works to make the cluster's current state match the desired state. To do so, Kuberentes performs a variety of tasks automatically--such as starting or restarting containers, scaling the number of replicas of a given application, and more. The Kubernetes Control Plane consists of a collection processes running on your cluster: 

* The **Kubernetes Master** is a collection of four processes that run on a single node in your cluster, which is designated as the master node.
* Each individual non-master node in your cluster runs two processes:
  * **kubelet**, which communicates with the Kubernetes Master.
  * **kube-proxy**, a network proxy which reflects Kubernetes networking services on each node.

## Kubernetes Objects

Kubernetes contains a number of abstractions that represent your the state of your system: deployed containerized applications and workloads, their associated network and disk resources, and other information about what your cluster is doing. These abstractions are represented by objects in the Kubernetes API; see the [Kubernetes Objects overview](/docs/concepts/abstractions/overview/) for more details. 

The basic Kubernetes objects include:

* [Pod](/docs/concepts/abstractions/pod/)
* Service
* Volume
* Namespace

In addition, Kubernetes contains a number of higher-level abstractions that build upon the basic objects, and provide additional functionality and convenience features. They include:

* ReplicaSet
* Deployment
* StatefulSet
* DaemonSet
* Job

## Kubernetes Control Plane

The various parts of the Kubernetes Control Plane, such as the Kubernetes Master and kubelet processes, govern how Kubernetes communicates with your cluster. The Control Plane maintains a record of all of the Kubernetes Objects in the system, and runs continuous control loops to manage those objects' state. At any given time, the Control Plane's control loops will attempt to match the actual state of all the objects in the system to the desired state that you provided when you created those objects.

For example, When you use the Kubernetes API to create a Deployment object, for example, you provide a new desired state for the system. The Kubernetes Control Plane records that object creation, and carries out your instructions by starting the required applications and scheduling them to cluster nodes--thus making the cluster's actual state match the desired state.

### Kubernetes Master

The Kubernetes master is responsible for maintaining the desired state for your cluster. The Kubernetes master(s) runs the following processes:

* API Server
* Scheduler
* Etcd
* Controller Manager

### Kubernetes Nodes

The nodes in a cluster are the machines (VMs, physical servers, etc) that run your applications and cloud workflows. These nodes are controlled by the Kubernetes master. The following processes run on each node in a Kubernetes cluster:

* Kubelet
* Docker-daemon
* kube-proxy

#### Object Metadata


* [Annotations](/docs/concepts/object-metadata/annotations/)

#### Controllers
* [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)


### What's next

If you would like to write a concept page, see
[Using Page Templates](/docs/contribute/page-templates/)
for information about the concept page type and the concept template.
