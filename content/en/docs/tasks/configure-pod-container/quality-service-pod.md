---
title: Configure Quality of Service for Pods
content_type: task
weight: 30
---


<!-- overview -->

This page shows how to configure Pods so that they will be assigned particular
Quality of Service (QoS) classes. Kubernetes uses QoS classes to make decisions about
scheduling and evicting Pods.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## QoS classes

Quality of Services classes classify pods into one of three types: Guaranteed, Burstable, and BestEffort.
The classification of pods is based on the [resource limits and requests](/docs/concepts/configuration/manage-resources-containers/).
Each classification has effects on the scheduling policy and Eviction policy of a pod as well as on the resource usage of nodes.

### Guaranteed

To be sure a pod will be included in the Guaranteed QoS, every container in the pod must have
resource(memory and CPU) limits and requests set, and they both have to be the same. The scheduler will make sure that
a pod running in a Guaranteed QoS class is assigned to a node that has enough resources to fulfill its resource requests.
A pod running in a Guaranteed QoS class can make use of exclusive CPUs  thanks to the [static](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy) CPU management policy.

When a node becomes [out of resource](/docs/tasks/administer-cluster/out-of-resource/), QoS classification helps kubelet
to prioritize pods when the node needs to reclaim resources or when `oom_killer` needs to kill containers.
If the `Guaranteed` pod uses memory resource lower than the requested resource, the pod has the lowest
priority to be [evicted](/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods) by kubelet.
The kubelet score container based on their QoS classification a `oom_score_adj` score and `oom_killer` uses `oom_score_adj` and the percentage of
container usage of memory in the node to calculate `oom_score` for the container.
So when the node experiences a system OOM event before kubelet to take action, the `oom_killer` scores a container
`oom_score` and kills the container on the node with highest `oom_score` in this case Guaranteed pod has the lowest `oom_score_adj`
so lowest chance to be killed by `oom_killer` based on [node OOM behavior](/docs/tasks/administer-cluster/out-of-resource/#node-oom-behavior).


### Burstable

For a pod to be included in the Burstable QoS, at least one container in the pod must have a resource (memory or CPU) limit or request set.
The scheduler schedules pods running in a burstable QoS class on a node which fulfils resource requests. If pods don’t define resource limits,
then it can use more resources than the amount requested. All Burstable pods run with [`none`](/docs/tasks/administer-cluster/cpu-management-policies/#none-policy) CPU management policy.

The kubelet uses QoS classification when the kubelet needs to reclaim resources of a node due to [out of resource conditions](/docs/tasks/administer-cluster/out-of-resource/#node-conditions).
When a node condition happens, `Burstable` pod which uses more than requested and has no resource limit
is ranked by [Priority](/docs/concepts/configuration/pod-priority-preemption/) and its usage and they are most likely
to be evicted first by kubelet. On the other hand, `Burstable` pods whose usage is lower than requested resource usage,
like `Guaranteed` pods have the lowest priority to be [evicted](/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods).
If a node experiences a system OOM event and `oom_killer` takes action before the kubelet, The `Burstable` pods have a middle `oom_score_adj`
between Guaranteed and BestEffort class depending on memory request and the memory capacity of the node. After `BestEffort` pods Burstable pods
have more chance to be killed by `oom_killer` based on [node OOM behavior](/docs/tasks/administer-cluster/out-of-resource/#node-oom-behavior).

### BestEffort

If All containers in a pod have no limits or requests on resources, the pod runs in the BestEffort QoS class.
The pod can take any resources needed and the scheduler doesn’t reserve any resources and doesn’t limit resource usage.
But when a node reports `MemoryPressure` condition, the scheduler will not schedule `BestEffort` pods on the node due to [`Node condition`](/docs/tasks/administer-cluster/out-of-resource/#scheduler).
Like the Burstable QoS class, pods running in the BestEffort QoS class use the shared CPU pool and can't use the static CPU management policy.

In the case of out of resource node condition, kubelet ranks pods based on their QoS classification.
The `BestEffort` pods have no limits and requests on resources so can use resources aggressively.
When kubelet detects out of resource condition on a node, `BestEffort` pod which uses starved resource
ranked by [Priority](/docs/concepts/configuration/pod-priority-preemption/) and then the highest ranked pods
will be [evicted](/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods) by kubelet based on its resource usage
and its `priority`. If the node detects a system OOM condition event before kubelet reclaiming memory,
the `BestEffort` pod has the highest `oom_score_adj` score when `oom_killer` calculates `oom_score` for containers so `BestEffort` pod
has the highest chance in the QoS classification containers to be killed by `oom_killer` first, based on [node OOM behavior](/docs/tasks/administer-cluster/out-of-resource/#node-oom-behavior).





## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace qos-example
```

## Create a Pod that gets assigned a QoS class of Guaranteed

For a Pod to be given a QoS class of Guaranteed:

* Every Container in the Pod must have a memory limit and a memory request, and they must be the same.
* Every Container in the Pod must have a CPU limit and a CPU request, and they must be the same.

Here is the configuration file for a Pod that has one Container. The Container has a memory limit and a
memory request, both equal to 200 MiB. The Container has a CPU limit and a CPU request, both equal to 700 milliCPU:

{{< codenew file="pods/qos/qos-pod.yaml" >}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

View detailed information about the Pod:

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

The output shows that Kubernetes gave the Pod a QoS class of Guaranteed. The output also
verifies that the Pod Container has a memory request that matches its memory limit, and it has
a CPU request that matches its CPU limit.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
...
  qosClass: Guaranteed
```

{{< note >}}
If a Container specifies its own memory limit, but does not specify a memory request, Kubernetes
automatically assigns a memory request that matches the limit. Similarly, if a Container specifies its own
CPU limit, but does not specify a CPU request, Kubernetes automatically assigns a CPU request that matches
the limit.
{{< /note >}}

Delete your Pod:

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

## Create a Pod that gets assigned a QoS class of Burstable

A Pod is given a QoS class of Burstable if:

* The Pod does not meet the criteria for QoS class Guaranteed.
* At least one Container in the Pod has a memory or CPU request.

Here is the configuration file for a Pod that has one Container. The Container has a memory limit of 200 MiB
and a memory request of 100 MiB.

{{< codenew file="pods/qos/qos-pod-2.yaml" >}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

View detailed information about the Pod:

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

The output shows that Kubernetes gave the Pod a QoS class of Burstable.

```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
...
  qosClass: Burstable
```

Delete your Pod:

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

## Create a Pod that gets assigned a QoS class of BestEffort

For a Pod to be given a QoS class of BestEffort, the Containers in the Pod must not
have any memory or CPU limits or requests.

Here is the configuration file for a Pod that has one Container. The Container has no memory or CPU
limits or requests:

{{< codenew file="pods/qos/qos-pod-3.yaml" >}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

View detailed information about the Pod:

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

The output shows that Kubernetes gave the Pod a QoS class of BestEffort.

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
  qosClass: BestEffort
```

Delete your Pod:

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

## Create a Pod that has two Containers

Here is the configuration file for a Pod that has two Containers. One container specifies a memory
request of 200 MiB. The other Container does not specify any requests or limits.

{{< codenew file="pods/qos/qos-pod-4.yaml" >}}

Notice that this Pod meets the criteria for QoS class Burstable. That is, it does not meet the
criteria for QoS class Guaranteed, and one of its Containers has a memory request.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

View detailed information about the Pod:

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

The output shows that Kubernetes gave the Pod a QoS class of Burstable:

```yaml
spec:
  containers:
    ...
    name: qos-demo-4-ctr-1
    resources:
      requests:
        memory: 200Mi
    ...
    name: qos-demo-4-ctr-2
    resources: {}
    ...
  qosClass: Burstable
```

Delete your Pod:

```shell
kubectl delete pod qos-demo-4 --namespace=qos-example
```

## Clean up

Delete your namespace:

```shell
kubectl delete namespace qos-example
```



## {{% heading "whatsnext" %}}



### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

* [Control Topology Management policies on a node](/docs/tasks/administer-cluster/topology-manager/)
<<<<<<< HEAD


=======
{{% /capture %}}
>>>>>>> correct typo
