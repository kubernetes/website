---
title: 调试 Pods 和 ReplicationControllers
content_type: task
---
<!-- 
reviewers:
- bprashanth
title: Debug Pods and ReplicationControllers
content_type: task
-->

<!-- overview -->

<!-- 
This page shows how to debug Pods and ReplicationControllers. 
-->
此页面展示如何调试 Pod 和 ReplicationController。


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- 
* You should be familiar with the basics of
  [Pods](/docs/concepts/workloads/pods/) and [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/). 
-->
* 你应该先熟悉 [Pods](/zh/docs/concepts/workloads/pods/) 和
  [Pod 生命周期](/zh/docs/concepts/workloads/pods/pod-lifecycle/) 的基础概念。 

<!-- steps -->

<!-- 
## Debugging Pods 

The first step in debugging a pod is taking a look at it. Check the current
state of the pod and recent events with the following command: 
-->
## 调试 Pod  {#debugging-pods}

调试一个 pod 的第一步是观察它。使用下面的命令检查 Pod 的当前状态和最近事件：

```shell
kubectl describe pods ${POD_NAME}
```

<!-- 
Look at the state of the containers in the pod. Are they all `Running`?  Have
there been recent restarts?

Continue debugging depending on the state of the pods. 
-->
看看 Pod 中的容器的状态。它们都是 `Running` 吗？最近有重启吗？

根据 Pod 的状态继续调试。

<!-- 
### My pod stays pending 
-->

<!-- 
If a pod is stuck in `Pending` it means that it can not be scheduled onto a
node. Generally this is because there are insufficient resources of one type or
another that prevent scheduling. Look at the output of the `kubectl describe
...` command above. There should be messages from the scheduler about why it
can not schedule your pod. Reasons include: 
-->
### 我的 Pod 停滞在 Pending 状态

如果 Pod 被卡在 `Pending` 状态，就意味着它不能调度在某个节点上。一般来说，这是因为某种类型的资源不足而
导致无法调度。 查看上面的命令 `kubectl describe ...` 的输出。调度器的消息中应该会包含无法调度 Pod 的原因。
原因包括：

<!-- 
#### Insufficient resources 

You may have exhausted the supply of CPU or Memory in your cluster. In this
case you can try several things:

* Add more nodes to the cluster.

* [Terminate unneeded pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
  to make room for pending pods.

* Check that the pod is not larger than your nodes. For example, if all
  nodes have a capacity of `cpu:1`, then a pod with a request of `cpu: 1.1`
  will never be scheduled.

    You can check node capacities with the `kubectl get nodes -o <format>`
    command. Here are some example command lines that extract just the necessary
    information: 
-->
#### 资源不足

你可能已经耗尽了集群中供应的 CPU 或内存。在这个情况下你可以尝试几件事情：

* 向集群中添加节点。

* [终止不需要的 Pod](/zh/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
  为 Pending 状态的 Pod 提供空间。

* 检查该 Pod 是否不大于你的节点。例如，如果全部节点具有 `cpu:1` 容量，那么具有
  请求为 `cpu: 1.1` 的 Pod 永远不会被调度。

  你可以使用 `kubectl get nodes -o <format>` 命令来检查节点容量。
  下面是一些能够提取必要信息的命令示例：

  ```shell
  kubectl get nodes -o yaml | egrep '\sname:|cpu:|memory:'
  kubectl get nodes -o json | jq '.items[] | {name: .metadata.name, cap: .status.capacity}'
  ```

<!-- 
  The [resource quota](/docs/concepts/policy/resource-quotas/)
  feature can be configured to limit the total amount of
  resources that can be consumed. If used in conjunction with namespaces, it can
  prevent one team from hogging all the resources. 
-->
  可以考虑配置[资源配额](/zh/docs/concepts/policy/resource-quotas/) 来限制可耗用的资源总量。
  如果与命名空间一起使用，它可以防止一个团队吞噬所有的资源。

<!-- 
#### Using hostPort 

When you bind a pod to a `hostPort` there are a limited number of places that
the pod can be scheduled. In most cases, `hostPort` is unnecessary; try using a
service object to expose your pod. If you do require `hostPort` then you can
only schedule as many pods as there are nodes in your container cluster. 
-->
#### 使用hostPort

当你将一个 Pod 绑定到某 `hostPort` 时，这个 Pod 能被调度的位置数量有限。
在大多数情况下，`hostPort` 是不必要的; 尝试使用服务对象来暴露你的 Pod。
如果你需要 `hostPort`，那么你可以调度的 Pod 数量不能超过集群的节点个数。

<!-- 
### My pod stays waiting 

If a pod is stuck in the `Waiting` state, then it has been scheduled to a
worker node, but it can't run on that machine. Again, the information from
`kubectl describe ...` should be informative. The most common cause of
`Waiting` pods is a failure to pull the image. There are three things to check: 

* Make sure that you have the name of the image correct.
* Have you pushed the image to the repository?
* Run a manual `docker pull <image>` on your machine to see if the image can be
  pulled.
-->
### 我的 Pod 一直在 Waiting

如果 Pod 一直停滞在 `Waiting` 状态，那么它已被调度在某个工作节点，但它不能在该机器上运行。
再次，来自 `kubectl describe ...` 的内容应该是可以是很有用的。
最常见的原因 `Waiting` 的 Pod 是无法拉取镜像。有三件事要检查：

* 确保你的镜像的名称正确。
* 你是否将镜像推送到存储库？
* 在你的机器上手动运行 `docker pull <image>`，看看是否可以拉取镜像。

<!-- 
### My pod is crashing or otherwise unhealthy 

Once your pod has been scheduled, the methods described in [Debug Running Pods](
/docs/tasks/debug-application-cluster/debug-running-pod/) are available for debugging.
-->
### 我的 Pod 一直 Crashing 或者其他不健康状态

一旦 Pod 已经被调度，就可以依据
[调试运行中的 Pod](/zh/docs/tasks/debug-application-cluster/debug-running-pod/)
展开进一步的调试工作。

<!-- 
## Debugging ReplicationControllers 

ReplicationControllers are fairly straightforward. They can either create pods
or they can't. If they can't create pods, then please refer to the
[instructions above](#debugging-pods) to debug your pods. 
-->
## 调试 Replication Controller

Replication Controller 相当简单。它们或者能或者不能创建 Pod。如果它们无法创建 Pod，
请参考[上面的说明](#debugging_pods) 来调试你的 Pod。

<!-- 
You can also use `kubectl describe rc ${CONTROLLER_NAME}` to inspect events
related to the replication controller. 
-->
你也可以使用 `kubectl describe rc ${CONTROLLER_NAME}` 来检查和副本控制器有关的事件。

