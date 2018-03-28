---
title: Assign CPU Resources to Containers and Pods
---

{% capture overview %}

This page shows how to assign a CPU *request* and a CPU *limit* to
a Container. A Container is guaranteed to have as much CPU as it requests,
but is not allowed to use more CPU than its limit.


{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

Each node in your cluster must have at least 1 cpu.

A few of the steps on this page require that the
[Heapster](https://github.com/kubernetes/heapster) service is running
in your cluster. But if you don't have Heapster running, you can do most
of the steps, and it won't be a problem if you skip the Heapster steps.

If you are running minikube, run the following command to enable heapster:

```shell
minikube addons enable heapster
```

To see whether the Heapster service is running, enter this command:

```shell
kubectl get services --namespace=kube-system
```

If the heapster service is running, it shows in the output:

```shell
NAMESPACE    NAME      CLUSTER-IP    EXTERNAL-IP  PORT(S)  AGE
kube-system  heapster  10.11.240.9   <none>       80/TCP   6d
```

{% endcapture %}


{% capture steps %}

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace cpu-example
```

## Specify a CPU request and a CPU limit

To specify a CPU request for a Container, include the `resources:requests` field
in the Container's resource manifest. To specify a CPU limit, include `resources:limits`.

In this exercise, you create a Pod that has one Container. The Container has a CPU
request of 0.5 cpu and a CPU limit of 1 cpu. Here's the configuration file
for the Pod:

{% include code.html language="yaml" file="cpu-request-limit.yaml" ghlink="/docs/tasks/configure-pod-container/cpu-request-limit.yaml" %}

In the configuration file, the `args` section provides arguments for the Container when it starts.
The `-cpus "2"` argument tells the Container to attempt to use 2 cpus.

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/cpu-request-limit.yaml --namespace=cpu-example
```

Verify that the Pod's Container is running:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

View detailed information about the Pod:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

The output shows that the one Container in the Pod has a CPU request of 500 millicpu
and a CPU limit of 1 cpu.

```shell
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

Start a proxy so that you can call the heapster service:

```shell
kubectl proxy
```

In another command window, get the CPU usage rate from the heapster service:

```
curl http://localhost:8001/api/v1/proxy/namespaces/kube-system/services/heapster/api/v1/model/namespaces/cpu-example/pods/cpu-demo/metrics/cpu/usage_rate
```

The output shows that the Pod is using 974 millicpu, which is just a bit less than
the limit of 1 cpu specified in the Pod's configuration file.

```json
{
 "timestamp": "2017-06-22T18:48:00Z",
 "value": 974
}
```

Recall that by setting `-cpu "2"`, you configured the Container to attempt to use 2 cpus.
But the Container is only being allowed to use about 1 cpu. The Container's CPU use is being
throttled, because the Container is attempting to use more CPU resources than its limit.

**Note:** There's another possible explanation for the CPU throttling. The Node might not have
enough CPU resources available. Recall that the prerequisites for this exercise require that each of
your Nodes has at least 1 cpu. If your Container is running on a Node that has only 1 cpu, the Container
cannot use more than 1 cpu regardless of the CPU limit specified for the Container.
{: .note}

## CPU units

The CPU resource is measured in *cpu* units. One cpu, in Kubernetes, is equivalent to:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread on a bare-metal Intel processor with Hyperthreading

Fractional values are allowed. A Container that requests 0.5 cpu is guaranteed half as much
CPU as a Container that requests 1 cpu. You can use the suffix m to mean milli. For example
100m cpu, 100 millicpu, and 0.1 cpu are all the same. Precision finer than 1m is not allowed.

CPU is always requested as an absolute quantity, never as a relative quantity; 0.1 is the same
amount of CPU on a single-core, dual-core, or 48-core machine.

Delete your Pod:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## Specify a CPU request that is too big for your Nodes

CPU requests and limits are associated with Containers, but it is useful to think
of a Pod as having a CPU request and limit. The CPU request for a Pod is the sum
of the CPU requests for all the Containers in the Pod. Likewise, the CPU limit for
a Pod is the sum of the CPU limits for all the Containers in the Pod.

Pod scheduling is based on requests. A Pod is scheduled to run on a Node only if
the Node has enough CPU resources available to satisfy the Pod’s CPU request.

In this exercise, you create a Pod that has a CPU request so big that it exceeds
the capacity of any Node in your cluster. Here is the configuration file for a Pod
that has one Container. The Container requests 100 cpu, which is likely to exceed the
capacity of any Node in your cluster.

{% include code.html language="yaml" file="cpu-request-limit-2.yaml" ghlink="/docs/tasks/configure-pod-container/cpu-request-limit-2.yaml" %}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/cpu-request-limit-2.yaml --namespace=cpu-example
```

View the Pod's status:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

The output shows that the Pod's status is Pending. That is, the Pod has not been
scheduled to run on any Node, and it will remain in the Pending state indefinitely:


```
kubectl get pod cpu-demo-2 --namespace=cpu-example
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

View detailed information about the Pod, including events:


```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

The output shows that the Container cannot be scheduled because of insufficient
CPU resources on the Nodes:


```shell
Events:
  Reason			Message
  ------			-------
  FailedScheduling	No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

Delete your Pod:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## If you don’t specify a CPU limit

If you don’t specify a CPU limit for a Container, then one of these situations applies:

* The Container has no upper bound on the CPU resources it can use. The Container
could use all of the CPU resources available on the Node where it is running.

* The Container is running in a namespace that has a default CPU limit, and the
Container is automatically assigned the default limit. Cluster administrators can use a
[LimitRange](/docs/reference/generated/kubernetes-api/{{page.version}}/#limitrange-v1-core/)
to specify a default value for the CPU limit.

## Motivation for CPU requests and limits

By configuring the CPU requests and limits of the Containers that run in your
cluster, you can make efficient use of the CPU resources available on your cluster's
Nodes. By keeping a Pod's CPU request low, you give the Pod a good chance of being
scheduled. By having a CPU limit that is greater than the CPU request, you accomplish two things:

* The Pod can have bursts of activity where it makes use of CPU resources that happen to be available.
* The amount of CPU resources a Pod can use during a burst is limited to some reasonable amount.

## Clean up

Delete your namespace:

```shell
kubectl delete namespace cpu-example
```

{% endcapture %}

{% capture whatsnext %}


### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

{% endcapture %}


{% include templates/task.md %}
