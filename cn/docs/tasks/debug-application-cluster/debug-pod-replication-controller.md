---
标题：调试Pods和Replication Controllers
---

* TOC
{:toc}

##调试pods

调试一个pod的第一步是观察它。检查这个pod的当前状态和最近事件使用下面的命令：

    $ kubectl describe pods ${POD_NAME}

看看pod中的容器的状态。他们都是'Running'吗？有最近重启了吗？

###我的pod保持pending

如果一个pod被卡在'Pending'中，就意味着它不能调度在一个节点上。一般来说，这是因为一种类型或另一种类型的资源不足
阻止调度。 看看'kubectl describe...'上面的命令。应该有来自调度程序的消息关于为什么无法安排您的pod。
理由包括：

####资源不足

您可能已经耗尽了集群中供应的CPU或内存。在这个情况下你可以尝试几件事情：

*[添加更多节点](/docs/admin/cluster-management/#resizing-a-cluster)到集群。

*[终止不需要的pod](/docs/user-guide/pods/single-container/#deleting_a_pod)为pending中的pods提供空间。

*检查该pod是否不大于您的节点。 例如，如果全部节点具有“cpu：1”的容量，然后是具有“cpu：1.1”请求的pod永远不会被调度。

    您可以使用'kubectl get nodes -o <format>'命令来检查节点容量。以下是一些示例命令行，
    只提取必要的信息：

      kubectl get nodes -o yaml | grep '\sname\|cpu\|memory'
      kubectl get nodes -o json | jq '.items[] | {name: .metadata.name, cap: .status.capacity}'

  [资源配额](/docs/concepts/policy/resource-quotas/)
  功能可以配置为限制可消耗资源的总量。如果与命名空间一起使用，它可以防止一个团队吞噬所有的资源。

####使用hostPort

当你将一个pod绑定到一个'hostPort'时，这个pod能被调度的位置数量有限。
在大多数情况下，'hostPort'是不必要的; 尝试使用服务对象来暴露您的pod。
如果你需要'hostPort'，那么你可以只调度与容器集群中的节点一样多的pod。

###我的pod保持waiting

如果一个pod被卡在'Waiting'状态，那么它已被调度在一个工作节点，但它不能在该机器上运行。
再次，来自'kubectl describe ...'的内容应该是可以提供信息的。
最常见的原因'Waiting'的pod是无法拉取镜像。有三件事要检查：

###我的pod是crashing或其他不健康的

首先，查看当前容器的日志：

    $ kubectl logs ${POD_NAME} ${CONTAINER_NAME}

如果您的容器先前已崩溃，则可以访问上一个容器的崩溃日志：

    $ kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}

或者，您可以使用'exec'在该容器内运行命令：

    $ kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}

请注意，'-c $ {CONTAINER_NAME}'是可选的，对于pod只包含一个容器可以省略。

例如，要查看正在运行的Cassandra pod的日志，可以运行：

    $ kubectl exec cassandra -- cat /var/log/cassandra/system.log

如果这些方法都不起作用，您可以找到该运行pod所在的主机并SSH到该主机。

##调试Replication Controllers

Replication Controllers相当简单。他们能或不能创建pod。如果他们无法创建pod，那么请参考
（上面的说明）（＃debugging_pods）来调试你的pod。
