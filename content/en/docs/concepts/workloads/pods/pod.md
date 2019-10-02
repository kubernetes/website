---
reviewers:
title: Pods
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

_Pods_ are the smallest deployable units of computing that can be created and
managed in Kubernetes.

{{% /capture %}}


{{% capture body %}}

## What is a Pod?

A _Pod_ (as in a pod of whales or pea pod) is a group of one or more
{{< glossary_tooltip text="containers" term_id="container" >}} (such as
Docker containers), with shared storage/network, and a specification
for how to run the containers.  A Pod's contents are always co-located and
co-scheduled, and run in a shared context.  A Pod models an
application-specific "logical host" - it contains one or more application
containers which are relatively tightly coupled &mdash; in a pre-container
world, being executed on the same physical or virtual machine would mean being
executed on the same logical host.

While Kubernetes supports more container runtimes than just Docker, Docker is
the most commonly known runtime, and it helps to describe Pods in Docker terms.

The shared context of a Pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a Docker
container.  Within a Pod's context, the individual applications may have
further sub-isolations applied.

Containers within a Pod share an IP address and port space, and
can find each other via `localhost`. They can also communicate with each
other using standard inter-process communications like SystemV semaphores or
POSIX shared memory.  Containers in different Pods have distinct IP addresses
and can not communicate by IPC without
[special configuration](/docs/concepts/policy/pod-security-policy/).
These containers usually communicate with each other via Pod IP addresses.

Applications within a Pod also have access to shared {{< glossary_tooltip text="volumes" term_id="volume" >}}, which are defined
as part of a Pod and are made available to be mounted into each application's
filesystem.

