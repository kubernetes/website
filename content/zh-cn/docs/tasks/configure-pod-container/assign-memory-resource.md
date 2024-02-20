---
title: 为容器和 Pod 分配内存资源
content_type: task
weight: 10
---

<!--
title: Assign Memory Resources to Containers and Pods
content_type: task
weight: 10
-->

<!-- overview -->

<!--
This page shows how to assign a memory *request* and a memory *limit* to a
Container. A Container is guaranteed to have as much memory as it requests,
but is not allowed to use more memory than its limit.
-->
此页面展示如何将内存**请求**（request）和内存**限制**（limit）分配给一个容器。
我们保障容器拥有它请求数量的内存，但不允许使用超过限制数量的内存。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Each node in your cluster must have at least 300 MiB of memory.
-->
你集群中的每个节点必须拥有至少 300 MiB 的内存。

<!--
A few of the steps on this page require you to run the
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
service in your cluster. If you have the metrics-server
running, you can skip those steps.
-->
该页面上的一些步骤要求你在集群中运行
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) 服务。
如果你已经有在运行中的 metrics-server，则可以跳过这些步骤。

<!--
If you are running Minikube, run the following command to enable the
metrics-server:
-->
如果你运行的是 Minikube，可以运行下面的命令启用 metrics-server：

```shell
minikube addons enable metrics-server
```

<!--
To see whether the metrics-server is running, or another provider of the resource metrics
API (`metrics.k8s.io`), run the following command:
-->
要查看 metrics-server 或资源指标 API (`metrics.k8s.io`) 是否已经运行，请运行以下命令：

```shell
kubectl get apiservices
```

<!--
If the resource metrics API is available, the output includes a
reference to `metrics.k8s.io`.
-->
如果资源指标 API 可用，则输出结果将包含对 `metrics.k8s.io` 的引用信息。

