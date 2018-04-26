<!--
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
-->

---
title: 给容器和Pod分配CPU资源
---

{% capture overview %}

这个教程指导如何给容器分配请求的CPU资源和配置CPU资源限制，我们保证容器可以拥有
所申请的CPU资源，但是并不允许它使用超过限制的CPU资源。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

<!--
Each node in your cluster must have at least 1 cpu.

A few of the steps on this page require that the
[Heapster](https://github.com/kubernetes/heapster) service is running
in your cluster. But if you don't have Heapster running, you can do most
of the steps, and it won't be a problem if you skip the Heapster steps.

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
-->

集群里的每个节点至少需要1个CPU。

这篇教程里的少数步骤可能要求你的集群运行着[Heapster](https://github.com/kubernetes/heapster) 
如果你没有Heapster，也可以完成大部分步骤，就算跳过Heapster的那些步骤，也不见得会有什么问题。

判断Heapster服务是否正常运行，执行以下命令：

```shell
kubectl get services --namespace=kube-system
```

如果heapster正常运行，命令的输出应该类似下面这样:

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
kubectl create namespace cpu-example
```
-->

## 创建一个命名空间

创建一个命名空间，可以确保你在这个实验里所创建的资源都会被有效隔离，
不会影响你的集群。

```shell
kubectl create namespace cpu-example
```

<!--
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

Note: There's another possible explanation for the CPU throttling. The Node might not have
enough CPU resources available. Recall that the prerequisites for this exercise require that each of
your Nodes has at least 1 cpu. If your Container is running on a Node that has only 1 cpu, the Container
cannot use more than 1 cpu regardless of the CPU limit specified for the Container.
-->

## 声明一个CPU申请和限制

给容器声明一个CPU请求，只要在容器的配置文件里包含这么一句`resources:requests`就可以，
声明一个CPU限制，则是这么一句`resources:limits`.

在这个实验里，我们会创建一个只有一个容器的Pod，这个容器申请0.5个CPU，并且CPU限制设置为1.
下面是配置文件：

{% include code.html language="yaml" file="cpu-request-limit.yaml" ghlink="/docs/tasks/configure-pod-container/cpu-request-limit.yaml" %}

在这个配置文件里，整个`args`段提供了容器所需的参数。
`-cpus "2"`代码告诉容器尝试使用2个CPU资源。

创建Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/cpu-request-limit.yaml --namespace=cpu-example
```

验证Pod的容器是否正常运行:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

查看Pod的详细信息:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

输出显示了这个Pod里的容器申请了500m的cpu，同时CPU用量限制为1.

```shell
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

启用proxy以便访问heapster服务：

```shell
kubectl proxy
```

在另外一个命令窗口里，从heapster服务读取CPU使用率。

```
curl http://localhost:8001/api/v1/proxy/namespaces/kube-system/services/heapster/api/v1/model/namespaces/cpu-example/pods/cpu-demo/metrics/cpu/usage_rate
```

输出显示Pod目前使用974m的cpu，这个刚好比配置文件里限制的1小一点点。

```json
{
 "timestamp": "2017-06-22T18:48:00Z",
 "value": 974
}
```

还记得我吗设置了`-cpu "2"`, 这样让容器尝试去使用2个CPU，但是容器却只被运行使用1一个，
因为容器的CPU使用被限制了，因为容器尝试去使用超过其限制的CPU资源。

注意: 有另外一个可能的解释为什么CPU会被限制。因为这个节点可能没有足够的CPU资源，还记得我们
这个实验的前提条件是每个节点都有至少一个CPU，如果你的容器所运行的节点只有1个CPU，那容器就无法
使用超过1个的CPU资源，这跟CPU配置上的限制以及没关系了。

<!--
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
-->

## CPU 单位

CPU资源是以CPU单位来计算的，一个CPU，对于Kubernetes而言，相当于:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread on a bare-metal Intel processor with Hyperthreading

小数值也是允许的，一个容器申请0.5个CPU，就相当于其他容器申请1个CPU的一半，你也可以加个后缀m
表示千分之一的概念。比如说100m的CPU，100豪的CPU和0.1个CPU都是一样的。但是不支持精度超过1M的。

CPU通常都是以绝对值来申请的，绝对不能是一个相对的数值；0.1对于单核，双核，48核的CPU都是一样的。

删除Pod:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

<!--
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
-->

## 请求的CPU超出了节点的能力范围

CPU资源的请求和限制是用于容器上面的，但是认为POD也有CPU资源的申请和限制，这种思想会很有帮助。
Pod的CPU申请可以看作Pod里的所有容器的CPU资源申请的总和，类似的，Pod的CPU限制就可以看出Pod里
所有容器的CPU资源限制的总和。

Pod调度是基于请求的，只有当Node的CPU资源可以满足Pod的需求的时候，Pod才会被调度到这个Node上面。

在这个实验当中，我们创建一个Pod请求超大的CPU资源，超过了集群里任何一个node所能提供的资源。
下面这个配置文件，创建一个包含一个容器的Pod。这个容器申请了100个CPU，这应该会超出你集群里
任何一个节点的CPU资源。

{% include code.html language="yaml" file="cpu-request-limit-2.yaml" ghlink="/docs/tasks/configure-pod-container/cpu-request-limit-2.yaml" %}

创建Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/cpu-request-limit-2.yaml --namespace=cpu-example
```

查看Pod的状态:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

这个输出显示Pod正处在Pending状态，那是因为这个Pod并不会被调度到任何节点上，所以它会
一直保持这种状态。

```
kubectl get pod cpu-demo-2 --namespace=cpu-example
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

查看Pod的详细信息，包括记录的事件：

```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

这个输出显示了容器无法被调度因为节点上没有足够的CPU资源：


```shell
Events:
  Reason			Message
  ------			-------
  FailedScheduling	No nodes are available that match all of the following predicates:: Insufficient cpu (3).

```

删除Pod:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

<!--
## If you don’t specify a CPU limit

If you don’t specify a CPU limit for a Container, then one of these situations applies:

* The Container has no upper bound on the CPU resources it can use. The Container
could use all of the CPU resources available on the Node where it is running.

* The Container is running in a namespace that has a default CPU limit, and the
Container is automatically assigned the default limit. Cluster administrators can use a
[LimitRange](https://kubernetes.io/docs/api-reference/v1.6/)
to specify a default value for the CPU limit.
-->

## 如果不指定CPU限额呢

如果你不指定容器的CPU限额，那下面所描述的其中一种情况会出现：

* 容器使用CPU资源没有上限，它可以使用它运行的Node上所有的CPU资源。

* 容器所运行的命名空间有默认的CPU限制，这个容器就自动继承了这个限制。集群管理可以使用
[限额范围](https://kubernetes.io/docs/api-reference/v1.6/) 来指定一个默认的CPU限额。

<!--
## Motivation for CPU requests and limits

By configuring the CPU requests and limits of the Containers that run in your
cluster, you can make efficient use of the CPU resources available on your cluster's
Nodes. By keeping a Pod's CPU request low, you give the Pod a good chance of being
scheduled. By having a CPU limit that is greater than the CPU request, you accomplish two things:

* The Pod can have bursts of activity where it makes use of CPU resources that happen to be available.
* The amount of CPU resources a Pod can use during a burst is limited to some reasonable amount.
-->

## 设置CPU申请和限制的动机

通过配置集群里的容器的CPU资源申请和限制，我们可以更好的利用集群中各个节点的CPU资源。
保持Pod的CPU请求不太高，这样才能更好的被调度。设置一个大于CPU请求的限制，可以获得以下
两点优势：

* Pod 在业务高峰期能获取到足够的CPU资源。
* 能将Pod在需求高峰期能使用的CPU资源限制在合理范围。

<!--
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

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/default-memory-request-limit/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/default-cpu-request-limit/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

{% endcapture %}


{% include templates/task.md %}
-->

## 清理

删除你的命名空间:

```shell
kubectl delete namespace cpu-example
```

{% endcapture %}

{% capture whatsnext %}


### 针对应用开发者的文档

* [给容器和Pod分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [配置Pod的QoS](/docs/tasks/configure-pod-container/quality-service-pod/)

### 针对集群管理者的文档

* [命名空间配置默认内存的请求和限额](/docs/tasks/administer-cluster/default-memory-request-limit/)

* [命名空间配置默认CPU资源请求和限额](/docs/tasks/administer-cluster/default-cpu-request-limit/)

* [配置命名空间最大和最新的内存资源](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [配置命名空间最大和最小的CPU资源](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [配置命名空间CPU和内存限额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [配置命名空间的Pod限额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [配置API对象的限额](/docs/tasks/administer-cluster/quota-api-object/)

{% endcapture %}


{% include templates/task.md %}