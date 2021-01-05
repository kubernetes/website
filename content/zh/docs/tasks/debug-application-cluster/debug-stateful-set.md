---
title: 调试StatefulSet
content_type: task
---

<!-- overview -->
<!--
This task shows you how to debug a StatefulSet.
-->
此任务展示如何调试 StatefulSet。

## {{% heading "prerequisites" %}}

<!--
* You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster.
* You should have a StatefulSet running that you want to investigate.
-->
* 你需要有一个 Kubernetes 集群，已配置好的 kubectl 命令行工具与你的集群进行通信。
* 你应该有一个运行中的 StatefulSet，以便用于调试。

<!-- steps -->

<!--
## Debugging a StatefulSet

In order to list all the pods which belong to a StatefulSet, which have a label `app=myapp` set on them,
you can use the following:
-->
## 调试 StatefulSet   {#debuggin-a-statefulset}

StatefulSet 在创建 Pod 时为其设置了 `app=myapp` 标签，列出仅属于某 StatefulSet
的所有 Pod 时，可以使用以下命令：

```shell
kubectl get pods -l app=myapp
```

<!--
If you find that any Pods listed are in `Unknown` or `Terminating` state for an extended period of time,
refer to the [Deleting StatefulSet Pods](/docs/tasks/run-application/delete-stateful-set/) task for
instructions on how to deal with them.
You can debug individual Pods in a StatefulSet using the
[Debugging Pods](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/) guide.
-->
如果你发现列出的任何 Pod 长时间处于 `Unknown` 或 `Terminating` 状态，请参阅
[删除 StatefulSet Pods](/zh/docs/tasks/run-application/delete-stateful-set/)
了解如何处理它们的说明。
你可以参考[调试 Pods](/zh/docs/tasks/debug-application-cluster/debug-pod-replication-controller/)
来调试 StatefulSet 中的各个 Pod。

## {{% heading "whatsnext" %}}

<!--
Learn more about [debugging an init-container](/docs/tasks/debug-application-cluster/debug-init-containers/).
-->
* 进一步了解如何[调试 Init 容器](/zh/docs/tasks/debug-application-cluster/debug-init-containers/)

