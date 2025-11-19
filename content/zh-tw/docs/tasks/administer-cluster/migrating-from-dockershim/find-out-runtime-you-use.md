---
title: 查明節點上所使用的容器運行時
content_type: task
weight: 30
---
<!--
title: Find Out What Container Runtime is Used on a Node
content_type: task
reviewers:
- SergeyKanzhelev
weight: 30
-->

<!-- overview -->

<!--
This page outlines steps to find out what [container runtime](/docs/setup/production-environment/container-runtimes/)
the nodes in your cluster use.
-->
本頁面描述查明叢集中節點所使用的[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
的步驟。

<!--
Depending on the way you run your cluster, the container runtime for the nodes may
have been pre-configured or you need to configure it. If you're using a managed
Kubernetes service, there might be vendor-specific ways to check what container runtime is
configured for the nodes. The method described on this page should work whenever
the execution of `kubectl` is allowed.
-->
取決於你運行叢集的方式，節點所使用的容器運行時可能是事先設定好的，
也可能需要你來設定。如果你在使用託管的 Kubernetes 服務，
可能存在特定於廠商的方法來檢查節點上設定的容器運行時。
本頁描述的方法應該在能夠執行 `kubectl` 的場合下都可以工作。

## {{% heading "prerequisites" %}}

<!--
Install and configure `kubectl`. See [Install Tools](/docs/tasks/tools/#kubectl) section for details.
-->
安裝並設定 `kubectl`。參見[安裝工具](/zh-cn/docs/tasks/tools/#kubectl) 節瞭解詳情。

<!--
## Find out the container runtime used on a Node

Use `kubectl` to fetch and show node information:
-->
## 查明節點所使用的容器運行時 {#find-out-the-container-runtime-used-on-a-node}

使用 `kubectl` 來讀取並顯示節點信息：

```shell
kubectl get nodes -o wide
```

<!--
The output is similar to the following. The column `CONTAINER-RUNTIME` outputs
the runtime and its version.

For Docker Engine, the output is similar to this:
-->
輸出如下面所示。`CONTAINER-RUNTIME` 列給出容器運行時及其版本。

對於 Docker Engine，輸出類似於：
```none
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1
```
<!--
If your runtime shows as Docker Engine, you still might not be affected by the
removal of dockershim in Kubernetes v1.24.
[Check the runtime endpoint](#which-endpoint) to see if you use dockershim.
If you don't use dockershim, you aren't affected. 

For containerd, the output is similar to this:
-->
如果你的容器運行時顯示爲 Docker Engine，你仍然可能不會被 v1.24 中 dockershim 的移除所影響。
通過[檢查運行時端點](#which-endpoint)，可以查看你是否在使用 dockershim。
如果你沒有使用 dockershim，你就不會被影響。

對於 containerd，輸出類似於這樣：

```none
# For containerd
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1
```

<!--
Find out more information about container runtimes
on [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
page.
-->
你可以在[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
頁面找到與容器運行時相關的更多信息。

<!--
## Find out what container runtime endpoint you use {#which-endpoint}
-->
## 檢查當前使用的運行時端點  {#which-endpoint}

<!--
The container runtime talks to the kubelet over a Unix socket using the [CRI
protocol](/docs/concepts/architecture/cri/), which is based on the gRPC
framework. The kubelet acts as a client, and the runtime acts as the server.
In some cases, you might find it useful to know which socket your nodes use. For
example, with the removal of dockershim in Kubernetes v1.24 and later, you might
want to know whether you use Docker Engine with dockershim.
-->

容器運行時使用 Unix Socket 與 kubelet 通信，這一通信使用基於 gRPC 框架的
[CRI 協議](/zh-cn/docs/concepts/architecture/cri/)。kubelet 扮演客戶端，運行時扮演伺服器端。
在某些情況下，你可能想知道你的節點使用的是哪個 socket。
如若叢集是 Kubernetes v1.24 及以後的版本，
或許你想知道當前運行時是否是使用 dockershim 的 Docker Engine。

{{< note >}}
<!--
If you currently use Docker Engine in your nodes with `cri-dockerd`, you aren't
affected by the dockershim removal.
-->
如果你的節點在通過 `cri-dockerd` 使用 Docker Engine，
那麼叢集不會受到 Kubernetes 移除 dockershim 的影響。
{{< /note >}}

<!--
You can check which socket you use by checking the kubelet configuration on your
nodes.
-->
可以通過檢查 kubelet 的參數得知當前使用的是哪個 socket。

<!--
1.  Read the starting commands for the kubelet process:

    ```
    tr \\0 ' ' < /proc/"$(pgrep kubelet)"/cmdline
    ```
    If you don't have `tr` or `pgrep`, check the command line for the kubelet
    process manually.
-->
1. 查看 kubelet 進程的啓動命令

   ```
    tr \\0 ' ' < /proc/"$(pgrep kubelet)"/cmdline
   ```
   如有節點上沒有 `tr` 或者 `pgrep`，就需要手動檢查 kubelet 的啓動命令

<!--
1.  In the output, look for the `--container-runtime` flag and the
    `--container-runtime-endpoint` flag.

    *   If your nodes use Kubernetes v1.23 and earlier and these flags aren't
        present or if the `--container-runtime` flag is not `remote`,
        you use the dockershim socket with Docker Engine. The `--container-runtime` command line
        argument is not available in Kubernetes v1.27 and later.
    *   If the `--container-runtime-endpoint` flag is present, check the socket
        name to find out which runtime you use. For example,
        `unix:///run/containerd/containerd.sock` is the containerd endpoint.
-->
2. 在命令的輸出中，查找 `--container-runtime` 和 `--container-runtime-endpoint` 標誌。

   * 如果你的節點使用 Kubernetes v1.23 或更早的版本，這兩個參數不存在，
     或者 `--container-runtime` 標誌值不是 `remote`，則你在通過 dockershim 套接字使用
     Docker Engine。
     在 Kubernetes v1.27 及以後的版本中，`--container-runtime` 命令列參數不再可用。
   * 如果設置了 `--container-runtime-endpoint` 參數，查看套接字名稱即可得知當前使用的運行時。
     如若套接字 `unix:///run/containerd/containerd.sock` 是 containerd 的端點。

<!--
If you want to change the Container Runtime on a Node from Docker Engine to containerd,
you can find out more information on [migrating from Docker Engine to  containerd](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/),
or, if you want to continue using Docker Engine in Kubernetes v1.24 and later, migrate to a
CRI-compatible adapter like [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd).
-->
如果你將節點上的容器運行時從 Docker Engine 改變爲 containerd，可在
[遷移到不同的運行時](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/)
找到更多信息。或者，如果你想在 Kubernetes v1.24 及以後的版本仍使用 Docker Engine，
可以安裝 CRI 兼容的適配器實現，如 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)。

