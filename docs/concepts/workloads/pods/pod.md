---
reviewers:
title: Pods
---

* TOC
{:toc}


_Pods_ are the smallest deployable units of computing that can be created and
managed in Kubernetes.

## What is a Pod?

A _pod_ (as in a pod of whales or pea pod) is a group of one or more containers
(such as Docker containers), with shared storage/network, and a specification
for how to run the containers.  A pod's contents are always co-located and
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
and can not communicate by IPC without
[special configuration](/docs/concepts/policy/pod-security-policy/).
These containers usually communicate with each other via Pod IP addresses.

Applications within a pod also have access to shared volumes, which are defined
as part of a pod and are made available to be mounted into each application's
filesystem.

In terms of [Docker](https://www.docker.com/) constructs, a pod is modelled as
a group of Docker containers with shared namespaces and shared
[volumes](/docs/concepts/storage/volumes/).

Like individual application containers, pods are considered to be relatively
ephemeral (rather than durable) entities. As discussed in [life of a
pod](/docs/concepts/workloads/pods/pod-lifecycle/), pods are created, assigned a unique ID (UID), and
scheduled to nodes where they remain until termination (according to restart
policy) or deletion. If a node dies, the pods scheduled to that node are
scheduled for deletion, after a timeout period. A given pod (as defined by a UID) is not
"rescheduled" to a new node; instead, it can be replaced by an identical pod,
with even the same name if desired, but with a new UID (see [replication
controller](/docs/concepts/workloads/controllers/replicationcontroller/) for more details).

When something is said to have the same lifetime as a pod, such as a volume,
that means that it exists as long as that pod (with that UID) exists. If that
pod is deleted for any reason, even if an identical replacement is created, the
related thing (e.g. volume) is also destroyed and created anew.

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
pod. [More details on networking](/docs/concepts/cluster-administration/networking/).

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
1. Decoupling software dependencies. The individual containers may be
   versioned, rebuilt and redeployed independently. Kubernetes may even support
   live updates of individual containers someday.
1. Ease of use. Users don't need to run their own process managers, worry about
   signal and exit-code propagation, etc.
1. Efficiency. Because the infrastructure takes on more responsibility,
   containers can be lighter weight.

_Why not support affinity-based co-scheduling of containers?_

That approach would provide co-location, but would not provide most of the
benefits of pods, such as resource sharing, IPC, guaranteed fate sharing, and
simplified management.

## Durability of pods (or lack thereof)

Pods aren't intended to be treated as durable entities. They won't survive scheduling failures, node failures, or other evictions, such as due to lack of resources, or in the case of node maintenance.

In general, users shouldn't need to create pods directly. They should almost
always use controllers even for singletons, for example,
[Deployments](/docs/concepts/workloads/controllers/deployment/)).
Controllers provide self-healing with a cluster scope, as well as replication
and rollout management.
Controllers like [StatefulSet](/docs/concepts/workloads/controllers/statefulset.md)
can also provide support to stateful pods.

The use of collective APIs as the primary user-facing primitive is relatively common among cluster scheduling systems, including [Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](http://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).

Pod is exposed as a primitive in order to facilitate:

* scheduler and controller pluggability
* support for pod-level operations without the need to "proxy" them via controller APIs
* decoupling of pod lifetime from controller lifetime, such as for bootstrapping
* decoupling of controllers and services &mdash; the endpoint controller just watches pods
* clean composition of Kubelet-level functionality with cluster-level functionality &mdash; Kubelet is effectively the "pod controller"
* high-availability applications, which will expect pods to be replaced in advance of their termination and certainly in advance of deletion, such as in the case of planned evictions or image prefetching.

## Termination of Pods

Because pods represent running processes on nodes in the cluster, it is important to allow those processes to gracefully terminate when they are no longer needed (vs being violently killed with a KILL signal and having no chance to clean up). Users should be able to request deletion and know when processes terminate, but also be able to ensure that deletes eventually complete. When a user requests deletion of a pod the system records the intended grace period before the pod is allowed to be forcefully killed, and a TERM signal is sent to the main process in each container. Once the grace period has expired the KILL signal is sent to those processes and the pod is then deleted from the API server. If the Kubelet or the container manager is restarted while waiting for processes to terminate, the termination will be retried with the full grace period.

An example flow:

1. User sends command to delete Pod, with default grace period (30s)
1. The Pod in the API server is updated with the time beyond which the Pod is considered "dead" along with the grace period.
1. Pod shows up as "Terminating" when listed in client commands
1. (simultaneous with 3) When the Kubelet sees that a Pod has been marked as terminating because the time in 2 has been set, it begins the pod shutdown process.
    1. If the pod has defined a [preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details), it is invoked inside of the pod. If the `preStop` hook is still running after the grace period expires, step 2 is then invoked with a small (2 second) extended grace period.
    1. The processes in the Pod are sent the TERM signal.
1. (simultaneous with 3) Pod is removed from endpoints list for service, and are no longer considered part of the set of running pods for replication controllers. Pods that shutdown slowly can continue to serve traffic as load balancers (like the service proxy) remove them from their rotations.
1. When the grace period expires, any processes still running in the Pod are killed with SIGKILL.
1. The Kubelet will finish deleting the Pod on the API server by setting grace period 0 (immediate deletion). The Pod disappears from the API and is no longer visible from the client.

By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports the `--grace-period=<seconds>` option which allows a user to override the default and specify their own value. The value `0` [force deletes](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) the pod. In kubectl version >= 1.5, you must specify an additional flag `--force` along with `--grace-period=0` in order to perform force deletions.

### Force deletion of pods

Force deletion of a pod is defined as deletion of a pod from the cluster state and etcd immediately. When a force deletion is performed, the apiserver does not wait for confirmation from the kubelet that the pod has been terminated on the node it was running on. It removes the pod in the API immediately so a new pod can be created with the same name. On the node, pods that are set to terminate immediately will still be given a small grace period before being force killed.

Force deletions can be potentially dangerous for some pods and should be performed with caution. In case of StatefulSet pods, please refer to the task documentation for [deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

## Privileged mode for pod containers

From Kubernetes v1.1, any container in a pod can enable privileged mode, using the `privileged` flag on the `SecurityContext` of the container spec. This is useful for containers that want to use linux capabilities like manipulating the network stack and accessing devices. Processes within the container get almost the same privileges that are available to processes outside a container. With privileged mode, it should be easier to write network and volume plugins as separate pods that don't need to be compiled into the kubelet.

If the master is running Kubernetes v1.1 or higher, and the nodes are running a version lower than v1.1, then new privileged pods will be accepted by api-server, but will not be launched. They will be pending state.
If user calls `kubectl describe pod FooPodName`, user can see the reason why the pod is in pending state. The events table in the describe command output will say:
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`


If the master is running a version lower than v1.1, then privileged pods cannot be created. If user attempts to create a pod, that has a privileged container, the user will get the following error:
`The Pod "FooPodName" is invalid.
spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`

## API Object

Pod is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at:
[Pod API object](/docs/reference/generated/kubernetes-api/{{page.version}}/#pod-v1-core).
