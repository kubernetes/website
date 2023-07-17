---
reviewers:
- erictune
title: Pods
content_type: concept
weight: 10
no_list: true
card:
  name: concepts
  weight: 60
---

<!-- overview -->

_Pods_ are the smallest deployable units of computing that you can create and manage in Kubernetes.

A _Pod_ (as in a pod of whales or pea pod) is a group of one or more
{{< glossary_tooltip text="containers" term_id="container" >}}, with shared storage and network resources, and a specification for how to run the containers. A Pod's contents are always co-located and
co-scheduled, and run in a shared context. A Pod models an
application-specific "logical host": it contains one or more application
containers which are relatively tightly coupled.
In non-cloud contexts, applications executed on the same physical or virtual machine are analogous to cloud applications executed on the same logical host.

As well as application containers, a Pod can contain
[init containers](/docs/concepts/workloads/pods/init-containers/) that run
during Pod startup. You can also inject
[ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/)
for debugging if your cluster offers this.

<!-- body -->

## What is a Pod?

{{< note >}}
You need to install a [container runtime](/docs/setup/production-environment/container-runtimes/)
into each node in the cluster so that Pods can run there.
{{< /note >}}

The shared context of a Pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a {{< glossary_tooltip text="container" term_id="container" >}}. Within a Pod's context, the individual applications may have
further sub-isolations applied.

A Pod is similar to a set of containers with shared namespaces and shared filesystem volumes.

## Using Pods

The following is an example of a Pod which consists of a container running the image `nginx:1.14.2`.

{{< codenew file="pods/simple-pod.yaml" >}}

To create the Pod shown above, run the following command:
```shell
kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml
```

Pods are generally not created directly and are created using workload resources.
See [Working with Pods](#working-with-pods) for more information on how Pods are used
with workload resources.

### Workload resources for managing pods

Usually you don't need to create Pods directly, even singleton Pods. Instead, create them using workload resources such as {{< glossary_tooltip text="Deployment"
term_id="deployment" >}} or {{< glossary_tooltip text="Job" term_id="job" >}}.
If your Pods need to track state, consider the
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} resource.

Pods in a Kubernetes cluster are used in two main ways:

* **Pods that run a single container**. The "one-container-per-Pod" model is the
  most common Kubernetes use case; in this case, you can think of a Pod as a
  wrapper around a single container; Kubernetes manages Pods rather than managing
  the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod can
  encapsulate an application composed of multiple co-located containers that are
  tightly coupled and need to share resources. These co-located containers
  form a single cohesive unit of service—for example, one container serving data
  stored in a shared volume to the public, while a separate _sidecar_ container
  refreshes or updates those files.
  The Pod wraps these containers, storage resources, and an ephemeral network
  identity together as a single unit.

  {{< note >}}
  Grouping multiple co-located and co-managed containers in a single Pod is a
  relatively advanced use case. You should use this pattern only in specific
  instances in which your containers are tightly coupled.
  {{< /note >}}

Each Pod is meant to run a single instance of a given application. If you want to
scale your application horizontally (to provide more overall resources by running
more instances), you should use multiple Pods, one for each instance. In
Kubernetes, this is typically referred to as _replication_.
Replicated Pods are usually created and managed as a group by a workload resource
and its {{< glossary_tooltip text="controller" term_id="controller" >}}.

