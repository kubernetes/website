---
title: 日誌架構
content_type: concept
weight: 60
---
<!--
reviewers:
- piosz
- x13n
title: Logging Architecture
content_type: concept
weight: 60
-->
<!-- overview -->

<!--
Application logs can help you understand what is happening inside your application. The
logs are particularly useful for debugging problems and monitoring cluster activity. Most
modern applications have some kind of logging mechanism. Likewise, container engines
are designed to support logging. The easiest and most adopted logging method for
containerized applications is writing to standard output and standard error streams.
-->
應用日誌可以讓你瞭解應用內部的運行狀況。日誌對調試問題和監控集羣活動非常有用。
大部分現代化應用都有某種日誌記錄機制。同樣地，容器引擎也被設計成支持日誌記錄。
針對容器化應用，最簡單且最廣泛採用的日誌記錄方式就是寫入標準輸出和標準錯誤流。

<!--
However, the native functionality provided by a container engine or runtime is usually
not enough for a complete logging solution.

For example, you may want to access your application's logs if a container crashes,
a pod gets evicted, or a node dies.

In a cluster, logs should have a separate storage and lifecycle independent of nodes,
pods, or containers. This concept is called
[cluster-level logging](#cluster-level-logging-architectures).
-->
但是，由容器引擎或運行時提供的原生功能通常不足以構成完整的日誌記錄方案。

例如，如果發生容器崩潰、Pod 被逐出或節點宕機等情況，你可能想訪問應用日誌。

在集羣中，日誌應該具有獨立的存儲，並且其生命週期與節點、Pod 或容器的生命週期相獨立。
這個概念叫[集羣級的日誌](#cluster-level-logging-architectures)。

<!--
Cluster-level logging architectures require a separate backend to store, analyze, and
query logs. Kubernetes does not provide a native storage solution for log data. Instead,
there are many logging solutions that integrate with Kubernetes. The following sections
describe how to handle and store logs on nodes.
-->
集羣級日誌架構需要一個獨立的後端用來存儲、分析和查詢日誌。
Kubernetes 並不爲日誌數據提供原生的存儲解決方案。
相反，有很多現成的日誌方案可以集成到 Kubernetes 中。
下面各節描述如何在節點上處理和存儲日誌。

<!-- body -->

<!--
## Pod and container logs {#basic-logging-in-kubernetes}

Kubernetes captures logs from each container in a running Pod.

This example uses a manifest for a `Pod` with a container
that writes text to the standard output stream, once per second.
-->
## Pod 和容器日誌   {#basic-logging-in-kubernetes}

Kubernetes 從正在運行的 Pod 中捕捉每個容器的日誌。

此示例使用帶有一個容器的 `Pod` 的清單，該容器每秒將文本寫入標準輸出一次。

{{% code_sample file="debug/counter-pod.yaml" %}}

<!--
To run this pod, use the following command:
-->
要運行此 Pod，請執行以下命令：

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```

<!--
The output is:
-->
輸出爲：

```console
pod/counter created
```

<!--
To fetch the logs, use the `kubectl logs` command, as follows:
-->
要獲取這些日誌，請執行以下 `kubectl logs` 命令：

```shell
kubectl logs counter
```

<!--
The output is similar to:
-->
輸出類似於：

```console
0: Fri Apr  1 11:42:23 UTC 2022
1: Fri Apr  1 11:42:24 UTC 2022
2: Fri Apr  1 11:42:25 UTC 2022
```

<!--
You can use `kubectl logs --previous` to retrieve logs from a previous instantiation of a container.
If your pod has multiple containers, specify which container's logs you want to access by
appending a container name to the command, with a `-c` flag, like so:
-->
你可以使用 `kubectl logs --previous` 從容器的先前實例中檢索日誌。
如果你的 Pod 有多個容器，請如下通過將容器名稱追加到該命令並使用 `-c`
標誌來指定要訪問哪個容器的日誌：

```shell
kubectl logs counter -c count
```

<!--
### Container log streams
-->
### 容器日誌流  {#container-log-streams}

{{< feature-state feature_gate_name="PodLogsQuerySplitStreams" >}}

<!--
As an alpha feature, the kubelet can split out the logs from the two standard streams produced
by a container: [standard output](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout))
and [standard error](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_(stderr)).
To use this behavior, you must enable the `PodLogsQuerySplitStreams`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
With that feature gate enabled, Kubernetes {{< skew currentVersion >}} allows access to these
log streams directly via the Pod API. You can fetch a specific stream by specifying the stream name (either `Stdout` or `Stderr`),
using the `stream` query string. You must have access to read the `log` subresource of that Pod.
-->
作爲一種 Alpha 特性，kubelet 可以將容器產生的兩個標準流的日誌分開：
[標準輸出](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout))和
[標準錯誤](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_(stderr))輸出。
要使用此行爲，你必須啓用 `PodLogsQuerySplitStreams`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
啓用該特性門控後，Kubernetes {{< skew currentVersion >}} 允許通過 Pod API 直接訪問這些日誌流。
你可以通過指定流名稱（`Stdout` 或 `Stderr`）使用 `stream` 查詢字符串來獲取特定的流。
你必須具有讀取該 Pod 的 `log` 子資源的權限。

<!--
To demonstrate this feature, you can create a Pod that periodically writes text to both the standard output and error stream.
-->
要演示此特性，你可以創建一個定期向標準輸出和標準錯誤流中寫入文本的 Pod。

{{% code_sample file="debug/counter-pod-err.yaml" %}}

<!--
To run this pod, use the following command:
-->
要運行此 Pod，使用以下命令：

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod-err.yaml
```

<!--
To fetch only the stderr log stream, you can run:
-->
要僅獲取 stderr 日誌流，你可以運行以下命令：

```shell
kubectl get --raw "/api/v1/namespaces/default/pods/counter-err/log?stream=Stderr"
```

<!--
See the [`kubectl logs` documentation](/docs/reference/generated/kubectl/kubectl-commands#logs)
for more details.
-->
詳見 [`kubectl logs` 文檔](/docs/reference/generated/kubectl/kubectl-commands#logs)。

<!--
### How nodes handle container logs

![Node level logging](/images/docs/user-guide/logging/logging-node-level.png)

A container runtime handles and redirects any output generated to a containerized
application's `stdout` and `stderr` streams.
Different container runtimes implement this in different ways; however, the integration
with the kubelet is standardized as the _CRI logging format_.
-->
### 節點的容器日誌處理方式   {#how-nodes-handle-container-logs}

![節點級別的日誌記錄](/images/docs/user-guide/logging/logging-node-level.png)

容器運行時對寫入到容器化應用程序的 `stdout` 和 `stderr` 流的所有輸出進行處理和轉發。
不同的容器運行時以不同的方式實現這一點；不過它們與 kubelet 的集成都被標準化爲 **CRI 日誌格式**。

<!--
By default, if a container restarts, the kubelet keeps one terminated container with its logs.
If a pod is evicted from the node, all corresponding containers are also evicted, along with their logs.

The kubelet makes logs available to clients via a special feature of the Kubernetes API.
The usual way to access this is by running `kubectl logs`.
-->
默認情況下，如果容器重新啓動，kubelet 會保留一個終止的容器及其日誌。
如果一個 Pod 被逐出節點，所對應的所有容器及其日誌也會被逐出。

kubelet 通過 Kubernetes API 的特殊功能將日誌提供給客戶端訪問。
訪問這個日誌的常用方法是運行 `kubectl logs`。

<!--
### Log rotation
-->
### 日誌輪換   {#log-rotation}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
The kubelet is responsible for rotating container logs and managing the
logging directory structure.
The kubelet sends this information to the container runtime (using CRI),
and the runtime writes the container logs to the given location.
-->
kubelet 負責輪換容器日誌並管理日誌目錄結構。
kubelet（使用 CRI）將此信息發送到容器運行時，而運行時則將容器日誌寫到給定位置。

<!--
You can configure two kubelet [configuration settings](/docs/reference/config-api/kubelet-config.v1beta1/),
`containerLogMaxSize` (default 10Mi) and `containerLogMaxFiles` (default 5),
using the [kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/).
These settings let you configure the maximum size for each log file and the maximum number of
files allowed for each container respectively.
-->
你可以使用 [kubelet 配置文件](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)配置兩個
kubelet [配置選項](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)、
`containerLogMaxSize` （默認 10Mi）和 `containerLogMaxFiles`（默認 5）。
這些設置分別允許你分別配置每個日誌文件大小的最大值和每個容器允許的最大文件數。

<!--
In order to perform an efficient log rotation in clusters where the volume of the logs generated by
the workload is large, kubelet also provides a mechanism to tune how the logs are rotated in
terms of how many concurrent log rotations can be performed and the interval at which the logs are
monitored and rotated as required.
You can configure two kubelet [configuration settings](/docs/reference/config-api/kubelet-config.v1beta1/),
`containerLogMaxWorkers` and `containerLogMonitorInterval` using the
[kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/).
-->
爲了在工作負載生成的日誌量較大的集羣中執行高效的日誌輪換，kubelet
還提供了一種機制，基於可以執行多少併發日誌輪換以及監控和輪換日誌所需要的間隔來調整日誌的輪換方式。
你可以使用 [kubelet 配置文件](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
配置兩個 kubelet [配置選項](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)：
`containerLogMaxWorkers` 和 `containerLogMonitorInterval`。

<!--
When you run [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) as in
the basic logging example, the kubelet on the node handles the request and
reads directly from the log file. The kubelet returns the content of the log file.
-->
當類似於基本日誌示例一樣運行 [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) 時，
節點上的 kubelet 會處理請求並直接從日誌文件讀取。kubelet 將返回該日誌文件的內容。

{{< note >}}
<!--
Only the contents of the latest log file are available through `kubectl logs`.

For example, if a Pod writes 40 MiB of logs and the kubelet rotates logs
after 10 MiB, running `kubectl logs` returns at most 10MiB of data.
-->
只有最新的日誌文件的內容可以通過 `kubectl logs` 獲得。

例如，如果 Pod 寫入 40 MiB 的日誌，並且 kubelet 在 10 MiB 之後輪換日誌，
則運行 `kubectl logs` 將最多返回 10 MiB 的數據。
{{< /note >}}

<!--
## System component logs

There are two types of system components: those that typically run in a container,
and those components directly involved in running containers. For example:
-->
### 系統組件日誌   {#system-component-logs}

系統組件有兩種類型：通常在容器中運行的組件和直接參與容器運行的組件。例如：

<!--
* The kubelet and container runtime do not run in containers. The kubelet runs
  your containers (grouped together in {{< glossary_tooltip text="pods" term_id="pod" >}})
* The Kubernetes scheduler, controller manager, and API server run within pods
  (usually {{< glossary_tooltip text="static Pods" term_id="static-pod" >}}).
  The etcd component runs in the control plane, and most commonly also as a static pod.
  If your cluster uses kube-proxy, you typically run this as a `DaemonSet`.
-->
* kubelet 和容器運行時不在容器中運行。kubelet 運行你的容器
  （一起按 {{< glossary_tooltip text="Pod" term_id="pod" >}} 分組）
* Kubernetes 調度器、控制器管理器和 API 服務器在 Pod 中運行
  （通常是{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}。
  etcd 組件在控制平面中運行，最常見的也是作爲靜態 Pod。
  如果你的集羣使用 kube-proxy，則通常將其作爲 `DaemonSet` 運行。

<!--
### Log locations {#log-location-node}

The way that the kubelet and container runtime write logs depends on the operating
system that the node uses:
-->
### 日誌位置   {#log-location-node}

kubelet 和容器運行時寫入日誌的方式取決於節點使用的操作系統：

{{< tabs name="log_location_node_tabs" >}}
{{% tab name="Linux" %}}

<!--
On Linux nodes that use systemd, the kubelet and container runtime write to journald
by default. You use `journalctl` to read the systemd journal; for example:
`journalctl -u kubelet`.

If systemd is not present, the kubelet and container runtime write to `.log` files in the
`/var/log` directory. If you want to have logs written elsewhere, you can indirectly
run the kubelet via a helper tool, `kube-log-runner`, and use that tool to redirect
kubelet logs to a directory that you choose.
-->
在使用 systemd 的 Linux 節點上，kubelet 和容器運行時默認寫入 journald。
你要使用 `journalctl` 來閱讀 systemd 日誌；例如：`journalctl -u kubelet`。

如果 systemd 不存在，kubelet 和容器運行時將寫入到 `/var/log` 目錄中的 `.log` 文件。
如果你想將日誌寫入其他地方，你可以通過輔助工具 `kube-log-runner` 間接運行 kubelet，
並使用該工具將 kubelet 日誌重定向到你所選擇的目錄。

<!--
By default, kubelet directs your container runtime to write logs into directories within
`/var/log/pods`.

For more information on `kube-log-runner`, read [System Logs](/docs/concepts/cluster-administration/system-logs/#klog).
-->
默認情況下，kubelet 指示你的容器運行時將日誌寫入 `/var/log/pods` 中的目錄。

有關 `kube-log-runner` 的更多信息，請閱讀[系統日誌](/zh-cn/docs/concepts/cluster-administration/system-logs/#klog)。

{{% /tab %}}
{{% tab name="Windows" %}}

<!--
By default, the kubelet writes logs to files within the directory `C:\var\logs`
(notice that this is not `C:\var\log`).

Although `C:\var\log` is the Kubernetes default location for these logs, several
cluster deployment tools set up Windows nodes to log to `C:\var\log\kubelet` instead.
-->
默認情況下，kubelet 將日誌寫入目錄 `C:\var\logs` 中的文件（注意這不是 `C:\var\log`）。

儘管 `C:\var\log` 是這些日誌的 Kubernetes 默認位置，
但一些集羣部署工具會將 Windows 節點設置爲將日誌放到 `C:\var\log\kubelet`。

<!--
If you want to have logs written elsewhere, you can indirectly
run the kubelet via a helper tool, `kube-log-runner`, and use that tool to redirect
kubelet logs to a directory that you choose.

However, by default, kubelet directs your container runtime to write logs within the
directory `C:\var\log\pods`.

For more information on `kube-log-runner`, read [System Logs](/docs/concepts/cluster-administration/system-logs/#klog).
-->
如果你想將日誌寫入其他地方，你可以通過輔助工具 `kube-log-runner` 間接運行 kubelet，
並使用該工具將 kubelet 日誌重定向到你所選擇的目錄。

但是，kubelet 默認指示你的容器運行時在目錄 `C:\var\log\pods` 中寫入日誌。

有關 `kube-log-runner` 的更多信息，請閱讀[系統日誌](/zh-cn/docs/concepts/cluster-administration/system-logs/#klog)。
{{% /tab %}}
{{< /tabs >}}

<br /><!-- work around rendering nit -->

<!--
For Kubernetes cluster components that run in pods, these write to files inside
the `/var/log` directory, bypassing the default logging mechanism (the components
do not write to the systemd journal). You can use Kubernetes' storage mechanisms
to map persistent storage into the container that runs the component.
-->
對於在 Pod 中運行的 Kubernetes 集羣組件，其日誌會寫入 `/var/log` 目錄中的文件，
相當於繞過默認的日誌機制（組件不會寫入 systemd 日誌）。
你可以使用 Kubernetes 的存儲機制將持久存儲映射到運行該組件的容器中。

<!--
Kubelet allows changing the pod logs directory from default `/var/log/pods`
to a custom path. This adjustment can be made by configuring the `podLogsDir`
parameter in the kubelet's configuration file.
-->
kubelet 允許將 Pod 日誌目錄從默認的 `/var/log/pods` 更改爲自定義路徑。
可以通過在 kubelet 的配置文件中配置 `podLogsDir` 參數來進行此調整。

{{< caution >}}
<!--
It's important to note that the default location `/var/log/pods` has been in use for
an extended period and certain processes might implicitly assume this path.
Therefore, altering this parameter must be approached with caution and at your own risk.
-->
需要注意的是，默認位置 `/var/log/pods` 已使用很長一段時間，並且某些進程可能會隱式使用此路徑。
因此，更改此參數必須謹慎，並自行承擔風險。

<!--
Another caveat to keep in mind is that the kubelet supports the location being on the same
disk as `/var`. Otherwise, if the logs are on a separate filesystem from `/var`,
then the kubelet will not track that filesystem's usage, potentially leading to issues if
it fills up.
-->
另一個需要留意的問題是 kubelet 支持日誌寫入位置與 `/var` 位於同一磁盤上。
否則，如果日誌位於與 `/var` 不同的文件系統上，kubelet
將不會跟蹤該文件系統的使用情況。如果文件系統已滿，則可能會出現問題。
{{< /caution >}}

<!--
For details about etcd and its logs, view the [etcd documentation](https://etcd.io/docs/).
Again, you can use Kubernetes' storage mechanisms to map persistent storage into
the container that runs the component.
-->
有關 etcd 及其日誌的詳細信息，請查閱 [etcd 文檔](https://etcd.io/docs/)。
同樣，你可以使用 Kubernetes 的存儲機制將持久存儲映射到運行該組件的容器中。

{{< note >}}
<!--
If you deploy Kubernetes cluster components (such as the scheduler) to log to
a volume shared from the parent node, you need to consider and ensure that those
logs are rotated. **Kubernetes does not manage that log rotation**.

Your operating system may automatically implement some log rotation - for example,
if you share the directory `/var/log` into a static Pod for a component, node-level
log rotation treats a file in that directory the same as a file written by any component
outside Kubernetes.

Some deploy tools account for that log rotation and automate it; others leave this
as your responsibility.
-->
如果你部署 Kubernetes 集羣組件（例如調度器）以將日誌記錄到從父節點共享的卷中，
則需要考慮並確保這些日誌被輪換。**Kubernetes 不管理這種日誌輪換**。

你的操作系統可能會自動實現一些日誌輪換。例如，如果你將目錄 `/var/log` 共享到一個組件的靜態 Pod 中，
則節點級日誌輪換會將該目錄中的文件視同爲 Kubernetes 之外的組件所寫入的文件。

一些部署工具會考慮日誌輪換並將其自動化；而其他一些工具會將此留給你來處理。
{{< /note >}}

<!--
## Cluster-level logging architectures

While Kubernetes does not provide a native solution for cluster-level logging, there are
several common approaches you can consider. Here are some options:

* Use a node-level logging agent that runs on every node.
* Include a dedicated sidecar container for logging in an application pod.
* Push logs directly to a backend from within an application.
-->
## 集羣級日誌架構   {#cluster-level-logging-architectures}

雖然 Kubernetes 沒有爲集羣級日誌記錄提供原生的解決方案，但你可以考慮幾種常見的方法。
以下是一些選項：

* 使用在每個節點上運行的節點級日誌記錄代理。
* 在應用程序的 Pod 中，包含專門記錄日誌的邊車（Sidecar）容器。
* 將日誌直接從應用程序中推送到日誌記錄後端。

<!--
### Using a node logging agent

![Using a node level logging agent](/images/docs/user-guide/logging/logging-with-node-agent.png)
-->
### 使用節點級日誌代理   {#using-a-node-logging-agent}

![使用節點級日誌代理](/images/docs/user-guide/logging/logging-with-node-agent.png)

<!--
You can implement cluster-level logging by including a _node-level logging agent_ on each node.
The logging agent is a dedicated tool that exposes logs or pushes logs to a backend.
Commonly, the logging agent is a container that has access to a directory with log files from all of the
application containers on that node.
-->
你可以通過在每個節點上使用**節點級的日誌記錄代理**來實現集羣級日誌記錄。
日誌記錄代理是一種用於暴露日誌或將日誌推送到後端的專用工具。
通常，日誌記錄代理程序是一個容器，它可以訪問包含該節點上所有應用程序容器的日誌文件的目錄。

<!--
Because the logging agent must run on every node, it is recommended to run the agent
as a `DaemonSet`.

Node-level logging creates only one agent per node and doesn't require any changes to the
applications running on the node.
-->
由於日誌記錄代理必須在每個節點上運行，推薦以 `DaemonSet` 的形式運行該代理。

節點級日誌在每個節點上僅創建一個代理，不需要對節點上的應用做修改。

<!--
Containers write to stdout and stderr, but with no agreed format. A node-level agent collects
these logs and forwards them for aggregation.
-->
容器向標準輸出和標準錯誤輸出寫出數據，但在格式上並不統一。
節點級代理收集這些日誌並將其進行轉發以完成彙總。

<!--
### Using a sidecar container with the logging agent {#sidecar-container-with-logging-agent}

You can use a sidecar container in one of the following ways:
-->
### 使用邊車容器運行日誌代理   {#sidecar-container-with-logging-agent}

你可以通過以下方式之一使用邊車（Sidecar）容器：

<!--
* The sidecar container streams application logs to its own `stdout`.
* The sidecar container runs a logging agent, which is configured to pick up logs
  from an application container.
-->
* 邊車容器將應用程序日誌傳送到自己的標準輸出。
* 邊車容器運行一個日誌代理，配置該日誌代理以便從應用容器收集日誌。

<!--
#### Streaming sidecar container

![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

By having your sidecar containers write to their own `stdout` and `stderr`
streams, you can take advantage of the kubelet and the logging agent that
already run on each node. The sidecar containers read logs from a file, a socket,
or journald. Each sidecar container prints a log to its own `stdout` or `stderr` stream.
-->
#### 傳輸數據流的邊車容器

![帶數據流容器的邊車容器](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

利用邊車容器，寫入到自己的 `stdout` 和 `stderr` 傳輸流，
你就可以利用每個節點上的 kubelet 和日誌代理來處理日誌。
邊車容器從文件、套接字或 journald 讀取日誌。
每個邊車容器向自己的 `stdout` 和 `stderr` 流中輸出日誌。

<!--
This approach allows you to separate several log streams from different
parts of your application, some of which can lack support
for writing to `stdout` or `stderr`. The logic behind redirecting logs
is minimal, so it's not a significant overhead. Additionally, because
`stdout` and `stderr` are handled by the kubelet, you can use built-in tools
like `kubectl logs`.
-->
這種方法允許你將日誌流從應用程序的不同部分分離開，其中一些可能缺乏對寫入
`stdout` 或 `stderr` 的支持。重定向日誌背後的邏輯是最小的，因此它的開銷不大。
另外，因爲 `stdout` 和 `stderr` 由 kubelet 處理，所以你可以使用內置的工具 `kubectl logs`。

<!--
For example, a pod runs a single container, and the container
writes to two different log files using two different formats. Here's a
manifest for the Pod:
-->
例如，某 Pod 中運行一個容器，且該容器使用兩個不同的格式寫入到兩個不同的日誌文件。
下面是這個 Pod 的清單：

{{% code_sample file="admin/logging/two-files-counter-pod.yaml" %}}

<!--
It is not recommended to write log entries with different formats to the same log
stream, even if you managed to redirect both components to the `stdout` stream of
the container. Instead, you can create two sidecar containers. Each sidecar
container could tail a particular log file from a shared volume and then redirect
the logs to its own `stdout` stream.
-->
不建議在同一個日誌流中寫入不同格式的日誌條目，即使你成功地將其重定向到容器的 `stdout` 流。
相反，你可以創建兩個邊車容器。每個邊車容器可以從共享卷跟蹤特定的日誌文件，
並將文件內容重定向到各自的 `stdout` 流。

<!--
Here's a manifest for a pod that has two sidecar containers:
-->
下面是運行兩個邊車容器的 Pod 的清單：

{{% code_sample file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" %}}

<!--
Now when you run this pod, you can access each log stream separately by
running the following commands:
-->
現在當你運行這個 Pod 時，你可以運行如下命令分別訪問每個日誌流：

```shell
kubectl logs counter count-log-1
```

<!--
The output is similar to:
-->
輸出類似於：

```console
0: Fri Apr  1 11:42:26 UTC 2022
1: Fri Apr  1 11:42:27 UTC 2022
2: Fri Apr  1 11:42:28 UTC 2022
...
```

```shell
kubectl logs counter count-log-2
```

<!--
The output is similar to:
-->
輸出類似於：

```console
Fri Apr  1 11:42:29 UTC 2022 INFO 0
Fri Apr  1 11:42:30 UTC 2022 INFO 0
Fri Apr  1 11:42:31 UTC 2022 INFO 0
...
```

<!--
If you installed a node-level agent in your cluster, that agent picks up those log
streams automatically without any further configuration. If you like, you can configure
the agent to parse log lines depending on the source container.

Even for Pods that only have low CPU and memory usage (order of a couple of millicores
for cpu and order of several megabytes for memory), writing logs to a file and
then streaming them to `stdout` can double how much storage you need on the node.
If you have an application that writes to a single file, it's recommended to set
`/dev/stdout` as the destination rather than implement the streaming sidecar
container approach.
-->
如果你在集羣中安裝了節點級代理，由代理自動獲取上述日誌流，而無需任何進一步的配置。
如果你願意，你可以將代理配置爲根據源容器解析日誌行。

即使對於 CPU 和內存使用率較低的 Pod（CPU 爲幾毫核，內存爲幾兆字節），將日誌寫入一個文件，
將這些日誌流寫到 `stdout` 也有可能使節點所需的存儲量翻倍。
如果你有一個寫入特定文件的應用程序，則建議將 `/dev/stdout` 設置爲目標文件，而不是採用流式邊車容器方法。

<!--
Sidecar containers can also be used to rotate log files that cannot be rotated by
the application itself. An example of this approach is a small container running
`logrotate` periodically.
However, it's more straightforward to use `stdout` and `stderr` directly, and
leave rotation and retention policies to the kubelet.
-->
邊車容器還可用於輪換應用程序本身無法輪換的日誌文件。
這種方法的一個例子是定期運行 `logrotate` 的小容器。
但是，直接使用 `stdout` 和 `stderr` 更直接，而將輪換和保留策略留給 kubelet。

<!--
The node-level agent installed in your cluster picks up those log streams
automatically without any further configuration. If you like, you can configure
the agent to parse log lines depending on the source container.
-->
集羣中安裝的節點級代理會自動獲取這些日誌流，而無需進一步配置。
如果你願意，你也可以配置代理程序來解析源容器的日誌行。

<!--
Note, that despite low CPU and memory usage (order of couple of millicores
for cpu and order of several megabytes for memory), writing logs to a file and
then streaming them to `stdout` can double disk usage. If you have
an application that writes to a single file, it's generally better to set
`/dev/stdout` as destination rather than implementing the streaming sidecar
container approach.
-->
注意，儘管 CPU 和內存使用率都很低（以多個 CPU 毫核指標排序或者按內存的兆字節排序），
向文件寫日誌然後輸出到 `stdout` 流仍然會成倍地增加磁盤使用率。
如果你的應用向單一文件寫日誌，通常最好設置 `/dev/stdout` 作爲目標路徑，
而不是使用流式的邊車容器方式。

<!--
Sidecar containers can also be used to rotate log files that cannot be
rotated by the application itself. An example of this approach is a small container running logrotate periodically.
However, it's recommended to use `stdout` and `stderr` directly and leave rotation
and retention policies to the kubelet.
-->
如果應用程序本身不能輪換日誌文件，則可以通過邊車容器實現。
這種方式的一個例子是運行一個小的、定期輪換日誌的容器。
然而，還是推薦直接使用 `stdout` 和 `stderr`，將日誌的輪換和保留策略交給 kubelet。

<!--
#### Sidecar container with a logging agent

![Sidecar container with a logging agent](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)
-->
### 具有日誌代理功能的邊車容器

![含日誌代理的邊車容器](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

<!--
If the node-level logging agent is not flexible enough for your situation, you
can create a sidecar container with a separate logging agent that you have
configured specifically to run with your application.
-->
如果節點級日誌記錄代理程序對於你的場景來說不夠靈活，
你可以創建一個帶有單獨日誌記錄代理的邊車容器，將代理程序專門配置爲與你的應用程序一起運行。

{{< note >}}
<!--
Using a logging agent in a sidecar container can lead
to significant resource consumption. Moreover, you won't be able to access
those logs using `kubectl logs` because they are not controlled
by the kubelet.
-->
在邊車容器中使用日誌代理會帶來嚴重的資源損耗。
此外，你不能使用 `kubectl logs` 訪問日誌，因爲日誌並沒有被 kubelet 管理。
{{< /note >}}

<!--
Here are two example manifests that you can use to implement a sidecar container with a logging agent.
The first manifest contains a [`ConfigMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/)
to configure fluentd.
-->
下面是兩個配置文件，可以用來實現一個帶日誌代理的邊車容器。
第一個文件包含用來配置 fluentd 的
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)。

{{% code_sample file="admin/logging/fluentd-sidecar-config.yaml" %}}

{{< note >}}
<!--
In the sample configurations, you can replace fluentd with any logging agent, reading
from any source inside an application container.
-->
你可以將此示例配置中的 fluentd 替換爲其他日誌代理，從應用容器內的其他來源讀取數據。
{{< /note >}}

<!--
The second manifest describes a pod that has a sidecar container running fluentd.
The pod mounts a volume where fluentd can pick up its configuration data.
-->
第二個清單描述了一個運行 fluentd 邊車容器的 Pod。
該 Pod 掛載一個卷，fluentd 可以從這個捲上揀選其配置數據。

{{% code_sample file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" %}}

<!--
### Exposing logs directly from the application

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)
-->
### 從應用中直接暴露日誌目錄   {#exposing-logs-directly-from-the-application}

![直接從應用程序暴露日誌](/images/docs/user-guide/logging/logging-from-application.png)

<!--
Cluster-logging that exposes or pushes logs directly from every application is outside the scope
of Kubernetes.
-->
從各個應用中直接暴露和推送日誌數據的集羣日誌機制已超出 Kubernetes 的範圍。

## {{% heading "whatsnext" %}}

<!--
* Read about [Kubernetes system logs](/docs/concepts/cluster-administration/system-logs/)
* Learn about [Traces For Kubernetes System Components](/docs/concepts/cluster-administration/system-traces/)
* Learn how to [customise the termination message](/docs/tasks/debug/debug-application/determine-reason-pod-failure/#customizing-the-termination-message)
  that Kubernetes records when a Pod fails
-->
* 閱讀有關 [Kubernetes 系統日誌](/zh-cn/docs/concepts/cluster-administration/system-logs/)的信息
* 進一步瞭解[追蹤 Kubernetes 系統組件](/zh-cn/docs/concepts/cluster-administration/system-traces/)
* 瞭解當 Pod 失效時如何[定製 Kubernetes 記錄的終止消息](/zh-cn/docs/tasks/debug/debug-application/determine-reason-pod-failure/#customizing-the-termination-message)
