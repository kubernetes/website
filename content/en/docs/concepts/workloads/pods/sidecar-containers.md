---
title: Sidecar Containers
content_type: concept
weight: 50
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.29" state="beta" >}}

Sidecar containers are the secondary containers that run along with the main
application container within the same {{< glossary_tooltip text="Pod" term_id="pod" >}}.
These containers are used to enhance or to extend the functionality of the primary _app
container_ by providing additional services, or functionality such as logging, monitoring,
security, or data synchronization, without directly altering the primary application code.

Typically, you only have one app container in a Pod. For example, if you have a web
application that requires a local webserver, the local webserver is a sidecar and the
web application itself is the app container.

<!-- body -->

## Sidecar containers in Kubernetes {#pod-sidecar-containers}

Kubernetes implements sidecar containers as a special case of
[init containers](/docs/concepts/workloads/pods/init-containers/); sidecar containers remain
running after Pod startup. This document uses the term _regular init containers_ to clearly
refer to containers that only run during Pod startup.

Provided that your cluster has the `SidecarContainers`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled
(the feature is active by default since Kubernetes v1.29), you can specify a `restartPolicy`
for containers listed in a Pod's `initContainers` field.
These restartable _sidecar_ containers are independent from other init containers and from
the main application container(s) within the same pod.
These can be started, stopped, or restarted without effecting the main application container
and other init containers.

You can also run a Pod with multiple containers that are not marked as init or sidecar
containers. This is appropriate if the containers within the Pod are required for the
Pod to work overall, but you don't need to control which containers start or stop first.
You could also do this if you need to support older versions of Kubernetes that don't
support a container-level `restartPolicy` field.

### Example application {#sidecar-example}

Here's an example of a Deployment with two containers, one of which is a sidecar:

{{% code_sample language="yaml" file="application/deployment-sidecar.yaml" %}}

## Sidecar containers and Pod lifecycle

If an init container is created with its `restartPolicy` set to `Always`, it will
start and remain running during the entire life of the Pod. This can be helpful for
running supporting services separated from the main application containers.

If a `readinessProbe` is specified for this init container, its result will be used
to determine the `ready` state of the Pod.

Since these containers are defined as init containers, they benefit from the same
ordering and sequential guarantees as regular init containers, allowing you to mix
sidecar containers with regular init containers for complex Pod initialization flows.

Compared to regular init containers, sidecars defined within `initContainers` continue to
run after they have started. This is important when there is more than one entry inside
`.spec.initContainers` for a Pod. After a sidecar-style init container is running (the kubelet
has set the `started` status for that init container to true), the kubelet then starts the
next init container from the ordered `.spec.initContainers` list.
That status either becomes true because there is a process running in the
container and no startup probe defined, or as a result of its `startupProbe` succeeding.

### Jobs with sidecar containers

If you define a Job that uses sidecar using Kubernetes-style init containers,
the sidecar container in each Pod does not prevent the Job from completing after the
main container has finished.

Here's an example of a Job with two containers, one of which is a sidecar:

{{% code_sample language="yaml" file="application/job/job-sidecar.yaml" %}}

## Differences from application containers

Sidecar containers run alongside _app containers_ in the same pod. However, they do not
execute the primary application logic; instead, they provide supporting functionality to
the main application.

Sidecar containers have their own independent lifecycles. They can be started, stopped,
and restarted independently of app containers. This means you can update, scale, or
maintain sidecar containers without affecting the primary application.

Sidecar containers share the same network and storage namespaces with the primary
container. This co-location allows them to interact closely and share resources.

## Differences from init containers

Sidecar containers work alongside the main container, extending its functionality and
providing additional services.

Sidecar containers run concurrently with the main application container. They are active
throughout the lifecycle of the pod and can be started and stopped independently of the
main container. Unlike [init containers](/docs/concepts/workloads/pods/init-containers/),
sidecar containers support [probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe) to control their lifecycle.

Sidecar containers can interact directly with the main application containers, because
like init containers they always share the same network, and can optionally also share
volumes (filesystems).

Init containers stop before the main containers start up, so init containers cannot
exchange messages with the app container in a Pod. Any data passing is one-way
(for example, an init container can put information inside an `emptyDir` volume).

## Resource sharing within containers

{{< comment >}}
This section is also present in the [init containers](/docs/concepts/workloads/pods/init-containers/) page.
If you're editing this section, change both places.
{{< /comment >}}

Given the order of execution for init, sidecar and app containers, the following rules
for resource usage apply:

* The highest of any particular resource request or limit defined on all init
  containers is the *effective init request/limit*. If any resource has no
  resource limit specified this is considered as the highest limit.
* The Pod's *effective request/limit* for a resource is the sum of
[pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/) and the higher of:
  * the sum of all non-init containers(app and sidecar containers) request/limit for a
  resource
  * the effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means
  init containers can reserve resources for initialization that are not used
  during the life of the Pod.
* The QoS (quality of service) tier of the Pod's *effective QoS tier* is the
  QoS tier for all init, sidecar and app containers alike.

Quota and limits are applied based on the effective Pod request and
limit.

### Sidecar containers and Linux cgroups {#cgroups}

On Linux, resource allocations for Pod level control groups (cgroups) are based on the effective Pod
request and limit, the same as the scheduler.

## {{% heading "whatsnext" %}}

* Learn how to [Adopt Sidecar Containers](/docs/tutorials/configuration/pod-sidecar-containers/)
* Read a blog post on [native sidecar containers](/blog/2023/08/25/native-sidecar-containers/).
* Read about [creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* Learn about the [types of probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): liveness, readiness, startup probe.
* Learn about [pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/).