See [Pods and controllers](#pods-and-controllers) for more information on how
Kubernetes uses workload resources, and their controllers, to implement application
scaling and auto-healing.

### How Pods manage multiple containers

Pods are designed to support multiple cooperating processes (as containers) that form
a cohesive unit of service. The containers in a Pod are automatically co-located and
co-scheduled on the same physical or virtual machine in the cluster. The containers
can share resources and dependencies, communicate with one another, and coordinate
when and how they are terminated.

For example, you might have a container that
acts as a web server for files in a shared volume, and a separate "sidecar" container
that updates those files from a remote source, as in the following diagram:

{{< figure src="/images/docs/pod.svg" alt="Pod creation diagram" class="diagram-medium" >}}

Some Pods have {{< glossary_tooltip text="init containers" term_id="init-container" >}} as well as {{< glossary_tooltip text="app containers" term_id="app-container" >}}. Init containers run and complete before the app containers are started.

Pods natively provide two kinds of shared resources for their constituent containers:
[networking](#pod-networking) and [storage](#pod-storage).

## Working with Pods

You'll rarely create individual Pods directly in Kubernetes—even singleton Pods. This
is because Pods are designed as relatively ephemeral, disposable entities. When
a Pod gets created (directly by you, or indirectly by a
{{< glossary_tooltip text="controller" term_id="controller" >}}), the new Pod is
scheduled to run on a {{< glossary_tooltip term_id="node" >}} in your cluster.
The Pod remains on that node until the Pod finishes execution, the Pod object is deleted,
the Pod is *evicted* for lack of resources, or the node fails.

{{< note >}}
Restarting a container in a Pod should not be confused with restarting a Pod. A Pod
is not a process, but an environment for running container(s). A Pod persists until
it is deleted.
{{< /note >}}

The name of a Pod must be a valid
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
value, but this can produce unexpected results for the Pod hostname.  For best compatibility,
the name should follow the more restrictive rules for a
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).

### Pod OS

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

You should set the `.spec.os.name` field to either `windows` or `linux` to indicate the OS on
which you want the pod to run. These two are the only operating systems supported for now by 
Kubernetes. In future, this list may be expanded.

In Kubernetes v{{< skew currentVersion >}}, the value you set for this field has no
effect on {{< glossary_tooltip text="scheduling" term_id="kube-scheduler" >}} of the pods.
Setting the `.spec.os.name` helps to identify the pod OS
authoritatively and is used for validation. The kubelet refuses to run a Pod where you have
specified a Pod OS, if this isn't the same as the operating system for the node where
that kubelet is running.
The [Pod security standards](/docs/concepts/security/pod-security-standards/) also use this
field to avoid enforcing policies that aren't relevant to that operating system.

### Pods and controllers

You can use workload resources to create and manage multiple Pods for you. A controller
for the resource handles replication and rollout and automatic healing in case of
Pod failure. For example, if a Node fails, a controller notices that Pods on that
Node have stopped working and creates a replacement Pod. The scheduler places the
replacement Pod onto a healthy Node.

Here are some examples of workload resources that manage one or more Pods:

* {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
* {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
* {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}

### Pod templates

Controllers for {{< glossary_tooltip text="workload" term_id="workload" >}} resources create Pods
from a _pod template_ and manage those Pods on your behalf.

PodTemplates are specifications for creating Pods, and are included in workload resources such as
[Deployments](/docs/concepts/workloads/controllers/deployment/),
[Jobs](/docs/concepts/workloads/controllers/job/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).

Each controller for a workload resource uses the `PodTemplate` inside the workload
object to make actual Pods. The `PodTemplate` is part of the desired state of whatever
workload resource you used to run your app.

The sample below is a manifest for a simple Job with a `template` that starts one
container. The container in that Pod prints a message then pauses.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # This is the pod template
    spec:
      containers:
      - name: hello
        image: busybox:1.28
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # The pod template ends here
```

Modifying the pod template or switching to a new pod template has no direct effect
on the Pods that already exist. If you change the pod template for a workload
resource, that resource needs to create replacement Pods that use the updated template.

For example, the StatefulSet controller ensures that the running Pods match the current
pod template for each StatefulSet object. If you edit the StatefulSet to change its pod
template, the StatefulSet starts to create new Pods based on the updated template.
Eventually, all of the old Pods are replaced with new Pods, and the update is complete.

Each workload resource implements its own rules for handling changes to the Pod template.
If you want to read more about StatefulSet specifically, read
[Update strategy](/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets) in the StatefulSet Basics tutorial.

On Nodes, the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} does not
directly observe or manage any of the details around pod templates and updates; those
details are abstracted away. That abstraction and separation of concerns simplifies
system semantics, and makes it feasible to extend the cluster's behavior without
changing existing code.

## Pod update and replacement

As mentioned in the previous section, when the Pod template for a workload
resource is changed, the controller creates new Pods based on the updated
template instead of updating or patching the existing Pods.

Kubernetes doesn't prevent you from managing Pods directly. It is possible to
update some fields of a running Pod, in place. However, Pod update operations
like 
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core), and
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
have some limitations:

- Most of the metadata about a Pod is immutable. For example, you cannot
  change the `namespace`, `name`, `uid`, or `creationTimestamp` fields;
  the `generation` field is unique. It only accepts updates that increment the
  field's current value.
- If the `metadata.deletionTimestamp` is set, no new entry can be added to the
  `metadata.finalizers` list.
- Pod updates may not change fields other than `spec.containers[*].image`,
  `spec.initContainers[*].image`, `spec.activeDeadlineSeconds` or
  `spec.tolerations`. For `spec.tolerations`, you can only add new entries.
- When updating the `spec.activeDeadlineSeconds` field, two types of updates
  are allowed:

  1. setting the unassigned field to a positive number; 
  1. updating the field from a positive number to a smaller, non-negative
     number.

## Resource sharing and communication

Pods enable data sharing and communication among their constituent
containers.

### Storage in Pods {#pod-storage}

A Pod can specify a set of shared storage
{{< glossary_tooltip text="volumes" term_id="volume" >}}. All containers
in the Pod can access the shared volumes, allowing those containers to
share data. Volumes also allow persistent data in a Pod to survive
in case one of the containers within needs to be restarted. See
[Storage](/docs/concepts/storage/) for more information on how
Kubernetes implements shared storage and makes it available to Pods.

### Pod networking

Each Pod is assigned a unique IP address for each address family. Every
container in a Pod shares the network namespace, including the IP address and
network ports. Inside a Pod (and **only** then), the containers that belong to the Pod
can communicate with one another using `localhost`. When containers in a Pod communicate
with entities *outside the Pod*,
they must coordinate how they use the shared network resources (such as ports).
Within a Pod, containers share an IP address and port space, and
can find each other via `localhost`. The containers in a Pod can also communicate
with each other using standard inter-process communications like SystemV semaphores
or POSIX shared memory.  Containers in different Pods have distinct IP addresses
and can not communicate by OS-level IPC without special configuration.
Containers that want to interact with a container running in a different Pod can
use IP networking to communicate.

Containers within the Pod see the system hostname as being the same as the configured
`name` for the Pod. There's more about this in the [networking](/docs/concepts/cluster-administration/networking/)
section.

## Privileged mode for containers

{{< note >}}
Your {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} must support the concept of a privileged container for this setting to be relevant.
{{< /note >}}

Any container in a pod can run in privileged mode to use operating system administrative capabilities
that would otherwise be inaccessible. This is available for both Windows and Linux.

### Linux privileged containers

In Linux, any container in a Pod can enable privileged mode using the `privileged` (Linux) flag
on the [security context](/docs/tasks/configure-pod-container/security-context/) of the
container spec. This is useful for containers that want to use operating system administrative
capabilities such as manipulating the network stack or accessing hardware devices.

### Windows privileged containers

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

In Windows, you can create a [Windows HostProcess pod](/docs/tasks/configure-pod-container/create-hostprocess-pod) by setting the 
`windowsOptions.hostProcess` flag on the security context of the pod spec. All containers in these
pods must run as Windows HostProcess containers. HostProcess pods run directly on the host and can also be used
to perform administrative tasks as is done with Linux privileged containers.

## Static Pods

_Static Pods_ are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Whereas most Pods are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}), for static
Pods, the kubelet directly supervises each static Pod (and restarts it if it fails).

Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.
The main use for static Pods is to run a self-hosted control plane: in other words,
using the kubelet to supervise the individual [control plane components](/docs/concepts/overview/components/#control-plane-components).

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.

{{< note >}}
The `spec` of a static Pod cannot refer to other API objects
(e.g., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
{{< /note >}}

## Container probes

A _probe_ is a diagnostic performed periodically by the kubelet on a container. To perform a diagnostic, the kubelet can invoke different actions:

- `ExecAction` (performed with the help of the container runtime)
- `TCPSocketAction` (checked directly by the kubelet)
- `HTTPGetAction` (checked directly by the kubelet)

You can read more about [probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) 
in the Pod Lifecycle documentation.

## {{% heading "whatsnext" %}}

* Learn about the [lifecycle of a Pod](/docs/concepts/workloads/pods/pod-lifecycle/).
* Learn about [RuntimeClass](/docs/concepts/containers/runtime-class/) and how you can use it to
  configure different Pods with different container runtime configurations.
* Read about [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) and how you can use it to manage application availability during disruptions.
* Pod is a top-level resource in the Kubernetes REST API.
  The {{< api-reference page="workload-resources/pod-v1" >}}
  object definition describes the object in detail.
* [The Distributed System Toolkit: Patterns for Composite Containers](/blog/2015/06/the-distributed-system-toolkit-patterns/) explains common layouts for Pods with more than one container.
* Read about [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)

To understand the context for why Kubernetes wraps a common Pod API in other resources (such as {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} or {{< glossary_tooltip text="Deployments" term_id="deployment" >}}), you can read about the prior art, including:

* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google.com/pubs/pub43438.html)
* [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/).
