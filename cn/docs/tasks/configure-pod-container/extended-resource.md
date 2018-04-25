---
title: 将扩展资源分配给容器
cn-approvers:
- lichuqiang
---
<!--
---
title: Assign Extended Resources to a Container
---
-->

{% capture overview %}

<!--
This page shows how to assign extended resources to a Container.
-->
本文展示了如何将扩展资源分配给容器。

{% include feature-state-stable.md %}

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

<!--
Before you do this exercise, do the exercise in
[Advertise Extended Resources for a Node](/docs/tasks/administer-cluster/extended-resource-node/).
That will configure one of your Nodes to advertise a dongle resource.
-->
在进行这里的练习前，您需要先进行 [为节点发布扩展资源](/docs/tasks/administer-cluster/extended-resource-node/) 中的练习。
在该练习中，您会配置一个节点，使其发布一种 “dongle” 资源。

{% endcapture %}


{% capture steps %}

<!--
## Assign an extended resource to a Pod

To request an extended resource, include the `resources:requests` field in your
Container manifest. Extended resources are fully qualified with any domain outside of
`*.kubernetes.io/`. Valid extended resource names have the form `example.com/foo` where
`example.com` is replaced with your organization's domain and `foo` is a
descriptive resource name.
-->
## 将扩展资源分配给 Pod

为请求扩展资源，您需要在您的容器 manifest 中包含 `resources:requests` 字段。
扩展资源完全限定于 `*.kubernetes.io/` 外的任何域中。
合法的扩展资源名称形如 `example.com/foo`，其中 `example.com` 需要替换为您的组织的域，
`foo` 是一个描述性的资源名称。

<!--
Here is the configuration file for a Pod that has one Container:
-->
这里是拥有一个容器的 Pod 的配置文件：

{% include code.html language="yaml" file="extended-resource-pod.yaml" ghlink="/docs/tasks/configure-pod-container/extended-resource-pod.yaml" %}

<!--
In the configuration file, you can see that the Container requests 3 dongles.

Create a Pod:
-->
在该配置文件中，您可以看到容器请求 3 个 “dongle” 资源。

创建一个 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/extended-resource-pod.yaml
```

<!--
Verify that the Pod is running:
-->
确认 Pod 正在运行：

```shell
kubectl get pod extended-resource-demo
```

<!--
Describe the Pod:
-->
使用 “describe” 命令查看 Pod 详情：

```shell
kubectl describe pod extended-resource-demo
```

<!--
The output shows dongle requests:
-->
输出展示了 “dongle” 资源的请求：

```yaml
Limits:
  example.com/dongle: 3
Requests:
  example.com/dongle: 3
```

<!--
## Attempt to create a second Pod

Here is the configuration file for a Pod that has one Container. The Container requests
two dongles.
-->
## 尝试创建第二个 Pod

这里是拥有一个容器的 Pod 的配置文件。 容器请求两个 “dongle” 资源。

{% include code.html language="yaml" file="extended-resource-pod-2.yaml" ghlink="/docs/tasks/configure-pod-container/extended-resource-pod-2.yaml" %}

<!--
Kubernetes will not be able to satisfy the request for two dongles, because the first Pod
used three of the four available dongles.

Attempt to create a Pod:
-->
Kubernetes 将无法满足两个 “dongle” 资源的请求，因为第一个 Pod 已经占用了四个可用 “dongle” 资源中的三个。

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/extended-resource-pod-2.yaml
```

<!--
Describe the Pod
-->
使用 “describe” 命令查看 Pod 详情：

```shell
kubectl describe pod extended-resource-demo-2
```

<!--
The output shows that the Pod cannot be scheduled, because there is no Node that has
2 dongles available:
-->
输出显示该 Pod 无法被调度，因为没有存在两个可用 “dongle” 资源的节点。


```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (extended-resource-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient example.com/dongle (1)
```

<!--
View the Pod status:
-->
查看 Pod 状态：

```shell
kubectl get pod extended-resource-demo-2
```

<!--
The output shows that the Pod was created, but not scheduled to run on a Node.
It has a status of Pending:
-->
输出显示该 Pod 已经被创建，但无法被调度到节点上运行，其状态为 “Pending”：

```yaml
NAME                       READY     STATUS    RESTARTS   AGE
extended-resource-demo-2   0/1       Pending   0          6m
```

<!--
## Clean up

Delete the Pod that you created for this exercise:
-->
## 清理

删除为此练习创建的 Pod：

```shell
kubectl delete pod extended-resource-demo-2
```

{% endcapture %}

{% capture whatsnext %}

<!--
### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
### 针对应用开发人员

* [将内存资源分配给容器和 Pod](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [将 CPU 资源分配给容器和 Pod](/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators

* [Advertise Extended Resources for a Node](/docs/tasks/administer-cluster/extended-resource-node/)
-->
### 针对集群管理员

* [为节点发布扩展资源](/docs/tasks/administer-cluster/extended-resource-node/)

{% endcapture %}


{% include templates/task.md %}