In terms of [Docker](https://www.docker.com/) constructs, a Pod is modelled as
a group of Docker containers with shared namespaces and shared filesystem
volumes.

Like individual application containers, Pods are considered to be relatively
ephemeral (rather than durable) entities. As discussed in
[pod lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/), Pods are created, assigned a unique ID (UID), and
scheduled to nodes where they remain until termination (according to restart
policy) or deletion. If a {{< glossary_tooltip term_id="node" >}} dies, the Pods scheduled to that node are
scheduled for deletion, after a timeout period. A given Pod (as defined by a UID) is not
"rescheduled" to a new node; instead, it can be replaced by an identical Pod,
with even the same name if desired, but with a new UID (see [replication
controller](/docs/concepts/workloads/controllers/replicationcontroller/) for more details).

When something is said to have the same lifetime as a Pod, such as a volume,
that means that it exists as long as that Pod (with that UID) exists. If that
Pod is deleted for any reason, even if an identical replacement is created, the
related thing (e.g. volume) is also destroyed and created anew.

{{< figure src="/images/docs/pod.svg" title="Pod diagram" width="50%" >}}

*A multi-container Pod that contains a file puller and a
web server that uses a persistent volume for shared storage between the containers.*

## Motivation for Pods

### Management

Pods are a model of the pattern of multiple cooperating processes which form a
cohesive unit of service.  They simplify application deployment and management
by providing a higher-level abstraction than the set of their constituent
applications. Pods serve as unit of deployment, horizontal scaling, and
replication. Colocation (co-scheduling), shared fate (e.g. termination),
coordinated replication, resource sharing, and dependency management are
handled automatically for containers in a Pod.

### Resource sharing and communication

Pods enable data sharing and communication among their constituents.

The applications in a Pod all use the same network namespace (same IP and port
space), and can thus "find" each other and communicate using `localhost`.
Because of this, applications in a Pod must coordinate their usage of ports.
Each Pod has an IP address in a flat shared networking space that has full
communication with other physical computers and Pods across the network.

Containers within the Pod see the system hostname as being the same as the configured
`name` for the Pod. There's more about this in the [networking](/docs/concepts/cluster-administration/networking/)
section.

In addition to defining the application containers that run in the Pod, the Pod
specifies a set of shared storage volumes. Volumes enable data to survive
container restarts and to be shared among the applications within the Pod.

## Uses of pods

Pods can be used to host vertically integrated application stacks (e.g. LAMP),
but their primary motivation is to support co-located, co-managed helper
programs, such as:

* content management systems, file and data loaders, local cache managers, etc.
* log and checkpoint backup, compression, rotation, snapshotting, etc.
* data change watchers, log tailers, logging and monitoring adapters, event publishers, etc.
* proxies, bridges, and adapters
* controllers, managers, configurators, and updaters

Individual Pods are not intended to run multiple instances of the same
application, in general.

For a longer explanation, see [The Distributed System ToolKit: Patterns for
Composite
Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns).

## Alternatives considered

_Why not just run multiple programs in a single (Docker) container?_

1. Transparency. Making the containers within the Pod visible to the
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
benefits of Pods, such as resource sharing, IPC, guaranteed fate sharing, and
simplified management.

## Durability of pods (or lack thereof)

Pods aren't intended to be treated as durable entities. They won't survive scheduling failures, node failures, or other evictions, such as due to lack of resources, or in the case of node maintenance.

In general, users shouldn't need to create Pods directly. They should almost
always use controllers even for singletons, for example,
[Deployments](/docs/concepts/workloads/controllers/deployment/).
Controllers provide self-healing with a cluster scope, as well as replication
and rollout management.
Controllers like [StatefulSet](/docs/concepts/workloads/controllers/statefulset.md)
can also provide support to stateful Pods.

The use of collective APIs as the primary user-facing primitive is relatively common among cluster scheduling systems, including [Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](https://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).

Pod is exposed as a primitive in order to facilitate:

* scheduler and controller pluggability
* support for pod-level operations without the need to "proxy" them via controller APIs
* decoupling of Pod lifetime from controller lifetime, such as for bootstrapping
* decoupling of controllers and services &mdash; the endpoint controller just watches Pods
* clean composition of Kubelet-level functionality with cluster-level functionality &mdash; Kubelet is effectively the "pod controller"
* high-availability applications, which will expect Pods to be replaced in advance of their termination and certainly in advance of deletion, such as in the case of planned evictions or image prefetching.

## Termination of Pods

Because Pods represent running processes on nodes in the cluster, it is important to allow those processes to gracefully terminate when they are no longer needed (vs being violently killed with a KILL signal and having no chance to clean up). Users should be able to request deletion and know when processes terminate, but also be able to ensure that deletes eventually complete. When a user requests deletion of a Pod, the system records the intended grace period before the Pod is allowed to be forcefully killed, and a TERM signal is sent to the main process in each container. Once the grace period has expired, the KILL signal is sent to those processes, and the Pod is then deleted from the API server. If the Kubelet or the container manager is restarted while waiting for processes to terminate, the termination will be retried with the full grace period.

An example flow:

1. User sends command to delete Pod, with default grace period (30s)
1. The Pod in the API server is updated with the time beyond which the Pod is considered "dead" along with the grace period.
1. Pod shows up as "Terminating" when listed in client commands
1. (simultaneous with 3) When the Kubelet sees that a Pod has been marked as terminating because the time in 2 has been set, it begins the Pod shutdown process.
    1. If one of the Pod's containers has defined a [preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details), it is invoked inside of the container. If the `preStop` hook is still running after the grace period expires, step 2 is then invoked with a small (2 second) extended grace period.
    1. The container is sent the TERM signal. Note that not all containers in the Pod will receive the TERM signal at the same time and may each require a `preStop` hook if the order in which they shut down matters.
1. (simultaneous with 3) Pod is removed from endpoints list for service, and are no longer considered part of the set of running Pods for replication controllers. Pods that shutdown slowly cannot continue to serve traffic as load balancers (like the service proxy) remove them from their rotations.
1. When the grace period expires, any processes still running in the Pod are killed with SIGKILL.
1. The Kubelet will finish deleting the Pod on the API server by setting grace period 0 (immediate deletion). The Pod disappears from the API and is no longer visible from the client.

By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports the `--grace-period=<seconds>` option which allows a user to override the default and specify their own value. The value `0` [force deletes](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) the Pod.
You must specify an additional flag `--force` along with `--grace-period=0` in order to perform force deletions.

### Force deletion of pods

Force deletion of a Pod is defined as deletion of a Pod from the cluster state and etcd immediately. When a force deletion is performed, the API server does not wait for confirmation from the kubelet that the Pod has been terminated on the node it was running on. It removes the Pod in the API immediately so a new Pod can be created with the same name. On the node, Pods that are set to terminate immediately will still be given a small grace period before being force killed.

Force deletions can be potentially dangerous for some Pods and should be performed with caution. In case of StatefulSet Pods, please refer to the task documentation for [deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

## Privileged mode for pod containers

Any container in a Pod can enable privileged mode, using the `privileged` flag on the [security context](/docs/tasks/configure-pod-container/security-context/) of the container spec. This is useful for containers that want to use Linux capabilities like manipulating the network stack and accessing devices. Processes within the container get almost the same privileges that are available to processes outside a container. With privileged mode, it should be easier to write network and volume plugins as separate Pods that don't need to be compiled into the kubelet.

{{< note >}}
Your container runtime must support the concept of a privileged container for this setting to be relevant.
{{< /note >}}

## API Object

Pod is a top-level resource in the Kubernetes REST API.
The [Pod API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core) definition
describes the object in detail.

{{% /capture %}}
