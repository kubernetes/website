---
title: Configure Minimum and Maximum Memory Constraints for a Namespace
content_type: task
weight: 30
description: >-
  Define a range of valid memory resource limits for a namespace, so that every new Pod
  in that namespace falls within the range you configure.
---


<!-- overview -->

This page shows how to set minimum and maximum values for memory used by containers
running in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}. 
You specify minimum and maximum memory values in a
[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
object. If a Pod does not meet the constraints imposed by the LimitRange,
it cannot be created in the namespace.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

You must have access to create namespaces in your cluster.

Each node in your cluster must have at least 1 GiB of memory available for Pods.

<!-- steps -->

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace constraints-mem-example
```

## Create a LimitRange and a Pod

Here's an example manifest for a LimitRange:

{{% code_sample file="admin/resource/memory-constraints.yaml" %}}

Create the LimitRange:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

View detailed information about the LimitRange:

```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

The output shows the minimum and maximum memory constraints as expected. But
notice that even though you didn't specify default values in the configuration
file for the LimitRange, they were created automatically.

```
  limits:
  - default:
      memory: 1Gi
    defaultRequest:
      memory: 1Gi
    max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

Now whenever you define a Pod within the constraints-mem-example namespace, Kubernetes
performs these steps:

* If any container in that Pod does not specify its own memory request and limit, 
the control plane assigns the default memory request and limit to that container.

* Verify that every container in that Pod requests at least 500 MiB of memory.

* Verify that every container in that Pod requests no more than 1024 MiB (1 GiB)
  of memory.

Here's a manifest for a Pod that has one container. Within the Pod spec, the sole
container specifies a memory request of 600 MiB and a memory limit of 800 MiB. These satisfy the
minimum and maximum memory constraints imposed by the LimitRange.

{{% code_sample file="admin/resource/memory-constraints-pod.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

Verify that the Pod is running and that its container is healthy:

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

The output shows that the container within that Pod has a memory request of 600 MiB and
a memory limit of 800 MiB. These satisfy the constraints imposed by the LimitRange for
this namespace:

```yaml
resources:
  limits:
     memory: 800Mi
  requests:
    memory: 600Mi
```

Delete your Pod:

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

## Attempt to create a Pod that exceeds the maximum memory constraint

Here's a manifest for a Pod that has one container. The container specifies a
memory request of 800 MiB and a memory limit of 1.5 GiB.

{{% code_sample file="admin/resource/memory-constraints-pod-2.yaml" %}}

Attempt to create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

The output shows that the Pod does not get created, because it defines a container that
requests more memory than is allowed:

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

## Attempt to create a Pod that does not meet the minimum memory request

Here's a manifest for a Pod that has one container. That container specifies a
memory request of 100 MiB and a memory limit of 800 MiB.

{{% code_sample file="admin/resource/memory-constraints-pod-3.yaml" %}}

Attempt to create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

The output shows that the Pod does not get created, because it defines a container
that requests less memory than the enforced minimum:

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

## Create a Pod that does not specify any memory request or limit

Here's a manifest for a Pod that has one container. The container does not
specify a memory request, and it does not specify a memory limit.

{{% code_sample file="admin/resource/memory-constraints-pod-4.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

The output shows that the Pod's only container has a memory request of 1 GiB and a memory limit of 1 GiB.
How did that container get those values?

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

Because your Pod did not define any memory request and limit for that container, the cluster
applied a
[default memory request and limit](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
from the LimitRange.

This means that the definition of that Pod shows those values. You can check it using
`kubectl describe`:

```shell
# Look for the "Requests:" section of the output
kubectl describe pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

At this point, your Pod might be running or it might not be running. Recall that a prerequisite
for this task is that your Nodes have at least 1 GiB of memory. If each of your Nodes has only
1 GiB of memory, then there is not enough allocatable memory on any Node to accommodate a memory
request of 1 GiB. If you happen to be using Nodes with 2 GiB of memory, then you probably have
enough space to accommodate the 1 GiB request.

Delete your Pod:

```shell
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

## Enforcement of minimum and maximum memory constraints

The maximum and minimum memory constraints imposed on a namespace by a LimitRange are enforced only
when a Pod is created or updated. If you change the LimitRange, it does not affect
Pods that were created previously.

## Motivation for minimum and maximum memory constraints

As a cluster administrator, you might want to impose restrictions on the amount of memory that Pods can use.
For example:

* Each Node in a cluster has 2 GiB of memory. You do not want to accept any Pod that requests
more than 2 GiB of memory, because no Node in the cluster can support the request.

* A cluster is shared by your production and development departments.
You want to allow production workloads to consume up to 8 GiB of memory, but
you want development workloads to be limited to 512 MiB. You create separate namespaces
for production and development, and you apply memory constraints to each namespace.

## Clean up

Delete your namespace:

```shell
kubectl delete namespace constraints-mem-example
```


## {{% heading "whatsnext" %}}


### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)







