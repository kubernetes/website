---
title: Configure Memory and CPU Quotas for a Namespace
---


{% capture overview %}

This page shows how to set quotas for the total amount memory and CPU that
can be used by all Containers running in a namespace. You specify quotas in a
[ResourceQuota](/docs/reference/generated/kubernetes-api/{{page.version}}/#resourcequota-v1-core)
object.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

Each node in your cluster must have at least 1 GiB of memory.

{% endcapture %}


{% capture steps %}

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace quota-mem-cpu-example
```

## Create a ResourceQuota

Here is the configuration file for a ResourceQuota object:

{% include code.html language="yaml" file="quota-mem-cpu.yaml" ghlink="/docs/tasks/administer-cluster/quota-mem-cpu.yaml" %}

Create the ResourceQuota:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-mem-cpu.yaml --namespace=quota-mem-cpu-example
```

View detailed information about the ResourceQuota:

```shell
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

The ResourceQuota places these requirements on the quota-mem-cpu-example namespace:

* Every Container must have a memory request, memory limit, cpu request, and cpu limit.
* The memory request total for all Containers must not exceed 1 GiB.
* The memory limit total for all Containers must not exceed 2 GiB.
* The CPU request total for all Containers must not exceed 1 cpu.
* The CPU limit total for all Containers must not exceed 2 cpu.

## Create a Pod

Here is the configuration file for a Pod:

{% include code.html language="yaml" file="quota-mem-cpu-pod.yaml" ghlink="/docs/tasks/administer-cluster/quota-mem-cpu-pod.yaml" %}


Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-mem-cpu-pod.yaml --namespace=quota-mem-cpu-example
```

Verify that the Pod's Container is running:

```
kubectl get pod quota-mem-cpu-demo --namespace=quota-mem-cpu-example
```

Once again, view detailed information about the ResourceQuota:

```
kubectl get resourcequota mem-cpu-demo --namespace=quota-mem-cpu-example --output=yaml
```

The output shows the quota along with how much of the quota has been used.
You can see that the memory and CPU requests and limits for your Pod do not
exceed the quota.

```
status:
  hard:
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.cpu: "1"
    requests.memory: 1Gi
  used:
    limits.cpu: 800m
    limits.memory: 800Mi
    requests.cpu: 400m
    requests.memory: 600Mi
```

## Attempt to create a second Pod

Here is the configuration file for a second Pod:

{% include code.html language="yaml" file="quota-mem-cpu-pod-2.yaml" ghlink="/docs/tasks/administer-cluster/quota-mem-cpu-pod-2.yaml" %}

In the configuration file, you can see that the Pod has a memory request of 700 MiB.
Notice that the sum of the used memory request and this new memory
request exceeds the memory request quota. 600 MiB + 700 MiB > 1 GiB.

Attempt to create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-mem-cpu-pod-2.yaml --namespace=quota-mem-cpu-example
```

The second Pod does not get created. The output shows that creating the second Pod
would cause the memory request total to exceed the memory request quota.

```
Error from server (Forbidden): error when creating "docs/tasks/administer-cluster/quota-mem-cpu-pod-2.yaml":
pods "quota-mem-cpu-demo-2" is forbidden: exceeded quota: mem-cpu-demo,
requested: requests.memory=700Mi,used: requests.memory=600Mi, limited: requests.memory=1Gi
```

## Discussion

As you have seen in this exercise, you can use a ResourceQuota to restrict
the memory request total for all Containers running in a namespace.
You can also restrict the totals for memory limit, cpu request, and cpu limit.

If you want to restrict individual Containers, instead of totals for all Containers, use a
[LimitRange](/docs/tasks/administer-cluster/memory-constraint-namespace/).

## Clean up

Delete your namespace:

```shell
kubectl delete namespace quota-mem-cpu-example
```

{% endcapture %}

{% capture whatsnext %}

### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

{% endcapture %}


{% include templates/task.md %}


