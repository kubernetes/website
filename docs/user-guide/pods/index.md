---
---

* TOC
{:toc}


_pods_ are the smallest deployable units of computing that can be created and
managed in Kubernetes.

## What is a _pod_?

A _pod_ (as in a pod of whales or pea pod) is a group of one or more containers
(such as Docker containers), the shared storage for those containers, and
options about how to run the containers.  Pods are always co-located and
co-scheduled, and run in a shared context.  A pod models an
application-specific "logical host" - it contains one or more application
containers which are relatively tightly coupled &mdash; in a pre-container
world, they would have executed on the same physical or virtual machine.

While Kubernetes supports more container runtimes than just Docker, Docker is
the most commonly known runtime, and it helps to describe pods in Docker terms.

The shared context of a pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a Docker
container.  Within a pod's context, the individual applications may have
further sub-isolations applied.

Containers within a pod share an IP address and port space, and
can find each other via `localhost`. They can also communicate with each
other using standard inter-process communications like SystemV semaphores or
POSIX shared memory.  Containers in different pods have distinct IP addresses
and can not communicate by IPC.

Applications within a pod also have access to shared volumes, which are defined
as part of a pod and are made available to be mounted into each application's
filesystem.

In terms of [Docker](https://www.docker.com/) constructs, a pod is modelled as
a group of Docker containers with shared namespaces and shared
[volumes](/docs/user-guide/volumes/).

![pod diagram](/images/docs/pod.svg){: style="max-width: 50%" }

*A multi-container pod that contains a file puller and a 
web server that uses a persistent volume for shared storage between the containers.*

## Motivation for pods

### Management

Pods are a model of the pattern of multiple cooperating processes which form a
cohesive unit of service.  They simplify application deployment and management
by providing a higher-level abstraction than the set of their constituent
applications. Pods serve as unit of deployment, horizontal scaling, and
replication. Colocation (co-scheduling), shared fate (e.g. termination),
coordinated replication, resource sharing, and dependency management are
handled automatically for containers in a pod.

### Resource sharing and communication

Pods enable data sharing and communication among their constituents.

The applications in a pod all use the same network namespace (same IP and port
space), and can thus "find" each other and communicate using `localhost`.
Because of this, applications in a pod must coordinate their usage of ports.
Each pod has an IP address in a flat shared networking space that has full
communication with other physical computers and pods across the network.

The hostname is set to the pod's Name for the application containers within the
pod. [More details on networking](/docs/admin/networking/).

In addition to defining the application containers that run in the pod, the pod
specifies a set of shared storage volumes. Volumes enable data to survive
container restarts and to be shared among the applications within the pod.

## Uses of pods

Pods can be used to host vertically integrated application stacks (e.g. LAMP),
but their primary motivation is to support co-located, co-managed helper
programs, such as:

* content management systems, file and data loaders, local cache managers, etc.
* log and checkpoint backup, compression, rotation, snapshotting, etc.
* data change watchers, log tailers, logging and monitoring adapters, event publishers, etc.
* proxies, bridges, and adapters
* controllers, managers, configurators, and updaters

Individual pods are not intended to run multiple instances of the same
application, in general.

For a longer explanation, see [The Distributed System ToolKit: Patterns for
Composite
Containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html).

## Alternatives considered

_Why not just run multiple programs in a single (Docker) container?_

1. Transparency. Making the containers within the pod visible to the
   infrastructure enables the infrastructure to provide services to those
   containers, such as process management and resource monitoring. This
   facilitates a number of conveniences for users.
2. Decoupling software dependencies. The individual containers may be
   versioned, rebuilt and redeployed independently. Kubernetes may even support
   live updates of individual containers someday.
3. Ease of use. Users don't need to run their own process managers, worry about
   signal and exit-code propagation, etc.
4. Efficiency. Because the infrastructure takes on more responsibility,
   containers can be lighter weight.

_Why not support affinity-based co-scheduling of containers?_

That approach would provide co-location, but would not provide most of the
benefits of pods, such as resource sharing, IPC, guaranteed fate sharing, and
simplified management.

## Pod Lifecycle

Like individual application containers, pods are considered to be relatively
ephemeral (rather than durable) entities. As discussed in [life of a
pod](/docs/user-guide/pod-states/), pods are created, assigned a unique ID (UID), and
scheduled to nodes where they remain until termination (according to restart
policy) or deletion. If a node dies, the pods scheduled to that node are
deleted, after a timeout period. A given pod (as defined by a UID) is not
"rescheduled" to a new node; instead, it can be replaced by an identical pod,
with even the same name if desired, but with a new UID (see [replication
controller](/docs/user-guide/replication-controller/) for more details). (In the future, a
higher-level API may support pod migration.)

When something is said to have the same lifetime as a pod, such as a volume,
that means that it exists as long as that pod (with that UID) exists. If that
pod is deleted for any reason, even if an identical replacement is created, the
related thing (e.g. volume) is also destroyed and created anew.

## Durability of pods (or lack thereof)

See [Pod Lifecycle](/docs/user-guide/pod-states.md)

## Privileged mode for pod containers

From kubernetes v1.1, any container in a pod can enable privileged mode, using the `privileged` flag on the `SecurityContext` of the container spec. This is useful for containers that want to use linux capabilities like manipulating the network stack and accessing devices. Processes within the container get almost the same privileges that are available to processes outside a container. With privileged mode, it should be easier to write network and volume plugins as separate pods that don't need to be compiled into the kubelet.

If the master is running kubernetes v1.1 or higher, and the nodes are running a version lower than v1.1, then new privileged pods will be accepted by api-server, but will not be launched. They will be pending state.
If user calls `kubectl describe pod FooPodName`, user can see the reason why the pod is in pending state. The events table in the describe command output will say:
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`


If the master is running a version lower than v1.1, then privileged pods cannot be created. If user attempts to create a pod, that has a privileged container, the user will get the following error:
`The Pod "FooPodName" is invalid.
spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`

## API Object

Pod is a top-level resource in the kubernetes REST API. More details about the
API object can be found at: [Pod API
object](/docs/api-reference/v1/definitions/#_v1_pod).
