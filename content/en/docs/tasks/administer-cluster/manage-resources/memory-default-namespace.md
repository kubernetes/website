---
title: Configure Default Memory Requests and Limits for a Namespace
content_template: templates/task
weight: 10
---

{{% capture overview %}}

This page shows how to configure default memory requests and limits for a namespace.
If a Container is created in a namespace that has a default memory limit, and the Container
does not specify its own memory limit, then the Container is assigned the default memory limit.
Kubernetes assigns a default memory request under certain conditions that are explained later in this topic.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Each node in your cluster must have at least 2 GiB of memory.

{{% /capture %}}

{{% capture steps %}}

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace default-mem-example
```

## Create a LimitRange and a Pod

Here's the configuration file for a LimitRange object. The configuration specifies
a default memory request and a default memory limit.

{{< codenew file="admin/resource/memory-defaults.yaml" >}}

Create the LimitRange in the default-mem-example namespace:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

Now if a Container is created in the default-mem-example namespace, and the
Container does not specify its own values for memory request and memory limit,
the Container is given a default memory request of 256 MiB and a default
memory limit of 512 MiB.

Here's the configuration file for a Pod that has one Container. The Container
does not specify a memory request and limit.

{{< codenew file="admin/resource/memory-defaults-pod.yaml" >}}

Create the Pod.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

The output shows that the Pod's Container has a memory request of 256 MiB and
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

## What if you specify a Container's limit, but not its request?

Here's the configuration file for a Pod that has one Container. The Container
specifies a memory limit, but not a request:

{{< codenew file="admin/resource/memory-defaults-pod-2.yaml" >}}

Create the Pod:


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

The output shows that the Container's memory request is set to match its memory limit.
Notice that the Container was not assigned the default memory request value of 256Mi.

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## What if you specify a Container's request, but not its limit?

Here's the configuration file for a Pod that has one Container. The Container
specifies a memory request, but not a limit:

{{< codenew file="admin/resource/memory-defaults-pod-3.yaml" >}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

View the Pod's specification:

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

The output shows that the Container's memory request is set to the value specified in the
Container's configuration file. The Container's memory limit is set to 512Mi, which is the
default memory limit for the namespace.

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

## Motivation for default memory limits and requests

If your namespace has a resource quota,
it is helpful to have a default value in place for memory limit.
Here are two of the restrictions that a resource quota imposes on a namespace:

* Every Container that runs in the namespace must have its own memory limit.
* The total amount of memory used by all Containers in the namespace must not exceed a specified limit.

If a Container does not specify its own memory limit, it is given the default limit, and then
it can be allowed to run in a namespace that is restricted by a quota.

## Clean up

Delete your namespace:

```shell
kubectl delete namespace default-mem-example
```

{{% /capture %}}

{{% capture whatsnext %}}

### For cluster administrators

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

{{% /capture %}}


