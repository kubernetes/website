---
reviewers:
- erictune
title: Pod Overview
content_template: templates/concept
weight: 10
card: 
  name: concepts
  weight: 60
---

{{% capture overview %}}
This page provides an overview of `Pod`, the smallest deployable object in the Kubernetes object model.
{{% /capture %}}


{{% capture body %}}
## Understanding Pods

A *Pod* is the basic execution unit of a Kubernetes application--the smallest and simplest unit in the Kubernetes object model that you create or deploy. A Pod represents processes running on your {{< glossary_tooltip term_id="cluster" >}}.

A Pod encapsulates an application's container (or, in some cases, multiple containers), storage resources, a unique network IP, and options that govern how the container(s) should run. A Pod represents a unit of deployment: *a single instance of an application in Kubernetes*, which might consist of either a single {{< glossary_tooltip text="container" term_id="container" >}} or a small number of containers that are tightly coupled and that share resources.

[Docker](https://www.docker.com) is the most common container runtime used in a Kubernetes Pod, but Pods support other [container runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/) as well.


Pods in a Kubernetes cluster can be used in two main ways:

* **Pods that run a single container**. The "one-container-per-Pod" model is the most common Kubernetes use case; in this case, you can think of a Pod as a wrapper around a single container, and Kubernetes manages the Pods rather than the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod might encapsulate an application composed of multiple co-located containers that are tightly coupled and need to share resources. These co-located containers might form a single cohesive unit of service--one container serving files from a shared volume to the public, while a separate "sidecar" container refreshes or updates those files. The Pod wraps these containers and storage resources together as a single manageable entity.
The [Kubernetes Blog](http://kubernetes.io/blog) has some additional information on Pod use cases. For more information, see:

  * [The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)
  * [Container Design Patterns](https://kubernetes.io/blog/2016/06/container-design-patterns)

Each Pod is meant to run a single instance of a given application. If you want to scale your application horizontally (e.g., run multiple instances), you should use multiple Pods, one for each instance. In Kubernetes, this is generally referred to as _replication_. Replicated Pods are usually created and managed as a group by an abstraction called a Controller. See [Pods and Controllers](#pods-and-controllers) for more information.

### How Pods manage multiple Containers

Pods are designed to support multiple cooperating processes (as containers) that form a cohesive unit of service. The containers in a Pod are automatically co-located and co-scheduled on the same physical or virtual machine in the cluster. The containers can share resources and dependencies, communicate with one another, and coordinate when and how they are terminated.

Note that grouping multiple co-located and co-managed containers in a single Pod is a relatively advanced use case. You should use this pattern only in specific instances in which your containers are tightly coupled. For example, you might have a container that acts as a web server for files in a shared volume, and a separate "sidecar" container that updates those files from a remote source, as in the following diagram:

{{< figure src="/images/docs/pod.svg" alt="example pod diagram" width="50%" >}}

Some Pods have {{< glossary_tooltip text="init containers" term_id="init-container" >}} as well as {{< glossary_tooltip text="app containers" term_id="app-container" >}}. Init containers run and complete before the app containers are started.

Pods provide two kinds of shared resources for their constituent containers: *networking* and *storage*.

#### Networking

Each Pod is assigned a unique IP address. Every container in a Pod shares the network namespace, including the IP address and network ports. Containers *inside a Pod* can communicate with one another using `localhost`. When containers in a Pod communicate with entities *outside the Pod*, they must coordinate how they use the shared network resources (such as ports).

#### Storage

A Pod can specify a set of shared storage {{< glossary_tooltip text="Volumes" term_id="volume" >}}. All containers in the Pod can access the shared volumes, allowing those containers to share data. Volumes also allow persistent data in a Pod to survive in case one of the containers within needs to be restarted. See [Volumes](/docs/concepts/storage/volumes/) for more information on how Kubernetes implements shared storage in a Pod.

## Working with Pods

You'll rarely create individual Pods directly in Kubernetes--even singleton Pods. This is because Pods are designed as relatively ephemeral, disposable entities. When a Pod gets created (directly by you, or indirectly by a Controller), it is scheduled to run on a {{< glossary_tooltip term_id="node" >}} in your cluster. The Pod remains on that Node until the process is terminated, the pod object is deleted, the Pod is *evicted* for lack of resources, or the Node fails.

{{< note >}}
Restarting a container in a Pod should not be confused with restarting the Pod. The Pod itself does not run, but is an environment the containers run in and persists until it is deleted.
{{< /note >}}

Pods do not, by themselves, self-heal. If a Pod is scheduled to a Node that fails, or if the scheduling operation itself fails, the Pod is deleted; likewise, a Pod won't survive an eviction due to a lack of resources or Node maintenance. Kubernetes uses a higher-level abstraction, called a *Controller*, that handles the work of managing the relatively disposable Pod instances. Thus, while it is possible to use Pod directly, it's far more common in Kubernetes to manage your pods using a Controller. See [Pods and Controllers](#pods-and-controllers) for more information on how Kubernetes uses Controllers to implement Pod scaling and healing.

### Pods and Controllers

A Controller can create and manage multiple Pods for you, handling replication and rollout and providing self-healing capabilities at cluster scope. For example, if a Node fails, the Controller might automatically replace the Pod by scheduling an identical replacement on a different Node.

Some examples of Controllers that contain one or more pods include:

* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)

In general, Controllers use a Pod Template that you provide to create the Pods for which it is responsible.

## Pod Templates

Pod templates are pod specifications which are included in other objects, such as
[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).  Controllers use Pod Templates to make actual pods.
The sample below is a simple manifest for a Pod which contains a container that prints
a message.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```

Rather than specifying the current desired state of all replicas, pod templates are like cookie cutters. Once a cookie has been cut, the cookie has no relationship to the cutter. There is no "quantum entanglement". Subsequent changes to the template or even switching to a new template has no direct effect on the pods already created. Similarly, pods created by a replication controller may subsequently be updated directly. This is in deliberate contrast to pods, which do specify the current desired state of all containers belonging to the pod. This approach radically simplifies system semantics and increases the flexibility of the primitive.

{{% /capture %}}

{{% capture whatsnext %}}
* Learn more about [Pods](/docs/concepts/workloads/pods/pod/)
* Learn more about Pod behavior:
  * [Pod Termination](/docs/concepts/workloads/pods/pod/#termination-of-pods)
  * [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/)
{{% /capture %}}
