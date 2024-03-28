---
title: Sidecar Containers
content_type: concept
weight: 50
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.29" state="beta" >}}

Sidecar containers are the secondary containers that run along with the main
application container within the same {{< glossary_tooltip text="Pod" term_id="pod" >}}.
These containers are used to enhance or to extend the functionality of the main application
container by providing additional services, or functionality such as logging, monitoring,
security, or data synchronization, without directly altering the primary application code.

<!-- body -->

## Enabling sidecar containers

Enabled by default with Kubernetes 1.29, a
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) named
`SidecarContainers` allows you to specify a `restartPolicy` for containers listed in a
Pod's `initContainers` field. These restartable _sidecar_ containers are independent with
other [init containers](/docs/concepts/workloads/pods/init-containers/) and main
application container within the same pod. These can be started, stopped, or restarted
without affecting the main application container and other init containers.

## Sidecar containers and Pod lifecycle

If an init container is created with its `restartPolicy` set to `Always`, it will
start and remain running during the entire life of the Pod. This can be helpful for
running supporting services separated from the main application containers.

If a `readinessProbe` is specified for this init container, its result will be used
to determine the `ready` state of the Pod.

Since these containers are defined as init containers, they benefit from the same
ordering and sequential guarantees as other init containers, allowing them to
be mixed with other init containers into complex Pod initialization flows.

Compared to regular init containers, sidecars defined within `initContainers` continue to
run after they have started. This is important when there is more than one entry inside
`.spec.initContainers` for a Pod. After a sidecar-style init container is running (the kubelet
has set the `started` status for that init container to true), the kubelet then starts the
next init container from the ordered `.spec.initContainers` list.
That status either becomes true because there is a process running in the
container and no startup probe defined, or as a result of its `startupProbe` succeeding.

Here's an example of a Deployment with two containers, one of which is a sidecar:

{{% code_sample language="yaml" file="application/deployment-sidecar.yaml" %}}

This feature is also useful for running Jobs with sidecars, as the sidecar
container will not prevent the Job from completing after the main container
has finished.

Here's an example of a Job with two containers, one of which is a sidecar:

{{% code_sample language="yaml" file="application/job/job-sidecar.yaml" %}}

## Differences from regular containers

Sidecar containers run alongside regular containers in the same pod. However, they do not
execute the primary application logic; instead, they provide supporting functionality to
the main application.

Sidecar containers have their own independent lifecycles. They can be started, stopped,
and restarted independently of regular containers. This means you can update, scale, or
maintain sidecar containers without affecting the primary application.

Sidecar containers share the same network and storage namespaces with the primary
container This co-location allows them to interact closely and share resources.

## Differences from init containers

Sidecar containers work alongside the main container, extending its functionality and
providing additional services.

Sidecar containers run concurrently with the main application container. They are active
throughout the lifecycle of the pod and can be started and stopped independently of the
main container. Unlike [init containers](/docs/concepts/workloads/pods/init-containers/),
sidecar containers support [probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe) to control their lifecycle.

These containers can interact directly with the main application containers, sharing
the same network namespace, filesystem, and environment variables. They work closely
together to provide additional functionality.

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

Pod level control groups (cgroups) are based on the effective Pod request and
limit, the same as the scheduler.

## {{% heading "whatsnext" %}}

* Read a blog post on [native sidecar containers](/blog/2023/08/25/native-sidecar-containers/).
* Read about [creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* Learn about the [types of probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): liveness, readiness, startup probe.
* Learn about [pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/).
