---
---

{% capture overview %}
This page provides an overview of `Pod`, the smallest deployable object in the Kubernetes object model.
{% endcapture %}

* TOC
{:toc}

{% capture body %}
### Understanding Pods

A *Pod* is the basic building block of Kubernetes--the smallest and simplest unit in the Kubernetes object model that you create or deploy. A Pod represents a running process on your cluster.

A Pod encapsulates an application container (or, in some cases, multiple containers), storage resources, and options that govern how the container(s) should run. A Pod represents a unit of deployment: *a single workload in Kubernetes*, which might consist of either a single application or a small number of applications that are tightly coupled and that share resources.

> [Docker](https://www.docker.com) is the most common container runtime used in a Kubernetes Pod, but Pods support other container runtimes as well.

Pods are employed a number of ways in a Kubernetes cluster, including:

* **Pods that run a single application container**. The "one-application per Pod" model is the most common Kubernetes use case; in this case, you can think of a Pod as a wrapper around a single application, and Kubernetes manages the Pods rather than the containers directly.
* **Pods that run multiple application containers that need to work together**. Pods can support multiple application containers that are tightly coupled and need to share resources. You can think of these applications as forming a *single cohesive unit of service*. The Pod wraps them together with shared resources as a single managable entity.

Pods typically *do not* model multiple instances of the same application container. Instead, you can have Kubernetes maintain separate Pods for each instance you want to run, usually managed by a Controller. See [Pods and Controllers](#pods-and-controllers) for more information.

#### How Pods Manage Containers

Pods are designed to support multiple cooperating processes (as application containers) that form a cohesive unit of service. The containers in a Pod are automatically co-located and co-scheduled on the same phyiscal or virtual machine in the cluster. The containers can share resources and dependencies, communicate with one another, and coordinate when and how they are terminated.

Pods provide two kinds of shared resources for their constituent containers: *networking* and *storage*.

##### Networking

Each Pod is assigned a unique IP address. Every the container in a pod shares the network namespace, including the IP address and network ports. Containers *inside a Pod* can communicate with one another using `localhost`. When containers in a Pod communicate with entities *outside the Pod*, they must coordinate how they use the shared network resources (such as ports).

##### Storage

A Pod can specify a set of shared storage *volumes*. All containers in the pod can access the shared volumes, allowing those containers to share data. Volumes also allow persistent data in a pod to survive in case one of the containers within needs to be restarted. See [Volumes]() for more information on how Kubernetes implements shared storage in a Pod.

### Working with Pods

When a Pod gets created (directly or indirectly), it is scheduled to run on a [node]() in your cluster, and remains on that node until terminated or deleted. Should a node in the cluster fail, the Pods scheduled on that node are deleted after a timeout period. See [Termination](#pod-termination) for more details on how Pods terminate in Kubernetes.

You'll rarely create or interact directly with individual Pods in Kubernetes--even singleton Pods. This is because Pods are designed as relatively ephemeral entities (as opposed to a durable one). A Pod won't survive a scheduling failure, a node failure, or an eviction due to a lack of resources or node maintenance. Thus, while it is possible to use Pod directly, it's far more common in Kubernetes to manage your pods using a higher-level abstraction called a *Controller*. 

#### <a name="pods-and-controllers"></a> Pods and Controllers

A Controller can create and manage multiple Pods for you, handling replication and rollout and providing self-healing capabilities at cluster scope (for example, if a node fails, a Controller might schedule an identical replacement Pod on a different node). 

Some examples of Controllers that contain one or more pods include:

* [Deployment]()
* [StatefulSet]()
* [DaemonSet]()

In general, Controllers use a [Pod Template]() that you provide to create the Pods for which it is responsible.

#### <a name="pod-termination"></a> Pod Termination

Since Pods represent processes running on your cluster, Kubernetes provides for *graceful termination* when Pods are no longer needed. Kubernetes implements graceful termination by applying a default *grace period* of 30 seconds from the time that you issue a termination request. After the grace period expires, Kubernetes issues a `KILL` signal to the relevant processes and the Pod is deleted from the Kubernetes Master.

> **Note:** The grace period is configurable; you can set your own grace period when interacting with the cluster to request termination, such as using the `kubectl delete` command. See the [Terminating a Pod]() tutorial for more information.

{% endcapture %}


{% if whatsnext %}

### What's next

{{ whatsnext }}

{% endif %}