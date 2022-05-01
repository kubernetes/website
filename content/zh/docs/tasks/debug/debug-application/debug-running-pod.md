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
  如果你的 Pod 还没有运行，请参阅[应用问题排查](/zh/docs/tasks/debug-application-cluster/debug-application/)。

* 对于一些高级调试步骤，你应该知道 Pod 具体运行在哪个节点上，在该节点上有权限去运行一些命令。
  你不需要任何访问权限就可以使用 `kubectl` 去运行一些标准调试步骤。

<!-- steps -->

<!--
## Examining pod logs {#examine-pod-logs}

First, look at the logs of the affected container:
-->
## 检查 Pod 的日志 {#examine-pod-logs}

首先，查看受到影响的容器的日志：

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

<!--
If your container has previously crashed, you can access the previous container's crash log with:
-->

如果你的容器之前崩溃过，你可以通过下面命令访问之前容器的崩溃日志：

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
## 使用容器 exec 进行调试 {#container-exec}

如果 {{< glossary_tooltip text="容器镜像" term_id="image" >}} 包含调试程序，
比如从 Linux 和 Windows 操作系统基础镜像构建的镜像，你可以使用 `kubectl exec` 命令
在特定的容器中运行一些命令：

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

 <!--
 `-c ${CONTAINER_NAME}` is optional. You can omit it for Pods that only contain a single container.
 -->

{{< note >}}
`-c ${CONTAINER_NAME}` 是可选择的。如果Pod中仅包含一个容器，就可以忽略它。
{{< /note >}}

<!--
As an example, to look at the logs from a running Cassandra pod, you might run
-->

例如，要查看正在运行的 Cassandra Pod 中的日志，可以运行：

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

<!--
You can run a shell that's connected to your terminal using the `-i` and `-t`
arguments to `kubectl exec`, for example:
-->

你可以在 `kubectl exec` 命令后面加上 `-i` 和 `-t` 来运行一个连接到你的终端的 Shell，比如：

```shell
kubectl exec -it cassandra -- sh
```

<!--
For more details, see [Get a Shell to a Running Container](
/docs/tasks/debug-application-cluster/get-shell-running-container/).
-->
若要了解更多内容，可查看[获取正在运行容器的 Shell](/zh/docs/tasks/debug-application-cluster/get-shell-running-container/)。

<!--
## Debugging with an ephemeral debug container {#ephemeral-container}

{{< feature-state state="beta" for_k8s_version="v1.23" >}}

