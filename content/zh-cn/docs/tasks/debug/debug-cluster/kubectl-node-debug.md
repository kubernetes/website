---
title: 用 Kubectl 调试 Kubernetes 节点
content_type: task
min-kubernetes-server-version: 1.20
---
<!--
title: Debugging Kubernetes Nodes With Kubectl
content_type: task
min-kubernetes-server-version: 1.20
-->

<!-- overview -->

<!--
This page shows how to debug a [node](/docs/concepts/architecture/nodes/)
running on the Kubernetes cluster using `kubectl debug` command.
-->
本页演示如何使用 `kubectl debug` 命令调试在 Kubernetes
集群上运行的[节点](/zh-cn/docs/concepts/architecture/nodes/)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need to have permission to create Pods and to assign those new Pods to arbitrary nodes.
You also need to be authorized to create Pods that access filesystems from the host.
-->
你需要有权限创建 Pod 并将这些新 Pod 分配到任意节点。
你还需要被授权创建能够访问主机上文件系统的 Pod。

<!-- steps -->

<!--
## Debugging a Node using `kubectl debug node`

Use the `kubectl debug node` command to deploy a Pod to a Node that you want to troubleshoot.
This command is helpful in scenarios where you can't access your Node by using an SSH connection.
When the Pod is created, the Pod opens an interactive shell on the Node.
To create an interactive shell on a Node named “mynode”, run:
-->
## 使用 `kubectl debug node` 调试节点  {#debugging-a-node-using-kubectl-debug-node}

使用 `kubectl debug node` 命令将 Pod 部署到要排查故障的节点上。
此命令在你无法使用 SSH 连接节点时比较有用。
当 Pod 被创建时，Pod 会在节点上打开一个交互的 Shell。
要在名为 “mynode” 的节点上创建一个交互式 Shell，运行：

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```console
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@mynode:/#
```

<!--
The debug command helps to gather information and troubleshoot issues. Commands 
that you might use include `ip`, `ifconfig`, `nc`, `ping`, and `ps` and so on. You can also
install other tools, such as `mtr`, `tcpdump`, and `curl`, from the respective package manager.
-->
调试命令有助于收集信息和排查问题。
你可能使用的命令包括 `ip`、`ifconfig`、`nc`、`ping` 和 `ps` 等等。
你还可以从各种包管理器安装 `mtr`、`tcpdump` 和 `curl` 等其他工具。

{{< note >}}
<!--
The debug commands may differ based on the image the debugging pod is using and
these commands might need to be installed.
-->
这些调试命令会因调试 Pod 所使用的镜像不同而有些差别，并且这些命令可能需要被安装。
{{< /note >}}

<!--
The debugging Pod can access the root filesystem of the Node, mounted at `/host` in the Pod.
If you run your kubelet in a filesystem namespace,
the debugging Pod sees the root for that namespace, not for the entire node. For a typical Linux node,
you can look at the following paths to find relevant logs:
-->
用于调试的 Pod 可以访问节点的根文件系统，该文件系统挂载在 Pod 中的 `/host` 路径。
如果你在 filesystem 名字空间中运行 kubelet，
则正调试的 Pod 将看到此名字空间的根，而不是整个节点的根。
对于典型的 Linux 节点，你可以查看以下路径找到一些重要的日志：

<!--
`/host/var/log/kubelet.log`
: Logs from the `kubelet`, responsible for running containers on the node.

`/host/var/log/kube-proxy.log`
: Logs from `kube-proxy`, which is responsible for directing traffic to Service endpoints.

`/host/var/log/containerd.log`
: Logs from the `containerd` process running on the node.

`/host/var/log/syslog`
: Shows general messages and information regarding the system.

`/host/var/log/kern.log`
: Shows kernel logs.
-->
`/host/var/log/kubelet.log`
: 负责在节点上运行容器的 `kubelet` 所产生的日志。

`/host/var/log/kube-proxy.log`
: 负责将流量导向到 Service 端点的 `kube-proxy` 所产生的日志。

`/host/var/log/containerd.log`
: 在节点上运行的 `containerd` 进程所产生的日志。

`/host/var/log/syslog`
: 显示常规消息以及系统相关信息。

`/host/var/log/kern.log`
: 显示内核日志。

<!--
When creating a debugging session on a Node, keep in mind that:

* `kubectl debug` automatically generates the name of the new pod, based on
  the name of the node.
* The root filesystem of the Node will be mounted at `/host`.
* Although the container runs in the host IPC, Network, and PID namespaces,
  the pod isn't privileged. This means that reading some process information might fail
  because access to that information is restricted to superusers. For example, `chroot /host` will fail.
  If you need a privileged pod, create it manually or use the `--profile=sysadmin` flag.
* By applying [Debugging Profiles](/docs/tasks/debug/debug-application/debug-running-pod/#debugging-profiles), you can set specific properties such as [securityContext](/docs/tasks/configure-pod-container/security-context/) to a debugging Pod.
-->
当在节点上创建一个调试会话时，需谨记：

* `kubectl debug` 根据节点的名称自动生成新 Pod 的名称。
* 节点的根文件系统将被挂载在 `/host`。
* 尽管容器运行在主机 IPC、Network 和 PID 名字空间中，但 Pod 没有特权。
  这意味着读取某些进程信息可能会失败，这是因为访问这些信息仅限于超级用户 (superuser)。
  例如，`chroot /host` 将失败。如果你需要一个有特权的 Pod，请手动创建或使用 `--profile=sysadmin` 标志。
* 通过应用[调试配置](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/#debugging-profiles)，
  你可以为调试 Pod 设置特定的属性，例如 [securityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)。

## {{% heading "cleanup" %}}

<!--
When you finish using the debugging Pod, delete it:
-->
当你使用正调试的 Pod 完成时，将其删除：

```shell
kubectl get pods
```

```none
NAME                          READY   STATUS       RESTARTS   AGE
node-debugger-mynode-pdx84    0/1     Completed    0          8m1s
```

<!-- Change the pod name accordingly -->
```shell
# 相应更改 Pod 名称
kubectl delete pod node-debugger-mynode-pdx84 --now
```

```none
pod "node-debugger-mynode-pdx84" deleted
```

{{< note >}}
<!--
The `kubectl debug node` command won't work if the Node is down (disconnected
from the network, or kubelet dies and won't restart, etc.).
Check [debugging a down/unreachable node ](/docs/tasks/debug/debug-cluster/#example-debugging-a-down-unreachable-node)
in that case.
-->
如果节点停机（网络断开或 kubelet 宕机且无法启动等），则 `kubectl debug node` 命令将不起作用。
这种情况下请检查[调试关闭/无法访问的节点](/zh-cn/docs/tasks/debug/debug-cluster/#example-debugging-a-down-unreachable-node)。
{{< /note >}}
