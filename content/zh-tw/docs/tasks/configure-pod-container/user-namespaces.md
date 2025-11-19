---
title: 爲 Pod 設定 user 名字空間
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
本頁展示如何爲 Pod 設定 user 名字空間。可以將容器內的使用者與主機上的使用者隔離開來。

<!--
A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace.
-->
在容器中以 root 使用者運行的進程可以以不同的（非 root）使用者在宿主機上運行；換句話說，
進程在 user 名字空間內部擁有執行操作的全部特權，但在 user 名字空間外部並沒有執行操作的特權。

<!--
You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security
vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too.
-->
你可以使用這個特性來減少有害的容器對同一宿主機上其他容器的影響。
[有些安全脆弱性問題][KEP-vulns]被評爲 **HIGH** 或 **CRITICAL**，但當 user 名字空間被啓用時，
它們是無法被利用的。相信 user 名字空間也能減輕一些未來的漏洞影響。

<!--
Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when user namespaces are used.
-->
在不使用 user 名字空間的情況下，對於以 root 使用者運行的容器而言，發生容器逃逸時，
容器將擁有在宿主機上的 root 特權。如果容器被賦予了某些權限，則這些權限在宿主機上同樣有效。
當使用 user 名字空間時這些都不可能發生。

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
* 節點的操作系統必須爲 Linux
* 你需要在宿主機上執行命令
* 你需要能夠通過 exec 操作進入 Pod
* 你需要啓用 `UserNamespacesSupport` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)

{{< note >}}
<!--
The feature gate to enable user namespaces was previously named
`UserNamespacesStatelessPodsSupport`, when only stateless pods were supported.
Only Kubernetes v1.25 through to v1.27 recognise `UserNamespacesStatelessPodsSupport`.
-->
在 user 名字空間原來僅支持無狀態的 Pod 時，啓用 user 名字空間的特性門控先前被命名爲 `UserNamespacesStatelessPodsSupport`。
只有 Kubernetes v1.25 到 v1.27 才能識別 `UserNamespacesStatelessPodsSupport`。
{{</ note >}}

<!--
The cluster that you're using **must** include at least one node that meets the
[requirements](/docs/concepts/workloads/pods/user-namespaces/#before-you-begin)
for using user namespaces with Pods.
-->
你所使用的叢集**必須**包括至少一個符合
[要求](/zh-cn/docs/concepts/workloads/pods/user-namespaces/#before-you-begin)
的節點，以便爲 Pod 設定 user 名字空間。

<!--
If you have a mixture of nodes and only some of the nodes provide user namespace support for
Pods, you also need to ensure that the user namespace Pods are
[scheduled](/docs/concepts/scheduling-eviction/assign-pod-node/) to suitable nodes.
-->
如果你有混合節點，並且只有部分節點支持爲 Pod 設定 user 名字空間，
你還需要確保設定了 user 名字空間的 Pod
被[調度](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)到合適的節點。

<!-- steps -->

<!--
## Run a Pod that uses a user namespace {#create-pod}
-->
## 運行一個使用 user 名字空間的 Pod {#create-pod}

<!--
A user namespace for a pod is enabled setting the `hostUsers` field of `.spec`
to `false`. For example:
-->
爲一個 Pod 啓用 user 名字空間需要設置 `.spec` 的 `hostUsers` 字段爲 `false`。例如：

{{% code_sample file="pods/user-namespaces-stateless.yaml" %}}

<!--
1. Create the pod on your cluster:
-->
1. 在你的叢集上創建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/user-namespaces-stateless.yaml
   ```

<!--
1. Exec into the pod and run `readlink /proc/self/ns/user`:
-->
2. 進入一個 Pod 並運行 `readlink /proc/self/ns/user`：

   ```shell
   kubectl exec -ti userns -- bash
   ```

<!--
Run this command:
-->
運行這個命令：

```shell
readlink /proc/self/ns/user
```

<!--
The output is similar to:
-->
輸出類似於：

```shell
user:[4026531837]
```

<!--
Also run:
-->
還運行：

```shell
cat /proc/self/uid_map
```

<!--
The output is similar to:
-->
輸出類似於：

```shell
0  833617920      65536
```

<!--
Then, open a shell in the host and run the same command.
-->
然後，在主機中打開一個 Shell 並運行相同的命令。

<!--
The `readlink` command shows the user namespace the process is running in. It
should be different when it is run on the host and inside the container.
-->
`readlink` 命令顯示進程運行所在的使用者命名空間。在主機上和容器內運行時應該有所不同。

<!--
The last number of the `uid_map` file inside the container must be 65536, on the
host it must be a bigger number.
-->
容器內 `uid_map` 文件的最後一個數字必須是 65536，在主機上它必須是更大的數字。

<!--
If you are running the kubelet inside a user namespace, you need to compare the
output from running the command in the pod to the output of running in the host:
-->
如果你在 user 名字空間中運行 kubelet，則需要將在 Pod 中運行命令的輸出與在主機中運行的輸出進行比較：

```shell
readlink /proc/$pid/ns/user
```

<!--
replacing `$pid` with the kubelet PID.
-->

使用 kubelet 的進程號代替 `$pid`。
