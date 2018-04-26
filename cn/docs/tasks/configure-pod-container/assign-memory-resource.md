<!--
---
title: Assign Memory Resources to Containers and Pods
---

{% capture overview %}

This page shows how to assign a memory *request* and a memory *limit* to a
Container. A Container is guaranteed to have as much memory as it requests,
but is not allowed to use more memory than its limit.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

Each node in your cluster must have at least 300 MiB of memory.

A few of the steps on this page require that the
[Heapster](https://github.com/kubernetes/heapster) service is running
in your cluster. But if you don't have Heapster running, you can do most
of the steps, and it won't be a problem if you skip the Heapster steps.

To see whether the Heapster service is running, enter this command:

```shell
kubectl get services --namespace=kube-system
```

If the Heapster service is running, it shows in the output:

```shell
NAMESPACE    NAME      CLUSTER-IP    EXTERNAL-IP  PORT(S)  AGE
kube-system  heapster  10.11.240.9   <none>       80/TCP   6d
```

{% endcapture %}


{% capture steps %}
-->

---
title: 给容器和Pod分配内存资源
---

{% capture overview %}

这篇教程指导如何给容器分配申请的内存和内存限制。我们保证让容器获得足够的内存
资源，但是不允许它使用超过限制的资源。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

你的集群里每个节点至少必须拥有300M的内存。

这个教程里有几个步骤要求[Heapster](https://github.com/kubernetes/heapster) ，
但是如果你没有Heapster的话，也可以完成大部分的实验，就算跳过这些Heapster
步骤，也不会有什么问题。

检查看Heapster服务是否运行，执行命令：

```shell
kubectl get services --namespace=kube-system
```

如果Heapster服务正在运行，会有如下输出：

```shell
NAMESPACE    NAME      CLUSTER-IP    EXTERNAL-IP  PORT(S)  AGE
kube-system  heapster  10.11.240.9   <none>       80/TCP   6d
```

{% endcapture %}


{% capture steps %}

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace mem-example
```
-->

## 创建一个命名空间

创建命名空间，以便你在实验中创建的资源可以从集群的资源中隔离出来。

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

{% include code.html language="yaml" file="memory-request-limit.yaml" ghlink="/docs/tasks/configure-pod-container/memory-request-limit.yaml" %}

In the configuration file, the `args` section provides arguments for the Container when it starts.
The `-mem-total 150Mi` argument tells the Container to attempt to allocate 150 MiB of memory.

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/memory-request-limit.yaml --namespace=mem-example
```

Verify that the Pod's Container is running:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

The output shows that the one Container in the Pod has a memory request of 100 MiB
and a memory limit of 200 MiB.


```yaml
...
resources:
  limits:
    memory: 200Mi
  requests:
    memory: 100Mi
...
```

Start a proxy so that you can call the Heapster service:

```shell
kubectl proxy
```

In another command window, get the memory usage from the Heapster service:

```
curl http://localhost:8001/api/v1/proxy/namespaces/kube-system/services/heapster/api/v1/model/namespaces/mem-example/pods/memory-demo/metrics/memory/usage
```

The output shows that the Pod is using about 162,900,000 bytes of memory, which
is about 150 MiB. This is greater than the Pod's 100 MiB request, but within the
Pod's 200 MiB limit.

```json
{
 "timestamp": "2017-06-20T18:54:00Z",
 "value": 162856960
}
```

Delete your Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```
-->

## 配置内存申请和限制

给容器配置内存申请，只要在容器的配置文件里添加`resources:requests`就可以了。配置限制的话，
则是添加`resources:limits`。

本实验，我们创建包含一个容器的Pod，这个容器申请100M的内存，并且内存限制设置为200M，下面
是配置文件：

{% include code.html language="yaml" file="memory-request-limit.yaml" ghlink="/docs/tasks/configure-pod-container/memory-request-limit.yaml" %}

在这个配置文件里，`args`代码段提供了容器所需的参数。`-mem-total 150Mi`告诉容器尝试申请150M
的内存。

创建Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/memory-request-limit.yaml --namespace=mem-example
```

验证Pod的容器是否正常运行:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

查看Pod的详细信息:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

这个输出显示了Pod里的容器申请了100M的内存和200M的内存限制。


```yaml
...
resources:
  limits:
    memory: 200Mi
  requests:
    memory: 100Mi
...
```

启动proxy以便我们可以访问Heapster服务：

```shell
kubectl proxy
```

在另外一个命令行窗口，从Heapster服务获取内存使用情况：

```
curl http://localhost:8001/api/v1/proxy/namespaces/kube-system/services/heapster/api/v1/model/namespaces/mem-example/pods/memory-demo/metrics/memory/usage
```

这个输出显示了Pod正在使用162,900,000字节的内存，大概就是150M。这很明显超过了申请
的100M,但是还没达到200M的限制。

```json
{
 "timestamp": "2017-06-20T18:54:00Z",
 "value": 162856960
}
```

删除Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

<!--
## Exceed a Container's memory limit

A Container can exceed its memory request if the Node has memory available. But a Container
is not allowed to use more than its memory limit. If a Container allocates more memory than
its limit, the Container becomes a candidate for termination. If the Container continues to
to consume memory beyond its limit, the Container is terminated. If a terminated Container is
restartable, the kubelet will restart it, as with any other type of runtime failure.

In this exercise, you create a Pod that attempts to allocate more memory than its limit.
Here is the configuration file for a Pod that has one Container. The Container has a
memory request of 50 MiB and a memory limit of 100 MiB.

{% include code.html language="yaml" file="memory-request-limit-2.yaml" ghlink="/docs/tasks/configure-pod-container/memory-request-limit-2.yaml" %}

In the configuration file, in the `args` section, you can see that the Container
will attempt to allocate 250 MiB of memory, which is well above the 100 MiB limit.

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/memory-request-limit-2.yaml --namespace=mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

At this point, the Container might be running, or it might have been killed. If the
Container has not yet been killed, repeat the preceding command until you see that
the Container has been killed:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Get a more detailed view of the Container's status:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

The output shows that the Container has been killed because it is out of memory (OOM).

```shell
lastState:
   terminated:
     containerID: docker://65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

The Container in this exercise is restartable, so the kubelet will restart it. Enter
this command several times to see that the Container gets repeatedly killed and restarted:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

The output shows that the Container gets killed, restarted, killed again, restarted again, and so on:

```
stevepe@sperry-1:~/steveperry-53.github.io$ kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
stevepe@sperry-1:~/steveperry-53.github.io$ kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

View detailed information about the Pod's history:


```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

The output shows that the Container starts and fails repeatedly:


```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container

```

View detailed information about your cluster's Nodes:


```
kubectl describe nodes
```

The output includes a record of the Container being killed because of an out-of-memory condition:

```
Warning OOMKilling  Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Delete your Pod:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```
-->

## 超出容器的内存限制

只要节点有足够的内存资源，那容器就可以使用超过其申请的内存，但是不允许容器使用超过其限制的
资源。如果容器分配了超过限制的内存，这个容器将会被优先结束。如果容器持续使用超过限制的内存，
这个容器就会被终结。如果一个结束的容器允许重启，kubelet就会重启他，但是会出现其他类型的运行错误。

本实验，我们创建一个Pod尝试分配超过其限制的内存，下面的这个Pod的配置文档，它申请50M的内存，
内存限制设置为100M。

{% include code.html language="yaml" file="memory-request-limit-2.yaml" ghlink="/docs/tasks/configure-pod-container/memory-request-limit-2.yaml" %}

在配置文件里的`args`段里，可以看到容器尝试分配250M的内存，超过了限制的100M。

创建Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/memory-request-limit-2.yaml --namespace=mem-example
```

查看Pod的详细信息:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

这时候，容器可能会运行，也可能会被杀掉。如果容器还没被杀掉，重复之前的命令直至
你看到这个容器被杀掉：

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

查看容器更详细的信息:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

这个输出显示了容器被杀掉因为超出了内存限制。

```shell
lastState:
   terminated:
     containerID: docker://65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

本实验里的容器可以自动重启，因此kubelet会再去启动它。输入多几次这个命令看看它是怎么
被杀掉又被启动的：

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

这个输出显示了容器被杀掉，被启动，又被杀掉，又被启动的过程：

```
stevepe@sperry-1:~/steveperry-53.github.io$ kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
stevepe@sperry-1:~/steveperry-53.github.io$ kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

查看Pod的历史详细信息:


```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

这个输出显示了Pod一直重复着被杀掉又被启动的过程:


```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container

```

查看集群里节点的详细信息：


```
kubectl describe nodes
```

输出里面记录了容器被杀掉是因为一个超出内存的状况出现：

```
Warning OOMKilling  Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

删除Pod:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

<!--
## Specify a memory request that is too big for your Nodes

Memory requests and limits are associated with Containers, but it is useful to think
of a Pod as having a memory request and limit. The memory request for the Pod is the
sum of the memory requests for all the Containers in the Pod. Likewise, the memory
limit for the Pod is the sum of the limits of all the Containers in the Pod.

Pod scheduling is based on requests. A Pod is scheduled to run on a Node only if the Node
has enough available memory to satisfy the Pod's memory request.

In this exercise, you create a Pod that has a memory request so big that it exceeds the
capacity of any Node in your cluster. Here is the configuration file for a Pod that has one
Container. The Container requests 1000 GiB of memory, which is likely to exceed the capacity
of any Node in your cluster.

{% include code.html language="yaml" file="memory-request-limit-3.yaml" ghlink="/docs/tasks/configure-pod-container/memory-request-limit-3.yaml" %}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/memory-request-limit-3.yaml --namespace=mem-example
```

View the Pod's status:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

The output shows that the Pod's status is PENDING. That is, the Pod has not been
scheduled to run on any Node, and it will remain in the PENDING state indefinitely:


```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

View detailed information about the Pod, including events:


```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

The output shows that the Container cannot be scheduled because of insufficient memory on the Nodes:


```shell
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```
-->

## 配置超出节点能力范围的内存申请

内存的申请和限制是针对容器本身的，但是认为Pod也有容器的申请和限制是一个很有帮助的想法。
Pod申请的内存就是Pod里容器申请的内存总和，类似的，Pod的内存限制就是Pod里所有容器的
内存限制的总和。

Pod的调度策略是基于请求的，只有当节点满足Pod的内存申请时，才会将Pod调度到合适的节点上。

在这个实验里，我们创建一个申请超大内存的Pod，超过了集群里任何一个节点的可用内存资源。
这个容器申请了1000G的内存，这个应该会超过你集群里能提供的数量。

{% include code.html language="yaml" file="memory-request-limit-3.yaml" ghlink="/docs/tasks/configure-pod-container/memory-request-limit-3.yaml" %}

创建Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/memory-request-limit-3.yaml --namespace=mem-example
```

查看Pod的状态:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

输出显示Pod的状态是Pending，因为Pod不会被调度到任何节点，所有它会一直保持在Pending状态下。

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

查看Pod的详细信息包括事件记录

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

这个输出显示容器不会被调度因为节点上没有足够的内存：

```shell
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

```shell
128974848, 129e6, 129M , 123Mi
```

Delete your Pod:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```
-->

## 内存单位

内存资源是以字节为单位的，可以表示为纯整数或者固定的十进制数字，后缀可以是E, P, T, G, M,
 K, Ei, Pi, Ti, Gi, Mi, Ki.比如，下面几种写法表示相同的数值：alue:

```shell
128974848, 129e6, 129M , 123Mi
```

删除Pod:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

<!--
## If you don’t specify a memory limit

If you don’t specify a memory limit for a Container, then one of these situations applies:

* The Container has no upper bound on the amount of memory it uses. The Container
could use all of the memory available on the Node where it is running.

* The Container is running in a namespace that has a default memory limit, and the
Container is automatically assigned the default limit. Cluster administrators can use a
[LimitRange](https://kubernetes.io/docs/api-reference/v1.6/)
to specify a default value for the memory limit.
-->

## 如果不配置内存限制

如果不给容器配置内存限制，那下面的任意一种情况可能会出现：

* 容器使用内存资源没有上限，容器可以使用当前节点上所有可用的内存资源。

* 容器所运行的命名空间有默认内存限制，容器会自动继承默认的限制。集群管理员可以使用这个文档
[LimitRange](https://kubernetes.io/docs/api-reference/v1.6/)来配置默认的内存限制。

<!--
## Motivation for memory requests and limits

By configuring memory requests and limits for the Containers that run in your
cluster, you can make efficient use of the memory resources available on your cluster's
Nodes. By keeping a Pod's memory request low, you give the Pod a good chance of being
scheduled. By having a memory limit that is greater than the memory request, you accomplish two things:

* The Pod can have bursts of activity where it makes use of memory that happens to be available.
* The amount of memory a Pod can use during a burst is limited to some reasonable amount.

## Clean up

Delete your namespace. This deletes all the Pods that you created for this task:

```shell
kubectl delete namespace mem-example
```

{% endcapture %}

{% capture whatsnext %}
-->

## 内存申请和限制的原因

通过配置容器的内存申请和限制，你可以更加有效充分的使用集群里内存资源。配置较少的内存申请，
可以让Pod跟任意被调度。设置超过内存申请的限制，可以达到以下效果：

* Pod可以在负载高峰时更加充分利用内存。
* 可以将Pod的内存使用限制在比较合理的范围。

## 清理

删除命名空间，这会顺便删除命名空间里的Pod。

```shell
kubectl delete namespace mem-example
```

{% endcapture %}

{% capture whatsnext %}

<!--
### For app developers

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

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
-->

### 对于应用开发者

* [给容器和Pod分配内存资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [配置Pod的QoS](/docs/tasks/configure-pod-container/quality-service-pod/)

### 对于集群管理者

* [配置命名空间默认的内存申请和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [配置命名空间的默认CPU申请和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [配置命名空间最大和最新的内存资源](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [配置命名空间最大和最小的CPU资源](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [配置命名空间CPU和内存限额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [配置命名空间的Pod限额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [配置API对象的限额](/docs/tasks/administer-cluster/quota-api-object/)

{% endcapture %}


{% include templates/task.md %}