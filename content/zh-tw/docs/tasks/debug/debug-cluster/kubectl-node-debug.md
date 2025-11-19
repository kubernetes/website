---
title: 用 Kubectl 調試 Kubernetes 節點
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
本頁演示如何使用 `kubectl debug` 命令調試在 Kubernetes
叢集上運行的[節點](/zh-cn/docs/concepts/architecture/nodes/)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need to have permission to create Pods and to assign those new Pods to arbitrary nodes.
You also need to be authorized to create Pods that access filesystems from the host.
-->
你需要有權限創建 Pod 並將這些新 Pod 分配到任意節點。
你還需要被授權創建能夠訪問主機上文件系統的 Pod。

<!-- steps -->

<!--
## Debugging a Node using `kubectl debug node`

Use the `kubectl debug node` command to deploy a Pod to a Node that you want to troubleshoot.
This command is helpful in scenarios where you can't access your Node by using an SSH connection.
When the Pod is created, the Pod opens an interactive shell on the Node.
To create an interactive shell on a Node named “mynode”, run:
-->
## 使用 `kubectl debug node` 調試節點  {#debugging-a-node-using-kubectl-debug-node}

使用 `kubectl debug node` 命令將 Pod 部署到要排查故障的節點上。
此命令在你無法使用 SSH 連接節點時比較有用。
當 Pod 被創建時，Pod 會在節點上打開一個交互的 Shell。
要在名爲 “mynode” 的節點上創建一個交互式 Shell，運行：

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
調試命令有助於收集信息和排查問題。
你可能使用的命令包括 `ip`、`ifconfig`、`nc`、`ping` 和 `ps` 等等。
你還可以從各種包管理器安裝 `mtr`、`tcpdump` 和 `curl` 等其他工具。

{{< note >}}
<!--
The debug commands may differ based on the image the debugging pod is using and
these commands might need to be installed.
-->
這些調試命令會因調試 Pod 所使用的映像檔不同而有些差別，並且這些命令可能需要被安裝。
{{< /note >}}

<!--
The debugging Pod can access the root filesystem of the Node, mounted at `/host` in the Pod.
If you run your kubelet in a filesystem namespace,
the debugging Pod sees the root for that namespace, not for the entire node. For a typical Linux node,
you can look at the following paths to find relevant logs:
-->
用於調試的 Pod 可以訪問節點的根文件系統，該文件系統掛載在 Pod 中的 `/host` 路徑。
如果你在 filesystem 名字空間中運行 kubelet，
則正調試的 Pod 將看到此名字空間的根，而不是整個節點的根。
對於典型的 Linux 節點，你可以查看以下路徑找到一些重要的日誌：

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
: 負責在節點上運行容器的 `kubelet` 所產生的日誌。

`/host/var/log/kube-proxy.log`
: 負責將流量導向到 Service 端點的 `kube-proxy` 所產生的日誌。

`/host/var/log/containerd.log`
: 在節點上運行的 `containerd` 進程所產生的日誌。

`/host/var/log/syslog`
: 顯示常規消息以及系統相關信息。

`/host/var/log/kern.log`
: 顯示內核日誌。

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
當在節點上創建一個調試會話時，需謹記：

* `kubectl debug` 根據節點的名稱自動生成新 Pod 的名稱。
* 節點的根文件系統將被掛載在 `/host`。
* 儘管容器運行在主機 IPC、Network 和 PID 名字空間中，但 Pod 沒有特權。
  這意味着讀取某些進程信息可能會失敗，這是因爲訪問這些信息僅限於超級使用者 (superuser)。
  例如，`chroot /host` 將失敗。如果你需要一個有特權的 Pod，請手動創建或使用 `--profile=sysadmin` 標誌。
* 通過應用[調試設定](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/#debugging-profiles)，
  你可以爲調試 Pod 設置特定的屬性，例如 [securityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)。

## {{% heading "cleanup" %}}

<!--
When you finish using the debugging Pod, delete it:
-->
當你使用正調試的 Pod 完成時，將其刪除：

```shell
kubectl get pods
```

```none
NAME                          READY   STATUS       RESTARTS   AGE
node-debugger-mynode-pdx84    0/1     Completed    0          8m1s
```

<!-- Change the pod name accordingly -->
```shell
# 相應更改 Pod 名稱
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
如果節點停機（網路斷開或 kubelet 宕機且無法啓動等），則 `kubectl debug node` 命令將不起作用。
這種情況下請檢查[調試關閉/無法訪問的節點](/zh-cn/docs/tasks/debug/debug-cluster/#example-debugging-a-down-unreachable-node)。
{{< /note >}}
