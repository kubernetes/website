---
title: 为 Pod 配置 user 名字空间
reviewers:
content_type: task
weight: 210
min-kubernetes-server-version: v1.25
---

<!--
title: Use a User Namespace With a Pod
reviewers:
content_type: task
weight: 210
min-kubernetes-server-version: v1.25
-->

<!-- overview -->
{{< feature-state feature_gate_name="UserNamespacesSupport" >}}

<!--
This page shows how to configure a user namespace for pods. This allows you to
isolate the user running inside the container from the one in the host.
-->
本页展示如何为 Pod 配置 user 名字空间。可以将容器内的用户与主机上的用户隔离开来。

<!--
A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace.
-->
在容器中以 root 用户运行的进程可以以不同的（非 root）用户在宿主机上运行；换句话说，
进程在 user 名字空间内部拥有执行操作的全部特权，但在 user 名字空间外部并没有执行操作的特权。

<!--
You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security
vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too.
-->
你可以使用这个特性来减少有害的容器对同一宿主机上其他容器的影响。
[有些安全脆弱性问题][KEP-vulns]被评为 **HIGH** 或 **CRITICAL**，但当 user 名字空间被启用时，
它们是无法被利用的。相信 user 名字空间也能减轻一些未来的漏洞影响。

<!--
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when user namespaces are used.
-->
在不使用 user 名字空间的情况下，对于以 root 用户运行的容器而言，发生容器逃逸时，
容器将拥有在宿主机上的 root 特权。如果容器被赋予了某些权限，则这些权限在宿主机上同样有效。
当使用 user 名字空间时这些都不可能发生。

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% thirdparty-content single="true" %}}
<!-- if adding another runtime in the future, omit the single setting -->

<!--
* The node OS needs to be Linux
* You need to exec commands in the host
* You need to be able to exec into pods
* You need to enable the `UserNamespacesSupport`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
-->
* 节点的操作系统必须为 Linux
* 你需要在宿主机上执行命令
* 你需要能够通过 exec 操作进入 Pod
* 你需要启用 `UserNamespacesSupport` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)

{{< note >}}
<!--
The feature gate to enable user namespaces was previously named
`UserNamespacesStatelessPodsSupport`, when only stateless pods were supported.
Only Kubernetes v1.25 through to v1.27 recognise `UserNamespacesStatelessPodsSupport`.
-->
在 user 名字空间原来仅支持无状态的 Pod 时，启用 user 名字空间的特性门控先前被命名为 `UserNamespacesStatelessPodsSupport`。
只有 Kubernetes v1.25 到 v1.27 才能识别 `UserNamespacesStatelessPodsSupport`。
{{</ note >}}

<!--
The cluster that you're using **must** include at least one node that meets the
[requirements](/docs/concepts/workloads/pods/user-namespaces/#before-you-begin)
for using user namespaces with Pods.
-->
你所使用的集群**必须**包括至少一个符合
[要求](/zh-cn/docs/concepts/workloads/pods/user-namespaces/#before-you-begin)
的节点，以便为 Pod 配置 user 名字空间。

<!--
If you have a mixture of nodes and only some of the nodes provide user namespace support for
Pods, you also need to ensure that the user namespace Pods are
[scheduled](/docs/concepts/scheduling-eviction/assign-pod-node/) to suitable nodes.
-->
如果你有混合节点，并且只有部分节点支持为 Pod 配置 user 名字空间，
你还需要确保配置了 user 名字空间的 Pod
被[调度](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)到合适的节点。

<!-- steps -->

<!--
## Run a Pod that uses a user namespace {#create-pod}
-->
## 运行一个使用 user 名字空间的 Pod {#create-pod}

<!--
A user namespace for a pod is enabled setting the `hostUsers` field of `.spec`
to `false`. For example:
-->
为一个 Pod 启用 user 名字空间需要设置 `.spec` 的 `hostUsers` 字段为 `false`。例如：

{{% code_sample file="pods/user-namespaces-stateless.yaml" %}}

<!--
1. Create the pod on your cluster:
-->
1. 在你的集群上创建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/user-namespaces-stateless.yaml
   ```

<!--
1. Attach to the container and run `readlink /proc/self/ns/user`:
-->
2. 挂接到容器上并执行 `readlink /proc/self/ns/user`：

   ```shell
   kubectl attach -it userns bash
   ```

<!--
Run this command:
-->
运行这个命令：

```shell
readlink /proc/self/ns/user
```

<!--
The output is similar to:
-->
输出类似于：

```shell
user:[4026531837]
```

<!--
Also run:
-->
还运行：

```shell
cat /proc/self/uid_map
```

<!--
The output is similar to:
-->
输出类似于：

```shell
0  833617920      65536
```

<!--
Then, open a shell in the host and run the same command.
-->
然后，在主机中打开一个 Shell 并运行相同的命令。

<!--
The `readlink` command shows the user namespace the process is running in. It
should be different when it is run on the host and inside the container.
-->
`readlink` 命令显示进程运行所在的用户命名空间。在主机上和容器内运行时应该有所不同。

<!--
The last number of the `uid_map` file inside the container must be 65536, on the
host it must be a bigger number.
-->
容器内 `uid_map` 文件的最后一个数字必须是 65536，在主机上它必须是更大的数字。

<!--
If you are running the kubelet inside a user namespace, you need to compare the
output from running the command in the pod to the output of running in the host:
-->
如果你在 user 名字空间中运行 kubelet，则需要将在 Pod 中运行命令的输出与在主机中运行的输出进行比较：

```shell
readlink /proc/$pid/ns/user
```

<!--
replacing `$pid` with the kubelet PID.
-->

使用 kubelet 的进程号代替 `$pid`。
