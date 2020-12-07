---
title: 调试运行中的 Pod
content_type: task
---

<!-- overview -->
<!--
This page explains how to debug Pods running (or crashing) on a Node.
-->
本页解释如何在节点上调试运行中（或崩溃）的 Pod。

## {{% heading "prerequisites" %}}

<!--
* Your {{< glossary_tooltip text="Pod" term_id="pod" >}} should already be
  scheduled and running. If your Pod is not yet running, start with [Troubleshoot
  Applications](/docs/tasks/debug-application-cluster/debug-application/).
* For some of the advanced debugging steps you need to know on which Node the
  Pod is running and have shell access to run commands on that Node. You don't
  need that access to run the standard debug steps that use `kubectl`.
-->
* 你的 {{< glossary_tooltip text="Pod" term_id="pod" >}} 应该已经被调度并正在运行中，
  如果你的 Pod 还没有运行，请参阅
  [应用问题排查](/zh/docs/tasks/debug-application-cluster/debug-application/)。

* 对于一些高级调试步骤，你应该知道 Pod 具体运行在哪个节点上，在该节点上有权限去运行一些命令。
  你不需要任何访问权限就可以使用 `kubectl` 去运行一些标准调试步骤。

<!-- steps -->

<!--
## Examining pod logs {#examine-pod-logs}

First, look at the logs of the affected container:

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

If your container has previously crashed, you can access the previous container's crash log with:

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```
-->
## 检查 Pod 的日志 {#examine-pod-logs}

首先，查看受到影响的容器的日志：

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

如果你的容器之前崩溃过，你可以通过下面命令访问之前容器的崩溃日志：

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

<!--
## Debugging with container exec {#container-exec}

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

As an example, to look at the logs from a running Cassandra pod, you might run

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

You can run a shell that's connected to your terminal using the `-i` and `-t`
arguments to `kubectl exec`, for example:

```shell
kubectl exec -it cassandra -- sh
```

For more details, see [Get a Shell to a Running Container](
/docs/tasks/debug-application-cluster/get-shell-running-container/).
-->
## 使用容器 exec 进行调试 {#container-exec}

如果 {{< glossary_tooltip text="容器镜像" term_id="image" >}} 包含调试程序，
比如从 Linux 和 Windows 操作系统基础镜像构建的镜像，你可以使用 `kubectl exec` 命令
在特定的容器中运行一些命令：

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```
{{< note >}}
`-c ${CONTAINER_NAME}` 是可选择的。如果Pod中仅包含一个容器，就可以忽略它。
{{< /note >}}

例如，要查看正在运行的 Cassandra pod中的日志，可以运行：

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

你可以在 `kubectl exec` 命令后面加上 `-i` 和 `-t` 来运行一个连接到你的终端的 Shell，比如：

```shell
kubectl exec -it cassandra -- sh
```

若要了解更多内容，可查看[获取正在运行容器的 Shell](/zh/docs/tasks/debug-application-cluster/get-shell-running-container/)。

<!--
## Debugging with an ephemeral debug container {#ephemeral-container}

{{< feature-state state="alpha" for_k8s_version="v1.18" >}}

