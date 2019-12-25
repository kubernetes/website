---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: 调试 Init 容器
content_template: templates/task
---

<!--
---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Debug Init Containers
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page shows how to investigate problems related to the execution of
Init Containers. The example command lines below refer to the Pod as
  `<pod-name>` and the Init Containers as `<init-container-1>` and
  `<init-container-2>`.
-->

此页显示如何核查与 init 容器执行相关的问题。
下面的示例命令行将 Pod 称为 `<pod-name>`，而 init 容器称为 `<init-container-1>` 和 `<init-container-2>`。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* You should be familiar with the basics of
  [Init Containers](/docs/concepts/abstractions/init-containers/).
* You should have [Configured an Init Container](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container/).
-->

* 您应该熟悉 [Init 容器](/docs/concepts/abstractions/init-containers/)的基础知识。
* 您应该已经[配置好一个 Init 容器](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container/)。

{{% /capture %}}

{{% capture steps %}}

<!--
## Checking the status of Init Containers

Display the status of your pod:
-->

## 检查 Init 容器的状态

显示你的 Pod 的状态：

```shell
kubectl get pod <pod-name>
```

<!--
For example, a status of `Init:1/2` indicates that one of two Init Containers
has completed successfully:
-->

例如，状态 `Init:1/2` 表明两个 Init 容器中的一个已经成功完成：

```
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

<!--
See [Understanding Pod status](#understanding-pod-status) for more examples of
status values and their meanings.
-->

更多状态值及其含义请参考[了解 Pod 的状态](#understanding-pod-status)。

<!--
## Getting details about Init Containers
-->

## 获取 Init 容器详情

<!--
View more detailed information about Init Container execution:
-->

查看 Init 容器运行的更多详情：

```shell
kubectl describe pod <pod-name>
```

<!--
For example, a Pod with two Init Containers might show the following:
-->

例如，对于包含两个 Init 容器的 Pod 应该显示如下信息：

```
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

<!--
You can also access the Init Container statuses programmatically by reading the
`status.initContainerStatuses` field on the Pod Spec:
-->

您还可以通过读取 Pod Spec 上的 `status.initContainerStatuses` 字段以编程方式了解 Init 容器的状态：

```shell
kubectl get pod nginx --template '{{.status.initContainerStatuses}}'
```

<!--
This command will return the same information as above in raw JSON.
-->

此命令将返回与原始 JSON 中相同的信息.

<!--
## Accessing logs from Init Containers
-->

## 通过 Init 容器访问日志

<!--
Pass the Init Container name along with the Pod name
to access its logs.
-->

一起传递 Init 容器名称与 Pod 名称来访问它的日志。

```shell
kubectl logs <pod-name> -c <init-container-2>
```

<!--
Init Containers that run a shell script print
commands as they're executed. For example, you can do this in Bash by running
`set -x` at the beginning of the script.
-->

运行 shell 脚本打印命令的init容器,执行 shell 脚本。
例如，您可以在 Bash 中通过在脚本的开头运行 `set -x` 来实现。

{{% /capture %}}

{{% capture discussion %}}

<!--
## Understanding Pod status
-->

## 了解 Pod 的状态

<!--
A Pod status beginning with `Init:` summarizes the status of Init Container
execution. The table below describes some example status values that you might
see while debugging Init Containers.
-->

以 `Init:` 开头的 Pod 状态汇总了 Init 容器执行的状态。
下表介绍调试 Init 容器时可能看到的一些状态值示例。

<!--
Status | Meaning
------ | -------
`Init:N/M` | The Pod has `M` Init Containers, and `N` have completed so far.
`Init:Error` | An Init Container has failed to execute.
`Init:CrashLoopBackOff` | An Init Container has failed repeatedly.
`Pending` | The Pod has not yet begun executing Init Containers.
`PodInitializing` or `Running` | The Pod has already finished executing Init Containers.
-->

状态 | 含义
------ | -------
`Init:N/M` | Pod 包含 `M` 个 Init 容器，其中 `N` 个已经运行完成。
`Init:Error` | Init 容器已执行失败。
`Init:CrashLoopBackOff` | Init 容器反复执行失败。
`Pending` | Pod 还没有开始执行 Init 容器。
`PodInitializing` or `Running` | Pod 已经完成执行 Init 容器。

{{% /capture %}}

