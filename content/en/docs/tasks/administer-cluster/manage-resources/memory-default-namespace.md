---
title: Configure Default Memory Requests and Limits for a Namespace
content_type: task
weight: 10
description: >-
  Define a default memory resource limit for a namespace, so that every new Pod
  in that namespace has a memory resource limit configured.
---

<!-- overview -->

This page shows how to configure default memory requests and limits for a
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.

A Kubernetes cluster can be divided into namespaces. Once you have a namespace that
has a default memory
[limit](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits),
and you then try to create a Pod with a container that does not specify its own memory
limit, then the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} assigns the default
memory limit to that container.

Kubernetes assigns a default memory request under certain conditions that are explained later in this topic.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

You must have access to create namespaces in your cluster.

Each node in your cluster must have at least 2 GiB of memory.



<!-- steps -->

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace default-mem-example
```

## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}.
The manifest specifies a default memory
request and a default memory limit.

{{% code_sample file="admin/resource/memory-defaults.yaml" %}}

Create the LimitRange in the default-mem-example namespace:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

Now if you create a Pod in the default-mem-example namespace, and any container
within that Pod does not specify its own values for memory request and memory limit,
then the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
applies default values: a memory request of 256MiB and a memory limit of 512MiB.


Here's an example manifest for a Pod that has one container. The container
does not specify a memory request and limit.

{{% code_sample file="admin/resource/memory-defaults-pod.yaml" %}}

Create the Pod.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

The output shows that the Pod's container has a memory request of 256 MiB and
a memory limit of 512 MiB. These are the default values specified by the LimitRange.

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-mem-demo-ctr
  resources:
    limits:
      memory: 512Mi
    requests:
      memory: 256Mi
```

Delete your Pod:

```shell
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

## What if you specify a container's limit, but not its request?

Here's a manifest for a Pod that has one container. The container
specifies a memory limit, but not a request:

{{% code_sample file="admin/resource/memory-defaults-pod-2.yaml" %}}

Create the Pod:


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

The output shows that the container's memory request is set to match its memory limit.
Notice that the container was not assigned the default memory request value of 256Mi.

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## What if you specify a container's request, but not its limit?

Here's a manifest for a Pod that has one container. The container
specifies a memory request, but not a limit:

{{% code_sample file="admin/resource/memory-defaults-pod-3.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

View the Pod's specification:

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

The output shows that the container's memory request is set to the value specified in the
container's manifest. The container is limited to use no more than 512MiB of
memory, which matches the default memory limit for the namespace.

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

{{< note >}}

A `LimitRange` does **not** check the consistency of the default values it applies. This means that a default value for the _limit_ that is set by `LimitRange` may be less than the _request_ value specified for the container in the spec that a client submits to the API server. If that happens, the final Pod will not be scheduleable.
See [Constraints on resource limits and requests](/docs/concepts/policy/limit-range/#constraints-on-resource-limits-and-requests) for more details.

{{< /note >}}


## Motivation for default memory limits and requests

If your namespace has a memory {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
configured,
it is helpful to have a default value in place for memory limit.
Here are three of the restrictions that a resource quota imposes on a namespace:

* For every Pod that runs in the namespace, the Pod and each of its containers must have a memory limit.
  (If you specify a memory limit for every container in a Pod, Kubernetes can infer the Pod-level memory
  limit by adding up the limits for its containers).
* Memory limits apply a resource reservation on the node where the Pod in question is scheduled.
  The total amount of memory reserved for all Pods in the namespace must not exceed a specified limit.
* The total amount of memory actually used by all Pods in the namespace must also not exceed a specified limit.

When you add a LimitRange:

If any Pod in that namespace that includes a container does not specify its own memory limit,
the control plane applies the default memory limit to that container, and the Pod can be
allowed to run in a namespace that is restricted by a memory ResourceQuota.

## Clean up

Delete your namespace:

```shell
kubectl delete namespace default-mem-example
```



## {{% heading "whatsnext" %}}


### For cluster administrators

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)




