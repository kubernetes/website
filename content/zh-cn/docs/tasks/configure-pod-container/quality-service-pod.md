---
title: 配置 Pod 的服务质量
content_type: task
weight: 30
---

<!--
title: Configure Quality of Service for Pods
content_type: task
weight: 30
-->

<!-- overview -->

<!--
This page shows how to configure Pods so that they will be assigned particular
Quality of Service (QoS) classes. Kubernetes uses QoS classes to make decisions about
scheduling and evicting Pods.
-->
本页介绍怎样配置 Pod 让其获得特定的服务质量（QoS）类。Kubernetes 使用 QoS 类来决定 Pod 的调度和驱逐策略。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## QoS classes

When Kubernetes creates a Pod it assigns one of these QoS classes to the Pod:
-->
## QoS 类  {#qos-classes}

Kubernetes 创建 Pod 时就给它指定了下列一种 QoS 类：

* Guaranteed
* Burstable
* BestEffort

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->

## 创建命名空间

创建一个命名空间，以便将本练习所创建的资源与集群的其余资源相隔离。

```shell
kubectl create namespace qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of Guaranteed

For a Pod to be given a QoS class of Guaranteed:

* Every Container in the Pod must have a memory limit and a memory request.
* For every Container in the Pod, the memory limit must equal the memory request.
* Every Container in the Pod must have a CPU limit and a CPU request.
* For every Container in the Pod, the CPU limit must equal the CPU request.

These restrictions apply to init containers and app containers equally.

Here is the configuration file for a Pod that has one Container. The Container has a memory limit and a
memory request, both equal to 200 MiB. The Container has a CPU limit and a CPU request, both equal to 700 milliCPU:
-->
## 创建一个 QoS 类为 Guaranteed 的 Pod

对于 QoS 类为 Guaranteed 的 Pod：

* Pod 中的每个容器都必须指定内存限制和内存请求。
* 对于 Pod 中的每个容器，内存限制必须等于内存请求。
* Pod 中的每个容器都必须指定 CPU 限制和 CPU 请求。
* 对于 Pod 中的每个容器，CPU 限制必须等于 CPU 请求。

这些限制同样适用于初始化容器和应用程序容器。

下面是包含一个容器的 Pod 配置文件。
容器设置了内存请求和内存限制，值都是 200 MiB。
容器设置了 CPU 请求和 CPU 限制，值都是 700 milliCPU：

{{< codenew file="pods/qos/qos-pod.yaml" >}}

<!--
Create the Pod:
-->

创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->

查看 Pod 详情：

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of Guaranteed. The output also
verifies that the Pod Container has a memory request that matches its memory limit, and it has
a CPU request that matches its CPU limit.
-->

结果表明 Kubernetes 为 Pod 配置的 QoS 类为 Guaranteed。
结果也确认了 Pod 容器设置了与内存限制匹配的内存请求，设置了与 CPU 限制匹配的 CPU 请求。

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
status:
  qosClass: Guaranteed
```

{{< note >}}
<!--
If a Container specifies its own memory limit, but does not specify a memory request, Kubernetes
automatically assigns a memory request that matches the limit. Similarly, if a Container specifies its own
CPU limit, but does not specify a CPU request, Kubernetes automatically assigns a CPU request that matches
the limit.
-->
如果容器指定了自己的内存限制，但没有指定内存请求，Kubernetes 会自动为它指定与内存限制匹配的内存请求。
同样，如果容器指定了自己的 CPU 限制，但没有指定 CPU 请求，Kubernetes 会自动为它指定与 CPU 限制匹配的 CPU 请求。
{{< /note >}}

<!--
Delete your Pod:
-->

删除 Pod：

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of Burstable

A Pod is given a QoS class of Burstable if:

* The Pod does not meet the criteria for QoS class Guaranteed.
* At least one Container in the Pod has a memory or CPU request or limit.

Here is the configuration file for a Pod that has one Container. The Container has a memory limit of 200 MiB
and a memory request of 100 MiB.
-->
## 创建一个 QoS 类为 Burstable 的 Pod

如果满足下面条件，将会指定 Pod 的 QoS 类为 Burstable：

* Pod 不符合 Guaranteed QoS 类的标准。
* Pod 中至少一个容器具有内存或 CPU 的请求或限制。

下面是包含一个容器的 Pod 配置文件。
容器设置了内存限制 200 MiB 和内存请求 100 MiB。

{{< codenew file="pods/qos/qos-pod-2.yaml" >}}

<!--
Create the Pod:
-->

创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->

查看 Pod 详情：

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of Burstable.
-->

结果表明 Kubernetes 为 Pod 配置的 QoS 类为 Burstable。

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
status:
  qosClass: Burstable
```

<!--
Delete your Pod:
-->
删除 Pod：

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of BestEffort

For a Pod to be given a QoS class of BestEffort, the Containers in the Pod must not
have any memory or CPU limits or requests.

Here is the configuration file for a Pod that has one Container. The Container has no memory or CPU
limits or requests:
-->
## 创建一个 QoS 类为 BestEffort 的 Pod

对于 QoS 类为 BestEffort 的 Pod，Pod 中的容器必须没有设置内存和 CPU 限制或请求。

下面是包含一个容器的 Pod 配置文件。
容器没有设置内存和 CPU 限制或请求。

{{< codenew file="pods/qos/qos-pod-3.yaml" >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 详情：

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of BestEffort.
-->
结果表明 Kubernetes 为 Pod 配置的 QoS 类为 BestEffort。

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

<!--
Delete your Pod:
-->
删除 Pod：

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

<!--
## Create a Pod that has two Containers

Here is the configuration file for a Pod that has two Containers. One container specifies a memory
request of 200 MiB. The other Container does not specify any requests or limits.
-->
## 创建包含两个容器的 Pod

下面是包含两个容器的 Pod 配置文件。
一个容器指定了内存请求 200 MiB。
另外一个容器没有指定任何请求和限制。

{{< codenew file="pods/qos/qos-pod-4.yaml" >}}

<!--
Notice that this Pod meets the criteria for QoS class Burstable. That is, it does not meet the
criteria for QoS class Guaranteed, and one of its Containers has a memory request.

Create the Pod:
-->
注意此 Pod 满足 Burstable QoS 类的标准。
也就是说它不满足 Guaranteed QoS 类标准，因为它的一个容器设有内存请求。

创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 详情：

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

<!--
The output shows that Kubernetes gave the Pod a QoS class of Burstable:
-->
结果表明 Kubernetes 为 Pod 配置的 QoS 类为 Burstable：

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
status:
  qosClass: Burstable
```

<!--
Delete your Pod:
-->
删除 Pod：

```shell
kubectl delete pod qos-demo-4 --namespace=qos-example
```

<!--
## Clean up

Delete your namespace:
-->
## 环境清理

删除命名空间：

```shell
kubectl delete namespace qos-example
```

## {{% heading "whatsnext" %}}

<!--
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
### 应用开发者参考

* [为 Pod 和容器分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)

* [为 Pod 和容器分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

* [Control Topology Management policies on a node](/docs/tasks/administer-cluster/topology-manager/)
-->

### 集群管理员参考

* [为命名空间配置默认的内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置默认的 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace)

* [为命名空间配置最小和最大内存限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [为命名空间配置最小和最大 CPU 限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [为命名空间配置内存和 CPU 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [为命名空间配置 Pod 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [为 API 对象配置配额](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)

* [控制节点上的拓扑管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)



