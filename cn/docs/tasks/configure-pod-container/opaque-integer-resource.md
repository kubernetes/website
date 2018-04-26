---
title: 将不透明整数资源分配给容器
cn-approvers:
- chentao1596
---
<!--
title: Assign Opaque Integer Resources to a Container
-->

{% capture overview %}

<!--
This page shows how to assign opaque integer resources to a Container.
-->
本页面演示如何将不透明整数资源分配给容器。

{% include feature-state-deprecated.md %}

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

<!--
Before you do this exercise, do the exercise in
[Advertise Opaque Integer Resources for a Node](/docs/tasks/administer-cluster/opaque-integer-resource-node/).
That will configure one of your Nodes to advertise a dongle resource.
-->
在您开始本次练习之前，请先做 [为节点发布不透明整数资源](/docs/tasks/administer-cluster/opaque-integer-resource-node/) 的练习。它将配置您的 Node 去发布 dongle 资源。

{% endcapture %}


{% capture steps %}

<!--
## Assign an opaque integer resource to a Pod
-->
## 将不透明整数资源分配给容器

<!--
To request an opaque integer resource, include the `resources:requests` field in your
Container manifest. Opaque integer resources have the prefix `pod.alpha.kubernetes.io/opaque-int-resource-`.
-->
若想请求不透明整数资源，请在您的容器 manifest 中包含 `resources:requests` 字段。不透明整数资源拥有前缀 `pod.alpha.kubernetes.io/opaque-int-resource-`。

<!--
Here is the configuration file for a Pod that has one Container:
-->
这里有一个 Pod 的配置文件，它有一个容器：

{% include code.html language="yaml" file="oir-pod.yaml" ghlink="/docs/tasks/configure-pod-container/oir-pod.yaml" %}

<!--
In the configuration file, you can see that the Container requests 3 dongles.
-->
在配置文件中，您可以看到容器请求 3 个 dongle。

<!--
Create a Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/oir-pod.yaml
```

<!--
Verify that the Pod is running:
-->
验证 Pod 是 running 状态：

```shell
kubectl get pod oir-demo
```

<!--
Describe the Pod:
-->
使用 describe 查看 Pod 详细信息：

```shell
kubectl describe pod oir-demo
```

<!--
The output shows dongle requests:
-->
输出展示如下请求的 dongle 个数：

```yaml
Requests:
  pod.alpha.kubernetes.io/opaque-int-resource-dongle: 3
```

<!--
## Attempt to create a second Pod
-->
## 尝试创建第二个 Pod

<!--
Here is the configuration file for a Pod that has one Container. The Container requests
two dongles.
-->
这里有一个 Pod 的配置文件，它有一个容器。容器请求 2 个 dongle。

{% include code.html language="yaml" file="oir-pod-2.yaml" ghlink="/docs/tasks/configure-pod-container/oir-pod-2.yaml" %}

<!--
Kubernetes will not be able to satisfy the request for two dongles, because the first Pod
used three of the four available dongles.
-->
Kubernetes 无法满足要求 2 个 dongle 的请求，因为第一个 Pod 已经使用了 4 个可用 dongle 中的 3 个了。

<!--
Attempt to create a Pod:
-->
尝试创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/oir-pod-2.yaml
```

<!--
Describe the Pod
-->
使用 describe 查看 Pod 详细信息：

```shell
kubectl describe pod oir-demo-2
```

<!--
The output shows that the Pod cannot be scheduled, because there is no Node that has
2 dongles available:
-->
输出显示 Pod 无法被调度，因为没有哪个节点拥有至少 2 个可用的 dongle：


```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (oir-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient pod.alpha.kubernetes.io/opaque-int-resource-dongle (1)
```

<!--
View the Pod status:
-->
查看 Pod 状态：

```shell
kubectl get pod oir-demo-2
```

<!--
The output shows that the Pod was created, but not scheduled to run on a Node.
It has a status of Pending:
-->
输出显示 Pod 已经被创建，但是没有调度到 Node 上去运行。它处于 Pending 状态：

```yaml
NAME         READY     STATUS    RESTARTS   AGE
oir-demo-2   0/1       Pending   0          6m
```

<!--
## Clean up
-->
## 清理

<!--
Delete the Pod that you created for this exercise:
-->
删除本次练习中您创建的 Pod：

```shell
kubectl delete pod oir-demo-2
```

{% endcapture %}

{% capture whatsnext %}

<!--
### For application developers
-->
### 对应用开发人员

<!--
* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
* [为容器和 Pod 分配内存资源](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [为容器和 Pod 分配 CPU 资源](/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators
-->
### 对集群管理员

<!--
* [Advertise Opaque Integer Resources for a Node](/docs/tasks/administer-cluster/opaque-integer-resource-node/)
-->
* [为节点发布不透明整数资源](/docs/tasks/administer-cluster/opaque-integer-resource-node/)

{% endcapture %}


{% include templates/task.md %}