{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}}
are useful for interactive troubleshooting when `kubectl exec` is insufficient
because a container has crashed or a container image doesn't include debugging
utilities, such as with [distroless images](
https://github.com/GoogleContainerTools/distroless).
-->
## 使用临时调试容器来进行调试 {#ephemeral-container}

{{< feature-state state="beta" for_k8s_version="v1.23" >}}

当由于容器崩溃或容器镜像不包含调试程序（例如[无发行版镜像](https://github.com/GoogleContainerTools/distroless)等）
而导致 `kubectl exec` 无法运行时，{{< glossary_tooltip text="临时容器" term_id="ephemeral-container" >}}对于排除交互式故障很有用。

<!--
### Example debugging using ephemeral containers {#ephemeral-container-example}

You can use the `kubectl debug` command to add ephemeral containers to a
running Pod. First, create a pod for the example:

This section use the `pause` container image in examples because it does not
contain debugging utilities, but this method works with all container
images.
-->
## 使用临时容器来调试的例子 {#ephemeral-container-example}

你可以使用 `kubectl debug` 命令来给正在运行中的 Pod 增加一个临时容器。
首先，像下例一样创建一个 Pod：

```shell
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
```

{{< note >}}
本节示例中使用 `pause` 容器镜像，因为它不包含调试程序，但是这个方法适用于所有容器镜像。
{{< /note >}}

<!--
If you attempt to use `kubectl exec` to create a shell you will see an error
because there is no shell in this container image.

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

You can instead add a debugging container using `kubectl debug`. If you
specify the `-i`/`--interactive` argument, `kubectl` will automatically attach
to the console of the Ephemeral Container.

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

你可以改为使用 `kubectl debug` 添加调试容器。
如果你指定 `-i` 或者 `--interactive` 参数，`kubectl` 将自动挂接到临时容器的控制台。

```shell
kubectl debug -it ephemeral-demo --image=busybox:1.28 --target=ephemeral-demo
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
isolated process namespace so that `ps` does not reveal processes in other containers.

You can view the state of the newly created ephemeral container using `kubectl describe`:
-->
此命令添加一个新的 busybox 容器并将其挂接到该容器。`--target` 参数指定另一个容器的进程命名空间。
这是必需的，因为 `kubectl run` 不能在它创建的 Pod
中启用[共享进程命名空间](/zh/docs/tasks/configure-pod-container/share-process-namespace/)。

{{< note >}}
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}必须支持`--target`参数。
如果不支持，则临时容器可能不会启动，或者可能使用隔离的进程命名空间启动，
以便 `ps` 不显示其他容器内的进程。
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
完成后，使用 `kubectl delete` 来移除 Pod：

```shell
kubectl delete pod ephemeral-demo
```

<!--
## Debugging using a copy of the Pod
-->
## 通过 Pod 副本调试

<!--
Sometimes Pod configuration options make it difficult to troubleshoot in certain
situations. For example, you can't run `kubectl exec` to troubleshoot your
container if your container image does not include a shell or if your application
crashes on startup. In these situations you can use `kubectl debug` to create a
copy of the Pod with configuration values changed to aid debugging.
-->
有些时候 Pod 的配置参数使得在某些情况下很难执行故障排查。
例如，在容器镜像中不包含 Shell 或者你的应用程序在启动时崩溃的情况下，
就不能通过运行 `kubectl exec` 来排查容器故障。
在这些情况下，你可以使用 `kubectl debug` 来创建 Pod 的副本，通过更改配置帮助调试。

<!--
### Copying a Pod while adding a new container
-->
### 在添加新的容器时创建 Pod 副本

<!--
Adding a new container can be useful when your application is running but not
behaving as you expect and you'd like to add additional troubleshooting
utilities to the Pod.
-->
当应用程序正在运行但其表现不符合预期时，添加新容器可能会帮助你符合预期，
并且你会希望在 Pod 中添加额外的调试工具。

<!--
For example, maybe your application's container images are built on `busybox`
but you need debugging utilities not included in `busybox`. You can simulate
this scenario using `kubectl run`:
-->
例如，可能你的应用的容器镜像是基于 `busybox` 构造的，
但是你需要 `busybox` 中并不包含的调试工具。
你可以使用 `kubectl run` 模拟这个场景:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```
<!--
Run this command to create a copy of `myapp` named `myapp-debug` that adds a
new Ubuntu container for debugging:
-->
通过运行以下命令，建立 `myapp` 的一个名为 `myapp-debug` 的副本，
新增了一个用于调试的 Ubuntu 容器，

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```
<!--
* `kubectl debug` automatically generates a container name if you don't choose
  one using the `--container` flag.
* The `-i` flag causes `kubectl debug` to attach to the new container by
  default.  You can prevent this by specifying `--attach=false`. If your session
  becomes disconnected you can reattach using `kubectl attach`.
* The `--share-processes` allows the containers in this Pod to see processes
  from the other containers in the Pod. For more information about how this
  works, see [Share Process Namespace between Containers in a Pod](
  /docs/tasks/configure-pod-container/share-process-namespace/).
-->
{{< note >}}
* 如果你没有使用 `--container` 指定新的容器名，`kubectl debug` 会自动生成容器名称。
* 默认情况下，`-i` 标志使 `kubectl debug` 附加到新容器上。
  你可以通过指定 `--attach=false` 来防止这种情况。
  如果你的会话断开连接，你可以使用 `kubectl attach` 重新连接。
* `--share-processes` 允许在此 Pod 中的其他容器中查看该容器的进程。
  参阅[在 Pod 中的容器之间共享进程命名空间](/zh/docs/tasks/configure-pod-container/share-process-namespace/)，
  获取更多信息。
{{< /note >}}

<!--
Don't forget to clean up the debugging Pod when you're finished with it:
-->
结束之后，不要忘了清理调试 Pod：

```shell
kubectl delete pod myapp myapp-debug
```

<!--
### Copying a Pod while changing its command
-->
### 在改变 Pod 命令时创建 Pod 副本

<!--
Sometimes it's useful to change the command for a container, for example to
add a debugging flag or because the application is crashing.
-->
有时更改容器的命令很有用，例如添加调试标志或因为应用崩溃。

<!--
To simulate a crashing application, use `kubectl run` to create a container
that immediately exits:
-->
为了模拟应用崩溃的场景，使用 `kubectl run` 命令创建一个立即退出的容器：

```
kubectl run --image=busybox:1.28 myapp -- false
```

<!--
You can see using `kubectl describe pod myapp` that this container is crashing:
-->
使用 `kubectl describe pod myapp` 命令，你可以看到容器崩溃了：

```
Containers:
  myapp:
    Image:         busybox
    ...
    Args:
      false
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
```

<!--
You can use `kubectl debug` to create a copy of this Pod with the command
changed to an interactive shell:
-->
你可以使用 `kubectl debug` 命令创建该 Pod 的一个副本，
在该副本中命令改变为交互式 shell：

```
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```
If you don't see a command prompt, try pressing enter.
/ #
```

<!--
Now you have an interactive shell that you can use to perform tasks like
checking filesystem paths or running the container command manually.
-->
现在你有了一个可以执行类似检查文件系统路径或者手动运行容器命令的交互式 shell。 

<!--
{{< note >}}
* To change the command of a specific container you must
  specify its name using `--container` or `kubectl debug` will instead
  create a new container to run the command you specified.
* The `-i` flag causes `kubectl debug` to attach to the container by default.
  You can prevent this by specifying `--attach=false`. If your session becomes
  disconnected you can reattach using `kubectl attach`.
{{< /note >}}
-->
{{< note >}}
* 要更改指定容器的命令，你必须用 `--container` 命令指定容器的名字，
  否则 `kubectl debug` 将创建一个新的容器运行你指定的命令。
* 默认情况下，标志 `-i` 使 `kubectl debug` 附加到容器。
  你可通过指定 `--attach=false` 来防止这种情况。
  如果你的断开连接，可以使用 `kubectl attach` 重新连接。
{{< /note >}} 

<!--
Don't forget to clean up the debugging Pod when you're finished with it:
-->
结束之后，不要忘了清理调试 Pod：

```shell
kubectl delete pod myapp myapp-debug
```
<!--
### Copying a Pod while changing container images

In some situations you may want to change a misbehaving Pod from its normal
production container images to an image containing a debugging build or
additional utilities.

As an example, create a Pod using `kubectl run`:
-->
### 在更改容器镜像时创建 Pod 副本

在某些情况下，你可能想改变行为异常的 Pod，
将其中的正常生产容器镜像更改为包含调试版本或者额外工具的镜像。

作为示例，用 `kubectl run` 创建一个 Pod：

```
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```
<!--
Now use `kubectl debug` to make a copy and change its container image
to `ubuntu`:
-->
现在可以使用 `kubectl debug`  创建一个副本并改变容器镜像为 `ubuntu`：

```
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

<!--
The syntax of `--set-image` uses the same `container_name=image` syntax as
`kubectl set image`. `*=ubuntu` means change the image of all containers
to `ubuntu`.

Don't forget to clean up the debugging Pod when you're finished with it:
-->
`--set-image` 使用与 `kubectl set image` 相同的 `container_name=image` 语法。
`*=ubuntu` 表示把所有容器的镜像改为 `ubuntu`。

```shell
kubectl delete pod myapp myapp-debug
```

<!--
## Debugging via a shell on the node {#node-shell-session}

If none of these approaches work, you can find the Node on which the Pod is
running and create a privileged Pod running in the host namespaces. To create
an interactive shell on a node using `kubectl debug`, run:
-->
## 通过节点上的 Shell 来进行调试 {#node-shell-session}

如果这些方法都不起作用，你可以找到运行 Pod 的节点，然后在节点上部署一个运行在宿主名字空间的特权 Pod。

你可以通过 `kubectl debug` 在节点上创建一个交互式 Shell：

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

<!--
When creating a debugging session on a node, keep in mind that:

* `kubectl debug` automatically generates the name of the new Pod based on
  the name of the Node.
* The container runs in the host IPC, Network, and PID namespaces.
* The root filesystem of the Node will be mounted at `/host`.

Don't forget to clean up the debugging Pod when you're finished with it:
-->
在节点上创建调试会话时，注意以下要点：
* `kubectl debug` 基于节点的名字自动生成新的 Pod 的名字。
* 新的调试容器运行在宿主 IPC、宿主网络、宿主 PID 名字空间内。
* 节点的根文件系统会被挂载在 `/host`。

当你完成节点调试时，不要忘记清理调试 Pod：

```shell
kubectl delete pod node-debugger-mynode-pdx84
```