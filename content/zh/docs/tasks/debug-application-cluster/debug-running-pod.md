---
title: 调试运行中的 Pod
content_type: task
---
<!--
reviewers:
- verb
- soltysh
title: Debug Running Pods
content_type: task
-->

<!-- overview -->

<!-- 
This page explains how to debug Pods running (or crashing) on a Node.
-->
本页解释了如何调试节点上正在运行(或者正在崩溃)的 Pod。



## {{% heading "prerequisites" %}}


<!-- 
* Your {{< glossary_tooltip text="Pod" term_id="pod" >}} should already be
  scheduled and running. If your Pod is not yet running, start with [Troubleshoot
  Applications](/docs/tasks/debug-application-cluster/debug-application/).
* For some of the advanced debugging steps you need to know on which Node the
  Pod is running and have shell access to run commands on that Node. You don't
  need that access to run the standard debug steps that use `kubectl`.
-->
* 你的 {{< glossary_tooltip text="Pod" term_id="pod" >}} 
  应该已经调度并正在运行。
  如果 Pod 尚未运行，则从 
  [应用故障排查](/zh/docs/tasks/debug-application-cluster/debug-application/) 开始。
* 对于一些高级调试步骤，
  你需要知道 Pod 在哪个节点上运行，并拥有在该节点上执行 shell 命令的权限。
  在使用 `kubectl` 运行标准调试步骤时，则不需要这种权限。



<!-- steps -->

<!--
## Examining pod logs {#examine-pod-logs}

First, look at the logs of the affected container:
-->
## 检查 Pod 日志  {#examine-pod-logs}

首先，查看受影响的容器的日志：

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

<!--
If your container has previously crashed, you can access the previous container's crash log with:
-->
如果你的容器以前崩溃过，你可以访问前一个容器的崩溃日志：

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

<!--
## Debugging with container exec {#container-exec}

If the {{< glossary_tooltip text="container image" term_id="image" >}} includes
debugging utilities, as is the case with images built from Linux and Windows OS
base images, you can run commands inside a specific container with
`kubectl exec`:
-->
## 使用容器 exec 调试 {#container-exec}

如果 {{< glossary_tooltip text="容器镜像" term_id="image" >}} 
包含调试工具，就像基于 Linux 和 Windows 基础镜像构建的镜像一样，
你可以使用 `kubectl exec` 在特定的容器中执行命令：

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

<!--
`-c ${CONTAINER_NAME}` is optional. You can omit it for Pods that only contain a single container.
-->
{{< note >}}
`-c ${CONTAINER_NAME}` 是可选项。
对于单容器 Pod，可以省略此参数。
{{< /note >}}

<!--
As an example, to look at the logs from a running Cassandra pod, you might run
-->
例如，要查看正在运行的 Cassandra Pod 的日志，可以执行：

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

<!--
You can run a shell that's connected to your terminal using the `-i` and `-t`
arguments to `kubectl exec`, for example:
-->
你可以使用 `kubectl exec` 的 `-i` 和 `-t` 参数启动一个连接到终端的 shell，例如：

```shell
kubectl exec -it cassandra -- sh
```

<!--
For more details, see [Get a Shell to a Running Container](
/docs/tasks/debug-application-cluster/get-shell-running-container/).
-->
更多细节，参见
[获取运行容器的 Shell](
/zh/docs/tasks/debug-application-cluster/get-shell-running-container/)。

<!--
## Debugging with an ephemeral debug container {#ephemeral-container}
-->
## 使用临时调试容器进行调试 {#ephemeral-container}

{{< feature-state state="alpha" for_k8s_version="v1.18" >}}

<!--
{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}}
are useful for interactive troubleshooting when `kubectl exec` is insufficient
because a container has crashed or a container image doesn't include debugging
utilities, such as with [distroless images](
https://github.com/GoogleContainerTools/distroless). `kubectl` has an alpha
command that can create ephemeral containers for debugging beginning with version
`v1.18`.
-->
因为容器已经崩溃，或因为容器镜像没有内含调试工具，比如 
[distroless images](https://github.com/GoogleContainerTools/distroless)，
导致 `kubectl exec` 不足以解决问题时， 
{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}} 
对交互式故障诊断非常有用。
从 `v1.18` 开始，`kubectl` 提供 alpha 命令，它可以为调试创建临时容器。

<!--
### Example debugging using ephemeral containers {#ephemeral-container-example}

The examples in this section require the `EphemeralContainers` [feature gate](
/docs/reference/command-line-tools-reference/feature-gates/) enabled in your
cluster and `kubectl` version v1.18 or later.
-->
## 示例：使用临时容器调试 {#ephemeral-container-example}

{{< note >}}
本节中的示例要求在集群启用  `EphemeralContainers` [特性门控](
/zh/docs/reference/command-line-tools-reference/feature-gates/
)。
并且要求 `kubectl` v1.18 或更高版本。
{{< /note >}}


<!--
You can use the `kubectl alpha debug` command to add ephemeral containers to a
running Pod. First, create a pod for the example:
-->
可以使用 `kubectl alpha debug` 命令将临时容器添加到正在运行的 Pod 中。
首先，为本例创建一个 Pod：

```shell
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
```

<!--
This section use the `pause` container image in examples because it does not
contain userland debugging utilities, but this method works with all container
images.

If you attempt to use `kubectl exec` to create a shell you will see an error
because there is no shell in this container image.
-->
{{< note >}}
本节在示例中使用 `pause` 容器镜像，
是因为它不包含用户态的调试工具。
但此方法适用于所有容器镜像。
{{< /note >}}

如果你试图使用 `kubectl exec` 去建立一个 shell，
你会看到一个报错，
这是因为在容器镜像中并没有包含 shell。

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

<!--
You can instead add a debugging container using `kubectl alpha debug`. If you
specify the `-i`/`--interactive` argument, `kubectl` will automatically attach
to the console of the Ephemeral Container.
-->
你可以使用 `kubectl alpha debug` 添加一个调试容器。
如果指定了 `-i`/`--interactive` 参数，
`kubectl` 将自动连接到临时容器的控制台。

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
此命令添加一个新的 busybox 容器并连接。
`--target` 参数指定了另一个容器的进程命名空间。
这里必须这样做，因为 `kubectl run` 没有在它创建的 Pod 中启用
[进程命名空间共享](/zh/docs/tasks/configure-pod-container/share-process-namespace/) 。

{{< note >}}
{{< glossary_tooltip text="Container Runtime" term_id="container-runtime" >}}
必须支持 `--target` 参数。
如果不支持，临时容器可能无法启动，
或者可能使用隔离的进程名称空间启动。
{{< /note >}}

可以使用 `kubectl describe` 查看新创建的临时容器的状态：

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
完成后，使用 `kubectl delete` 删除 Pod：

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
## 通过节点上的 shell 进行调试 {#node-shell-session}

如果这些方法都不起作用，
你可以找到运行 Pod 的主机并通过 SSH 连接到该主机，
但是 Kubernetes API 中的工具通常不需要这样做。
因此，如果你发现自己需要 ssh 到一台机器上，请在 GitHub 上提交一个功能请求，描述你的用例以及为什么这些工具不够用。