{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}}
are useful for interactive troubleshooting when `kubectl exec` is insufficient
because a container has crashed or a container image doesn't include debugging
utilities, such as with [distroless images](
https://github.com/GoogleContainerTools/distroless). `kubectl` has an alpha
command that can create ephemeral containers for debugging beginning with version
`v1.18`.
-->
## 使用临时调试容器来进行调试 {#ephemeral-container}

{{< feature-state state="alpha" for_k8s_version="v1.18" >}}

当由于容器崩溃或容器镜像不包含调试程序（例如[无发行版镜像](https://github.com/GoogleContainerTools/distroless)等）
而导致 `kubectl exec` 无法运行时，{{< glossary_tooltip text="临时容器" term_id="ephemeral-container" >}}对于排除交互式故障很有用。

<!--
### Example debugging using ephemeral containers {#ephemeral-container-example}

The examples in this section require the `EphemeralContainers` [feature gate](
/docs/reference/command-line-tools-reference/feature-gates/) enabled in your
cluster and `kubectl` version v1.18 or later.

You can use the `kubectl alpha debug` command to add ephemeral containers to a
running Pod. First, create a pod for the example:

```shell
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
```

This section use the `pause` container image in examples because it does not
contain userland debugging utilities, but this method works with all container
images.
-->
## 使用临时容器来调试的例子 {#ephemeral-container-example}

{{< note >}}
本示例需要你的集群已经开启 `EphemeralContainers`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)，
`kubectl` 版本为 v1.18 或者更高。
{{< /note >}}

你可以使用 `kubectl alpha debug` 命令来给正在运行中的 Pod 增加一个临时容器。
首先，像示例一样创建一个 pod：

```shell
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
```

{{< note >}}
本节示例中使用 `pause` 容器镜像，因为它不包含任何用户级调试程序，但是这个方法适用于所有容器镜像。
{{< /note >}}

<!--
If you attempt to use `kubectl exec` to create a shell you will see an error
because there is no shell in this container image.

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

You can instead add a debugging container using `kubectl alpha debug`. If you
specify the `-i`/`--interactive` argument, `kubectl` will automatically attach
to the console of the Ephemeral Container.

```shell
kubectl alpha debug -it ephemeral-demo --image=busybox --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```
-->
如果你尝试使用 `kubectl exec` 来创建一个 shell，你将会看到一个错误，因为这个容器镜像中没有 shell。

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

你可以改为使用 `kubectl alpha debug` 添加调试容器。
如果你指定 `-i` 或者 `--interactive` 参数，`kubectl` 将自动挂接到临时容器的控制台。

```shell
kubectl alpha debug -it ephemeral-demo --image=busybox --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

<!--
This command adds a new busybox container and attaches to it. The `--target`
parameter targets the process namespace of another container. It's necessary
here because `kubectl run` does not enable [process namespace sharing](
/docs/tasks/configure-pod-container/share-process-namespace/) in the pod it
creates.

The `--target` parameter must be supported by the {{< glossary_tooltip
text="Container Runtime" term_id="container-runtime" >}}. When not supported,
the Ephemeral Container may not be started, or it may be started with an
isolated process namespace.

You can view the state of the newly created ephemeral container using `kubectl describe`:
-->
此命令添加一个新的 busybox 容器并将其挂接到该容器。`--target` 参数指定另一个容器的进程命名空间。
这是必需的，因为 `kubectl run` 不能在它创建的pod中启用
[共享进程命名空间](/zh/docs/tasks/configure-pod-container/share-process-namespace/)。

{{< note >}}
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}必须支持`--target`参数。
如果不支持，则临时容器可能不会启动，或者可能使用隔离的进程命名空间启动。
{{< /note >}}

你可以使用 `kubectl describe` 查看新创建的临时容器的状态：

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

<!--
Use `kubectl delete` to remove the Pod when you're finished:
-->
使用 `kubectl delete` 来移除已经结束掉的 Pod：

```shell
kubectl delete pod ephemeral-demo
```

<!--
Planned future sections include:

* Debugging with a copy of the pod

See https://git.k8s.io/enhancements/keps/sig-cli/20190805-kubectl-debug.md
-->

<!--
## Debugging via a shell on the node {#node-shell-session}

If none of these approaches work, you can find the host machine that the pod is
running on and SSH into that host, but this should generally not be necessary
given tools in the Kubernetes API. Therefore, if you find yourself needing to
ssh into a machine, please file a feature request on GitHub describing your use
case and why these tools are insufficient.
-->
## 在节点上通过 shell 来调试 {#node-shell-session}

如果这些方法都不起作用，你可以找到运行 Pod 的主机并通过 SSH 进入该主机，
但是如果使用 Kubernetes API 中的工具，则通常不需要这样做。
因此，如果你发现自己需要使用 ssh 进入主机，请在GitHub 上提交功能请求，
以描述你的用例以及这些工具不足的原因。