```
NAME
v1beta1.metrics.k8s.io
```

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 创建命名空间    {#create-a-namespace}

创建一个命名空间，以便将本练习中创建的资源与集群的其余部分隔离。

```shell
kubectl create namespace mem-example
```

<!--
## Specify a memory request and a memory limit

To specify a memory request for a Container, include the `resources:requests` field
in the Container's resource manifest. To specify a memory limit, include `resources:limits`.

In this exercise, you create a Pod that has one Container. The Container has a memory
request of 100 MiB and a memory limit of 200 MiB. Here's the configuration file
for the Pod:
-->
## 指定内存请求和限制    {#specify-a-memory-request-and-a-memory-limit}

要为容器指定内存请求，请在容器资源清单中包含 `resources: requests` 字段。
同理，要指定内存限制，请包含 `resources: limits`。

在本练习中，你将创建一个拥有一个容器的 Pod。
容器将会请求 100 MiB 内存，并且内存会被限制在 200 MiB 以内。
这是 Pod 的配置文件：

{{% code_sample file="pods/resource/memory-request-limit.yaml" %}}

<!--
The `args` section in the configuration file provides arguments for the Container when it starts.
The `"--vm-bytes", "150M"` arguments tell the Container to attempt to allocate 150 MiB of memory.

Create the Pod:
-->
配置文件的 `args` 部分提供了容器启动时的参数。
`"--vm-bytes", "150M"` 参数告知容器尝试分配 150 MiB 内存。

开始创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

<!--
Verify that the Pod Container is running:
-->
验证 Pod 中的容器是否已运行：

```shell
kubectl get pod memory-demo --namespace=mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 相关的详细信息：

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

<!--
The output shows that the one Container in the Pod has a memory request of 100 MiB
and a memory limit of 200 MiB.
-->
输出结果显示：该 Pod 中容器的内存请求为 100 MiB，内存限制为 200 MiB。

```yaml
...
resources:
  requests:
    memory: 100Mi
  limits:
    memory: 200Mi
...
```

<!--
Run `kubectl top` to fetch the metrics for the pod:
-->
运行 `kubectl top` 命令，获取该 Pod 的指标数据：

```shell
kubectl top pod memory-demo --namespace=mem-example
```

<!--
The output shows that the Pod is using about 162,900,000 bytes of memory, which
is about 150 MiB. This is greater than the Pod's 100 MiB request, but within the
Pod's 200 MiB limit.
-->
输出结果显示：Pod 正在使用的内存大约为 162,900,000 字节，约为 150 MiB。
这大于 Pod 请求的 100 MiB，但在 Pod 限制的 200 MiB之内。

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

<!--
Delete your Pod:
-->
删除 Pod：

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

<!--
## Exceed a Container's memory limit

A Container can exceed its memory request if the Node has memory available. But a Container
is not allowed to use more than its memory limit. If a Container allocates more memory than
its limit, the Container becomes a candidate for termination. If the Container continues to
consume memory beyond its limit, the Container is terminated. If a terminated Container can be
restarted, the kubelet restarts it, as with any other type of runtime failure.
-->
## 超过容器限制的内存    {#exceed-a-container-s-memory-limit}

当节点拥有足够的可用内存时，容器可以使用其请求的内存。
但是，容器不允许使用超过其限制的内存。
如果容器分配的内存超过其限制，该容器会成为被终止的候选容器。
如果容器继续消耗超出其限制的内存，则终止容器。
如果终止的容器可以被重启，则 kubelet 会重新启动它，就像其他任何类型的运行时失败一样。

<!--
In this exercise, you create a Pod that attempts to allocate more memory than its limit.
Here is the configuration file for a Pod that has one Container with a
memory request of 50 MiB and a memory limit of 100 MiB:
-->
在本练习中，你将创建一个 Pod，尝试分配超出其限制的内存。
这是一个 Pod 的配置文件，其拥有一个容器，该容器的内存请求为 50 MiB，内存限制为 100 MiB：

{{% code_sample file="pods/resource/memory-request-limit-2.yaml" %}}

<!--
In the `args` section of the configuration file, you can see that the Container
will attempt to allocate 250 MiB of memory, which is well above the 100 MiB limit.

Create the Pod:
-->
在配置文件的 `args` 部分中，你可以看到容器会尝试分配 250 MiB 内存，这远高于 100 MiB 的限制。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 相关的详细信息：

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```
<!--
At this point, the Container might be running or killed. Repeat the preceding command until the Container is killed:
-->
此时，容器可能正在运行或被杀死。重复前面的命令，直到容器被杀掉：

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

<!--
Get a more detailed view of the Container status:
-->
获取容器更详细的状态信息：

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

<!--
The output shows that the Container was killed because it is out of memory (OOM):
-->
输出结果显示：由于内存溢出（OOM），容器已被杀掉：

```yaml
lastState:
   terminated:
     containerID: 65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

<!--
The Container in this exercise can be restarted, so the kubelet restarts it. Repeat
this command several times to see that the Container is repeatedly killed and restarted:
-->
本练习中的容器可以被重启，所以 kubelet 会重启它。
多次运行下面的命令，可以看到容器在反复的被杀死和重启：

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

<!--
The output shows that the Container is killed, restarted, killed again, restarted again, and so on:
-->
输出结果显示：容器被杀掉、重启、再杀掉、再重启……：

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

<!--
View detailed information about the Pod history:
-->
查看关于该 Pod 历史的详细信息：

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

<!--
The output shows that the Container starts and fails repeatedly:
-->
输出结果显示：该容器反复的在启动和失败：

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

<!--
View detailed information about your cluster's Nodes:
-->
查看关于集群节点的详细信息：

```
kubectl describe nodes
```

<!--
The output includes a record of the Container being killed because of an out-of-memory condition:
-->
输出结果包含了一条练习中的容器由于内存溢出而被杀掉的记录：

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

<!--
Delete your Pod:
-->
删除 Pod：

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

<!--
## Specify a memory request that is too big for your Nodes

Memory requests and limits are associated with Containers, but it is useful to think
of a Pod as having a memory request and limit. The memory request for the Pod is the
sum of the memory requests for all the Containers in the Pod. Likewise, the memory
limit for the Pod is the sum of the limits of all the Containers in the Pod.
-->
## 超过整个节点容量的内存    {#specify-a-memory-request-that-is-too-big-for-your-nodes}

内存请求和限制是与容器关联的，但将 Pod 视为具有内存请求和限制，也是很有用的。
Pod 的内存请求是 Pod 中所有容器的内存请求之和。
同理，Pod 的内存限制是 Pod 中所有容器的内存限制之和。

<!--
Pod scheduling is based on requests. A Pod is scheduled to run on a Node only if the Node
has enough available memory to satisfy the Pod's memory request.

In this exercise, you create a Pod that has a memory request so big that it exceeds the
capacity of any Node in your cluster. Here is the configuration file for a Pod that has one
Container with a request for 1000 GiB of memory, which likely exceeds the capacity
of any Node in your cluster.
-->
Pod 的调度基于请求。只有当节点拥有足够满足 Pod 内存请求的内存时，才会将 Pod 调度至节点上运行。

在本练习中，你将创建一个 Pod，其内存请求超过了你集群中的任意一个节点所拥有的内存。
这是该 Pod 的配置文件，其拥有一个请求 1000 GiB 内存的容器，这应该超过了你集群中任何节点的容量。

{{% code_sample file="pods/resource/memory-request-limit-3.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

<!--
View the Pod status:
-->
查看 Pod 状态：

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

<!--
The output shows that the Pod status is PENDING. That is, the Pod is not scheduled to run on any Node, and it will remain in the PENDING state indefinitely:
-->
输出结果显示：Pod 处于 PENDING 状态。
这意味着，该 Pod 没有被调度至任何节点上运行，并且它会无限期的保持该状态：

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

<!--
View detailed information about the Pod, including events:
-->
查看关于 Pod 的详细信息，包括事件：


```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

<!--
The output shows that the Container cannot be scheduled because of insufficient memory on the Nodes:
-->
输出结果显示：由于节点内存不足，该容器无法被调度：

```
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

<!--
## Memory units

The memory resource is measured in bytes. You can express memory as a plain integer or a
fixed-point integer with one of these suffixes: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
For example, the following represent approximately the same value:
-->
## 内存单位    {#memory-units}

内存资源的基本单位是字节（byte）。你可以使用这些后缀之一，将内存表示为
纯整数或定点整数：E、P、T、G、M、K、Ei、Pi、Ti、Gi、Mi、Ki。
例如，下面是一些近似相同的值：

```
128974848, 129e6, 129M, 123Mi
```

<!--
Delete your Pod:
-->
删除 Pod：

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

<!--
## If you do not specify a memory limit

If you do not specify a memory limit for a Container, one of the following situations applies:
-->
## 如果你没有指定内存限制    {#if-you-do-not-specify-a-memory-limit}

如果你没有为一个容器指定内存限制，则自动遵循以下情况之一：

<!--
* The Container has no upper bound on the amount of memory it uses. The Container
could use all of the memory available on the Node where it is running which in turn could invoke the OOM Killer. Further, in case of an OOM Kill, a container with no resource limits will have a greater chance of being killed.

* The Container is running in a namespace that has a default memory limit, and the
Container is automatically assigned the default limit. Cluster administrators can use a
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
to specify a default value for the memory limit.
-->
* 容器可无限制地使用内存。容器可以使用其所在节点所有的可用内存，
  进而可能导致该节点调用 OOM Killer。
  此外，如果发生 OOM Kill，没有资源限制的容器将被杀掉的可行性更大。

* 运行的容器所在命名空间有默认的内存限制，那么该容器会被自动分配默认限制。
  集群管理员可用使用 [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
  来指定默认的内存限制。

<!--
## Motivation for memory requests and limits

By configuring memory requests and limits for the Containers that run in your
cluster, you can make efficient use of the memory resources available on your cluster's
Nodes. By keeping a Pod's memory request low, you give the Pod a good chance of being
scheduled. By having a memory limit that is greater than the memory request, you accomplish two things:
-->
## 内存请求和限制的目的    {#motivation-for-memory-requests-and-limits}

通过为集群中运行的容器配置内存请求和限制，你可以有效利用集群节点上可用的内存资源。
通过将 Pod 的内存请求保持在较低水平，你可以更好地安排 Pod 调度。
通过让内存限制大于内存请求，你可以完成两件事：

<!--
* The Pod can have bursts of activity where it makes use of memory that happens to be available.
* The amount of memory a Pod can use during a burst is limited to some reasonable amount.
-->
* Pod 可以进行一些突发活动，从而更好的利用可用内存。
* Pod 在突发活动期间，可使用的内存被限制为合理的数量。

<!--
## Clean up

Delete your namespace. This deletes all the Pods that you created for this task:
-->
## 清理    {#clean-up}

删除命名空间。下面的命令会删除你根据这个任务创建的所有 Pod：

```shell
kubectl delete namespace mem-example
```

## {{% heading "whatsnext" %}}

<!--
### For app developers

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)
-->
### 应用开发者扩展阅读    {#for-app-developers}

* [为容器和 Pod 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [配置 Pod 的服务质量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
-->
### 集群管理员扩展阅读    {#for-cluster-administrators}

* [为命名空间配置默认的内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置默认的 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [配置命名空间的最小和最大内存约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [配置命名空间的最小和最大 CPU 约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置内存和 CPU 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [配置命名空间下 Pod 总数](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [配置 API 对象配额](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)
* [调整分配给容器的 CPU 和内存资源的大小](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
