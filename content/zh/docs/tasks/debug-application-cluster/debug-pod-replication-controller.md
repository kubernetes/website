---
reviewers:
- bprashanth
title: 调试 Pods 和 Replication Controllers
content_type: task
---
<!-- 
---
reviewers:
- bprashanth
title: Debug Pods and ReplicationControllers
content_type: task
--- 
-->

<!-- overview -->

<!-- 
This page shows how to debug Pods and ReplicationControllers. 
-->
此页面告诉您如何调试 Pod 和 ReplicationController。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- 
* You should be familiar with the basics of
  [Pods](/docs/concepts/workloads/pods/pod/) and [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/). 
-->
* 您应该先熟悉
  [Pods](/docs/concepts/workloads/pods/pod/) 和 [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) 的基础概念。 



<!-- steps -->

<!-- 
## Debugging Pods 
-->
## 调试 Pod

<!-- 
The first step in debugging a pod is taking a look at it. Check the current
state of the pod and recent events with the following command: 
-->

调试一个 pod 的第一步是观察它。使用下面的命令检查这个 pod 的当前状态和最近事件：

```shell
kubectl describe pods ${POD_NAME}
```

<!-- 
Look at the state of the containers in the pod. Are they all `Running`?  Have
there been recent restarts?

Continue debugging depending on the state of the pods. 
-->
看看 pod 中的容器的状态。他们都是 `Running` 吗？有最近重启了吗？

根据 pod 的状态继续调试。

<!-- 
### My pod stays pending 
-->
### 我的 Pod 卡在 Pending

<!-- 
If a pod is stuck in `Pending` it means that it can not be scheduled onto a
node. Generally this is because there are insufficient resources of one type or
another that prevent scheduling. Look at the output of the `kubectl describe
...` command above. There should be messages from the scheduler about why it
can not schedule your pod. Reasons include: 
-->
如果一个 pod 被卡在 `Pending` 状态，就意味着它不能调度在某个节点上。一般来说，这是因为某种类型的资源不足而
阻止调度。 看看上面的命令 `kubectl describe ...` 的输出。调度器的消息中应该会包含无法调度 Pod 的原因。
原因包括：

<!-- 
#### Insufficient resources 
-->
#### 资源不足

<!-- 
You may have exhausted the supply of CPU or Memory in your cluster. In this
case you can try several things:

* [Add more nodes](/docs/admin/cluster-management/#resizing-a-cluster) to the cluster.

* [Terminate unneeded pods](/docs/user-guide/pods/single-container/#deleting_a_pod)
  to make room for pending pods.

* Check that the pod is not larger than your nodes. For example, if all
  nodes have a capacity of `cpu:1`, then a pod with a request of `cpu: 1.1`
  will never be scheduled.

    You can check node capacities with the `kubectl get nodes -o <format>`
    command. Here are some example command lines that extract just the necessary
    information: 
-->
您可能已经耗尽了集群中供应的 CPU 或内存。在这个情况下你可以尝试几件事情：

* [添加更多节点](/docs/admin/cluster-management/#resizing-a-cluster) 到集群。

* [终止不需要的 pod](/docs/user-guide/pods/single-container/#deleting_a_pod)
  为 pending 中的 pod 提供空间。

* 检查该 pod 是否不大于您的节点。例如，如果全部节点具有 `cpu:1` 容量，那么具有 `cpu: 1.1` 请求的 pod 永远不会被调度。

    您可以使用 `kubectl get nodes -o <format>` 命令来检查节点容量。
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
  可以考虑配置 [资源配额](/docs/concepts/policy/resource-quotas/) 来限制可耗用的资源总量。如果与命名空间一起使用，它可以防止一个团队吞噬所有的资源。

<!-- 
#### Using hostPort 
-->
#### 使用hostPort

<!-- 
When you bind a pod to a `hostPort` there are a limited number of places that
the pod can be scheduled. In most cases, `hostPort` is unnecessary; try using a
service object to expose your pod. If you do require `hostPort` then you can
only schedule as many pods as there are nodes in your container cluster. 
-->
当你将一个 pod 绑定到一个 `hostPort` 时，这个 pod 能被调度的位置数量有限。
在大多数情况下，`hostPort` 是不必要的; 尝试使用服务对象来暴露您的 pod。
如果你需要 `hostPort`，那么你可以调度的 Pod 数量不能超过集群的节点个数。

<!-- 
### My pod stays waiting 
-->
### 我的 Pod 一直在 Waiting

<!-- 
If a pod is stuck in the `Waiting` state, then it has been scheduled to a
worker node, but it can't run on that machine. Again, the information from
`kubectl describe ...` should be informative. The most common cause of
`Waiting` pods is a failure to pull the image. There are three things to check: 

* Make sure that you have the name of the image correct.
* Have you pushed the image to the repository?
* Run a manual `docker pull <image>` on your machine to see if the image can be
  pulled.
-->
如果一个 pod 被卡在 `Waiting` 状态，那么它已被调度在某个工作节点，但它不能在该机器上运行。
再次，来自 `kubectl describe ...` 的内容应该是可以提供信息的。
最常见的原因 `Waiting` 的 pod 是无法拉取镜像。有三件事要检查：

* 确保您的镜像的名称正确。
* 您是否将镜像推送到存储库？
* 在您的机器上手动运行 `docker pull <image>`，看看是否可以拉取镜像。


<!-- 
### My pod is crashing or otherwise unhealthy 

First, take a look at the logs of the current container:

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

If your container has previously crashed, you can access the previous
container's crash log with:

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

Alternately, you can run commands inside that container with `exec`:

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```
-->
### 我的 Pod 一直 Crashing 或者有别的不健康状态

首先，查看当前容器的日志：

    $ kubectl logs ${POD_NAME} ${CONTAINER_NAME}

如果您的容器先前已崩溃，则可以访问上一个容器的崩溃日志：

    $ kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}

或者，您可以使用 `exec` 在该容器内运行命令：

    $ kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}


<!-- 
{{< note >}}
`-c ${CONTAINER_NAME}` is optional. You can omit it for pods that
only contain a single container.
{{< /note >}} 
-->
{{< note >}}
`-c ${CONTAINER_NAME}` 是可选的，对于只包含一个容器的 pod 可以省略。
{{< /note >}} 

<!-- 
As an example, to look at the logs from a running Cassandra pod, you might run: 
-->
例如，要查看正在运行的Cassandra pod的日志，可以运行：

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

<!-- 
If none of these approaches work, you can find the host machine that the pod is
running on and SSH into that host. 
-->
如果这些方法都不起作用，您可以找到该运行 pod 所在的主机并 SSH 到该主机。

<!-- 
## Debugging ReplicationControllers 
-->
## 调试 Replication Controller

<!-- 
ReplicationControllers are fairly straightforward. They can either create pods
or they can't. If they can't create pods, then please refer to the
[instructions above](#debugging-pods) to debug your pods. 
-->
Replication Controller 相当简单。他们只会能或不能创建 pod。如果他们无法创建 pod，那么请参考
[上面的说明](#debugging_pods) 来调试你的pod。

<!-- 
You can also use `kubectl describe rc ${CONTROLLER_NAME}` to inspect events
related to the replication controller. 
-->
您也可以使用`kubectl describe rc ${CONTROLLER_NAME}`来检查和Replication Controllers有关的事件。


