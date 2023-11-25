---
title: Configure Default CPU Requests and Limits for a Namespace
content_type: task
weight: 20
description: >-
  Define a default CPU resource limits for a namespace, so that every new Pod
  in that namespace has a CPU resource limit configured.
---

<!-- overview -->

This page shows how to configure default CPU requests and limits for a
{{< glossary_tooltip text="namespace" term_id="namespace" >}}.

A Kubernetes cluster can be divided into namespaces. If you create a Pod within a
namespace that has a default CPU
[limit](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits), and any container in that Pod does not specify
its own CPU limit, then the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} assigns the default
CPU limit to that container.

Kubernetes assigns a default CPU
[request](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits),
but only under certain conditions that are explained later in this page.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

You must have access to create namespaces in your cluster.

If you're not already familiar with what Kubernetes means by 1.0 CPU,
read [meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).

<!-- steps -->

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace default-cpu-example
```

## Create a LimitRange and a Pod

Here's a manifest for an example {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}.
The manifest specifies a default CPU request and a default CPU limit.

{{% code_sample file="admin/resource/cpu-defaults.yaml" %}}

Create the LimitRange in the default-cpu-example namespace:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults.yaml --namespace=default-cpu-example
```

Now if you create a Pod in the default-cpu-example namespace, and any container
in that Pod does not specify its own values for CPU request and CPU limit,
then the control plane applies default values: a CPU request of 0.5 and a default
CPU limit of 1.

Here's a manifest for a Pod that has one container. The container
does not specify a CPU request and limit.

{{% code_sample file="admin/resource/cpu-defaults-pod.yaml" %}}

Create the Pod.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod.yaml --namespace=default-cpu-example
```

View the Pod's specification:

```shell
kubectl get pod default-cpu-demo --output=yaml --namespace=default-cpu-example
```

The output shows that the Pod's only container has a CPU request of 500m `cpu`
(which you can read as “500 millicpu”), and a CPU limit of 1 `cpu`.
These are the default values specified by the LimitRange.

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-cpu-demo-ctr
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

## What if you specify a container's limit, but not its request?

Here's a manifest for a Pod that has one container. The container
specifies a CPU limit, but not a request:

{{% code_sample file="admin/resource/cpu-defaults-pod-2.yaml" %}}

Create the Pod:


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-2.yaml --namespace=default-cpu-example
```

View the [specification](/docs/concepts/overview/working-with-objects/#object-spec-and-status)
of the Pod that you created:

```
kubectl get pod default-cpu-demo-2 --output=yaml --namespace=default-cpu-example
```

The output shows that the container's CPU request is set to match its CPU limit.
Notice that the container was not assigned the default CPU request value of 0.5 `cpu`:

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "1"
```

## What if you specify a container's request, but not its limit?

Here's an example manifest for a Pod that has one container. The container
specifies a CPU request, but not a limit:

{{% code_sample file="admin/resource/cpu-defaults-pod-3.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-defaults-pod-3.yaml --namespace=default-cpu-example
```

View the specification of the Pod that you created:

```
kubectl get pod default-cpu-demo-3 --output=yaml --namespace=default-cpu-example
```

The output shows that the container's CPU request is set to the value you specified at
the time you created the Pod (in other words: it matches the manifest).
However, the same container's CPU limit is set to 1 `cpu`, which is the default CPU limit
for that namespace.

```
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 750m
```

## Motivation for default CPU limits and requests

If your namespace has a CPU {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
configured,
it is helpful to have a default value in place for CPU limit.
Here are two of the restrictions that a CPU resource quota imposes on a namespace:

* For every Pod that runs in the namespace, each of its containers must have a CPU limit.
* CPU limits apply a resource reservation on the node where the Pod in question is scheduled.
  The total amount of CPU that is reserved for use by all Pods in the namespace must not
  exceed a specified limit.

When you add a LimitRange:

If any Pod in that namespace that includes a container does not specify its own CPU limit,
the control plane applies the default CPU limit to that container, and the Pod can be
allowed to run in a namespace that is restricted by a CPU ResourceQuota.


## Clean up

Delete your namespace:

```shell
kubectl delete namespace default-cpu-example
```



## {{% heading "whatsnext" %}}


### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)




