<!--
---
title: Configure Quality of Service for Pods
---


{% capture overview %}

This page shows how to configure Pods so that they will be assigned particular
Quality of Service (QoS) classes. Kubernetes uses QoS classes to make decisions about
scheduling and evicting Pods.

{% endcapture %}


{% capture prerequisites %}
-->
---
title: 给 Pod 配置服务质量等级
---


{% capture overview %}

这篇教程指导如何给 Pod 配置特定的服务质量（QoS）等级。Kubernetes 使用 QoS 等级来确定何时调度和终结 Pod 。

{% endcapture %}


{% capture prerequisites %}
<!--
{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## QoS classes

When Kubernetes creates a Pod it assigns one of these QoS classes to the Pod:

* Guaranteed
* Burstable
* BestEffort
-->
{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## QoS 等级

当 Kubernetes 创建一个 Pod 时，它就会给这个 Pod 分配一个 QoS 等级：

* Guaranteed
* Burstable
* BestEffort

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace qos-example
```
-->
## 创建一个命名空间

创建一个命名空间，以便将我们实验需求的资源与集群其他资源隔离开。

```shell
kubectl create namespace qos-example
```
<!--
## Create a Pod that gets assigned a QoS class of Guaranteed

For a Pod to be given a QoS class of Guaranteed:

* Every Container in the Pod must have a memory limit and a memory request, and they must be the same.
* Every Container in the Pod must have a cpu limit and a cpu request, and they must be the same.

Here is the configuration file for a Pod that has one Container. The Container has a memory limit and a
memory request, both equal to 200 MiB. The Container has a cpu limit and a cpu request, both equal to 700 millicpu:

{% include code.html language="yaml" file="qos-pod.yaml" ghlink="/docs/tasks/configure-pod-container/qos-pod.yaml" %}
-->

## 创建一个 Pod 并分配 QoS 等级为 Guaranteed

想要给 Pod 分配 QoS 等级为 Guaranteed:

* Pod 里的每个容器都必须有内存限制和请求，而且必须是一样的。
* Pod 里的每个容器都必须有 CPU 限制和请求，而且必须是一样的。

这是一个含有一个容器的 Pod 的配置文件。这个容器配置了内存限制和请求，都是200MB。它还有
CPU 限制和请求，都是700 millicpu:

{% include code.html language="yaml" file="qos-pod.yaml" ghlink="/docs/tasks/configure-pod-container/qos-pod.yaml" %}

<!--
Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/qos-pod.yaml --namespace=qos-example
```

View detailed information about the Pod:

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

The output shows that Kubernetes gave the Pod a QoS class of Guaranteed. The output also
verifies that the Pod's Container has a memory request that matches its memory limit, and it has
a cpu request that matches its cpu limit.

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
-->
创建 Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/qos-pod.yaml --namespace=qos-example
```

查看 Pod 的详细信息:

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

输出显示了 Kubernetes 给 Pod 配置的 QoS 等级为 Guaranteed 。也验证了容器的内存和 CPU 的限制都满足了它的请求。

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

<!--
**Note:** If a Container specifies its own memory limit, but does not specify a memory request, Kubernetes
automatically assigns a memory request that matches the limit. Similarly, if a Container specifies its own
cpu limit, but does not specify a cpu request, Kubernetes automatically assigns a cpu request that matches
the limit.
{: .note}

Delete your Pod:

```shell
kubectl delete pod qos-demo --namespace=qos-example
```
-->
**注意:** 如果一个容器配置了内存限制，但是没有配置内存请求，那 Kubernetes 会自动给容器分配一个符合内存限制的请求。
类似的，如果容器有 CPU 限制，但是没有 CPU 请求，Kubernetes 也会自动分配一个符合限制的请求。
{: .note}

删除你的 Pod:

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

<!--
## Create a Pod that gets assigned a QoS class of Burstable

A Pod is given a QoS class of Burstable if:

* The Pod does not meet the criteria for QoS class Guaranteed.
* At least one Container in the Pod has a memory or cpu request.

Here is the configuration file for a Pod that has one Container. The Container has a memory limit of 200 MiB
and a memory request of 100 MiB.

{% include code.html language="yaml" file="qos-pod-2.yaml" ghlink="/docs/tasks/configure-pod-container/qos-pod-2.yaml" %}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/qos-pod-2.yaml --namespace=qos-example
```

View detailed information about the Pod:

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```
-->
## 创建一个 Pod 并分配 QoS 等级为 Burstable

当出现下面的情况时，则是一个 Pod 被分配了 QoS 等级为 Burstable :

* 该 Pod 不满足 QoS 等级 Guaranteed 的要求。
* Pod 里至少有一个容器有内存或者 CPU 请求。

这是 Pod 的配置文件，里面有一个容器。这个容器配置了200MB的内存限制和100MB的内存请求。

{% include code.html language="yaml" file="qos-pod-2.yaml" ghlink="/docs/tasks/configure-pod-container/qos-pod-2.yaml" %}

创建 Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/qos-pod-2.yaml --namespace=qos-example
```

查看 Pod 的详细信息:

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```
<!--
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
-->
输出显示了 Kubernetes 给这个 Pod 配置了 QoS 等级为 Burstable.

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

删除你的 Pod:

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```
<!--
## Create a Pod that gets assigned a QoS class of BestEffort

For a Pod to be given a QoS class of BestEffort, the Containers in the Pod must not
have any memory or cpu limits or requests.

Here is the configuration file for a Pod that has one Container. The Container has no memory or cpu
limits or requests:

{% include code.html language="yaml" file="qos-pod-3.yaml" ghlink="/docs/tasks/configure-pod-container/qos-pod-3.yaml" %}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/qos-pod-3.yaml --namespace=qos-example
```
-->
## 创建一个 Pod 并分配 QoS 等级为 BestEffort

要给一个 Pod 配置 BestEffort 的 QoS 等级, Pod 里的容器必须没有任何内存或者 CPU　的限制或请求。

下面是一个　Pod　的配置文件，包含一个容器。这个容器没有内存或者 CPU 的限制或者请求：

{% include code.html language="yaml" file="qos-pod-3.yaml" ghlink="/docs/tasks/configure-pod-container/qos-pod-3.yaml" %}

创建 Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/qos-pod-3.yaml --namespace=qos-example
```
<!--
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
-->
查看 Pod 的详细信息:

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

输出显示了 Kubernetes 给 Pod 配置的 QoS 等级是 BestEffort.

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
  qosClass: BestEffort
```

删除你的 Pod:

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```
<!--
## Create a Pod that has two Containers

Here is the configuration file for a Pod that has two Containers. One container specifies a memory
request of 200 MiB. The other Container does not specify any requests or limits.

{% include code.html language="yaml" file="qos-pod-4.yaml" ghlink="/docs/tasks/configure-pod-container/qos-pod-4.yaml" %}

Notice that this Pod meets the criteria for QoS class Burstable. That is, it does not meet the
criteria for QoS class Guaranteed, and one of its Containers has a memory request.

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/qos-pod-4.yaml --namespace=qos-example
```

View detailed information about the Pod:

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```
-->
## 创建一个拥有两个容器的 Pod 

这是一个含有两个容器的 Pod 的配置文件，其中一个容器指定了内存请求为 200MB ，另外一个没有任何请求或限制。

{% include code.html language="yaml" file="qos-pod-4.yaml" ghlink="/docs/tasks/configure-pod-container/qos-pod-4.yaml" %}

注意到这个 Pod 满足了 QoS 等级 Burstable 的要求. 就是说，它不满足 Guaranteed 的要求，而且其中一个容器有内存请求。

创建 Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/qos-pod-4.yaml --namespace=qos-example
```

查看 Pod 的详细信息:

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```
<!--
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
-->
输出显示了 Kubernetes 给 Pod 配置的 QoS 等级是 Burstable:

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

删除你的 Pod:

```shell
kubectl delete pod qos-demo-4 --namespace=qos-example
```
<!--
## Clean up

Delete your namespace:

```shell
kubectl delete namespace qos-example
```
-->
## 清理

删除你的 namespace:

```shell
kubectl delete namespace qos-example
```
<!--
{% endcapture %}

{% capture whatsnext %}


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
{% endcapture %}


{% include templates/task.md %}
-->
{% endcapture %}

{% capture whatsnext %}


### 对于应用开发者

* [给容器或者 Pod  分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [给容器或者 Pod  分配 CPU 资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### 对于集群管理者

* [给命名空间配置默认的内存请求和限制](/docs/tasks/administer-cluster/memory-default-namespace/)

* [给命名空间配置默认的 CPU 请求和限制](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [给命名空间配置最大和最小的内存限制](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [给命名空间配置最大和最小的 CPU 限制](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [给命名空间配置内存和 CPU 限额](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [给命名空间配置 Pod 限额](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [配置 API 对象限额](/docs/tasks/administer-cluster/quota-api-object/)

{% endcapture %}


{% include templates/task.md %}
