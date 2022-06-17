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
Application logs can help you understand what is happening inside your application. The logs are particularly useful for debugging problems and monitoring cluster activity. Most modern applications have some kind of logging mechanism. Likewise, container engines are designed to support logging. The easiest and most adopted logging method for containerized applications is writing to standard output and standard error streams.
-->
應用日誌可以讓你瞭解應用內部的執行狀況。日誌對除錯問題和監控叢集活動非常有用。
大部分現代化應用都有某種日誌記錄機制。同樣地，容器引擎也被設計成支援日誌記錄。
針對容器化應用，最簡單且最廣泛採用的日誌記錄方式就是寫入標準輸出和標準錯誤流。

<!--
However, the native functionality provided by a container engine or runtime is usually not enough for a complete logging solution.
For example, you may want to access your application's logs if a container crashes; a pod gets evicted; or a node dies,
In a cluster, logs should have a separate storage and lifecycle independent of nodes, pods, or containers. This concept is called _cluster-level-logging_.
-->
但是，由容器引擎或執行時提供的原生功能通常不足以構成完整的日誌記錄方案。
例如，如果發生容器崩潰、Pod 被逐出或節點宕機等情況，你可能想訪問應用日誌。
在叢集中，日誌應該具有獨立的儲存和生命週期，與節點、Pod 或容器的生命週期相獨立。
這個概念叫 _叢集級的日誌_ 。

<!-- body -->

<!--
Cluster-level logging architectures require a separate backend to store, analyze, and query logs. Kubernetes
does not provide a native storage solution for log data. Instead, there are many logging solutions that
integrate with Kubernetes. The following sections describe how to handle and store logs on nodes.
-->
叢集級日誌架構需要一個獨立的後端用來儲存、分析和查詢日誌。
Kubernetes 並不為日誌資料提供原生的儲存解決方案。
相反，有很多現成的日誌方案可以整合到 Kubernetes 中。
下面各節描述如何在節點上處理和儲存日誌。

<!--
## Basic logging in Kubernetes

This example uses a `Pod` specification with a container
to write text to the standard output stream once per second.
-->
## Kubernetes 中的基本日誌記錄

這裡的示例使用包含一個容器的 Pod 規約，每秒鐘向標準輸出寫入資料。

{{< codenew file="debug/counter-pod.yaml" >}}

<!--
To run this pod, use the following command:
-->
用下面的命令執行 Pod：

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```

<!--
The output is:
-->
輸出結果為：

```
pod/counter created
```

<!--
To fetch the logs, use the `kubectl logs` command, as follows:
-->
像下面這樣，使用 `kubectl logs` 命令獲取日誌:

```shell
kubectl logs counter
```

<!--
The output is:
-->
輸出結果為：

```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

<!--
You can use `kubectl logs --previous` to retrieve logs from a previous instantiation of a container.
If your pod has multiple containers, specify which container's logs you want to access by
appending a container name to the command, with a `-c` flag, like so:
-->
你可以使用命令 `kubectl logs --previous` 檢索之前容器例項的日誌。
如果 Pod 中有多個容器，你應該為該命令附加容器名以訪問對應容器的日誌。
詳見 [`kubectl logs` 文件](/docs/reference/generated/kubectl/kubectl-commands#logs)。
如果 Pod 有多個容器，你應該為該命令附加容器名以訪問對應容器的日誌，
使用 `-c` 標誌來指定要訪問的容器的日誌，如下所示：

```console
kubectl logs counter -c count
```

<!--
See the [`kubectl logs` documentation](/docs/reference/generated/kubectl/kubectl-commands#logs) for more details.
-->
詳見 [`kubectl logs` 文件](/docs/reference/generated/kubectl/kubectl-commands#logs)。

<!--
## Logging at the node level

![Node level logging](/images/docs/user-guide/logging/logging-node-level.png)
-->
## 節點級日誌記錄

![節點級別的日誌記錄](/images/docs/user-guide/logging/logging-node-level.png)

<!--
A container engine handles and redirects any output generated to a containerized application's `stdout` and `stderr` streams.
For example, the Docker container engine redirects those two streams to [a logging driver](https://docs.docker.com/engine/admin/logging/overview), which is configured in Kubernetes to write to a file in JSON format.
-->
容器化應用寫入 `stdout` 和 `stderr` 的任何資料，都會被容器引擎捕獲並被重定向到某個位置。
例如，Docker 容器引擎將這兩個輸出流重定向到某個
[日誌驅動（Logging Driver）](https://docs.docker.com/engine/admin/logging/overview) ，
該日誌驅動在 Kubernetes 中配置為以 JSON 格式寫入檔案。

<!--
The Docker json logging driver treats each line as a separate message. When using the Docker logging driver, there is no direct support for multi-line messages. You need to handle multi-line messages at the logging agent level or higher.
-->
{{< note >}}
Docker JSON 日誌驅動將日誌的每一行當作一條獨立的訊息。
該日誌驅動不直接支援多行訊息。你需要在日誌代理級別或更高級別處理多行訊息。
{{< /note >}}

<!--
By default, if a container restarts, the kubelet keeps one terminated container with its logs. If a pod is evicted from the node, all corresponding containers are also evicted, along with their logs.
-->
預設情況下，如果容器重啟，kubelet 會保留被終止的容器日誌。
如果 Pod 在工作節點被驅逐，該 Pod 中所有的容器也會被驅逐，包括容器日誌。

<!--
An important consideration in node-level logging is implementing log rotation,
so that logs don't consume all available storage on the node. Kubernetes
is not responsible for rotating logs, but rather a deployment tool
should set up a solution to address that.
For example, in Kubernetes clusters, deployed by the `kube-up.sh` script,
there is a [`logrotate`](https://linux.die.net/man/8/logrotate)
tool configured to run each hour. You can also set up a container runtime to
rotate application's logs automatically.
-->
節點級日誌記錄中，需要重點考慮實現日誌的輪轉，以此來保證日誌不會消耗節點上全部可用空間。
Kubernetes 並不負責輪轉日誌，而是透過部署工具建立一個解決問題的方案。
例如，在用 `kube-up.sh` 部署的 Kubernetes 叢集中，存在一個
[`logrotate`](https://linux.die.net/man/8/logrotate)，每小時執行一次。
你也可以設定容器執行時來自動地輪轉應用日誌。

<!--
As an example, you can find detailed information about how `kube-up.sh` sets
up logging for COS image on GCP in the corresponding
[`configure-helper` script](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh).
-->
例如，你可以找到關於 `kube-up.sh` 為 GCP 環境的 COS 映象設定日誌的詳細資訊，
指令碼為
[`configure-helper` 指令碼](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh)。

<!--
When using a **CRI container runtime**, the kubelet is responsible for rotating the logs and managing the logging directory structure. The kubelet
sends this information to the CRI container runtime and the runtime writes the container logs to the given location. 
The two kubelet parameters [`containerLogMaxSize` and `containerLogMaxFiles`](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
in [kubelet config file](/docs/tasks/administer-cluster/kubelet-config-file/)
can be used to configure the maximum size for each log file and the maximum number of files allowed for each container respectively.
-->
當使用某 *CRI 容器執行時* 時，kubelet 要負責對日誌進行輪換，並
管理日誌目錄的結構。kubelet 將此資訊傳送給 CRI 容器執行時，後者
將容器日誌寫入到指定的位置。在 [kubelet 配置檔案](/docs/tasks/administer-cluster/kubelet-config-file/)
中的兩個 kubelet 引數
[`containerLogMaxSize` 和 `containerLogMaxFiles`](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
可以用來配置每個日誌檔案的最大長度和每個容器可以生成的日誌檔案個數上限。

<!--
When you run [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) as in
the basic logging example, the kubelet on the node handles the request and
reads directly from the log file. The kubelet returns the content of the log file.
-->
當執行 [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) 時，
節點上的 kubelet 處理該請求並直接讀取日誌檔案，同時在響應中返回日誌檔案內容。

<!--
If an external system has performed the rotation or a CRI container runtime is used,
only the contents of the latest log file will be available through
`kubectl logs`. For example, if there's a 10MB file, `logrotate` performs
the rotation and there are two files: one file that is 10MB in size and a second file that is empty.
`kubectl logs` returns the latest log file which in this example is an empty response.
-->
{{< note >}}
如果有外部系統執行日誌輪轉或者使用了 CRI 容器執行時，那麼 `kubectl logs` 
僅可查詢到最新的日誌內容。
比如，對於一個 10MB 大小的檔案，透過 `logrotate` 執行輪轉後生成兩個檔案，
一個 10MB 大小，一個為空，`kubectl logs` 返回最新的日誌檔案，而該日誌檔案
在這個例子中為空。
{{< /note >}}

<!--
### System component logs

There are two types of system components: those that run in a container and those
that do not run in a container. For example:
-->
### 系統元件日誌

系統元件有兩種型別：在容器中執行的和不在容器中執行的。例如：

<!--
* The Kubernetes scheduler and kube-proxy run in a container.
* The kubelet and container runtime do not run in containers.
-->
* 在容器中執行的 kube-scheduler 和 kube-proxy。
* 不在容器中執行的 kubelet 和容器執行時。

<!--
On machines with systemd, the kubelet and container runtime write to journald. If
systemd is not present, the kubelet and container runtime write to `.log` files
in the `/var/log` directory. System components inside containers always write
to the `/var/log` directory, bypassing the default logging mechanism.
They use the [`klog`](https://github.com/kubernetes/klog)
logging library. You can find the conventions for logging severity for those
components in the [development docs on logging](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).
-->
在使用 systemd 機制的伺服器上，kubelet 和容器執行時將日誌寫入到 journald 中。
如果沒有 systemd，它們將日誌寫入到 `/var/log` 目錄下的 `.log` 檔案中。
容器中的系統元件通常將日誌寫到 `/var/log` 目錄，繞過了預設的日誌機制。
他們使用 [klog](https://github.com/kubernetes/klog) 日誌庫。
你可以在[日誌開發文件](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
找到這些元件的日誌告警級別約定。

<!--
Similar to the container logs, system component logs in the `/var/log`
directory should be rotated. In Kubernetes clusters brought up by
the `kube-up.sh` script, those logs are configured to be rotated by
the `logrotate` tool daily or once the size exceeds 100MB.
-->
和容器日誌類似，`/var/log` 目錄中的系統元件日誌也應該被輪轉。
透過指令碼 `kube-up.sh` 啟動的 Kubernetes 叢集中，日誌被工具 `logrotate`
執行每日輪轉，或者日誌大小超過 100MB 時觸發輪轉。

<!--
## Cluster-level logging architectures

While Kubernetes does not provide a native solution for cluster-level logging, there are several common approaches you can consider. Here are some options:

* Use a node-level logging agent that runs on every node.
* Include a dedicated sidecar container for logging in an application pod.
* Push logs directly to a backend from within an application.
-->
## 叢集級日誌架構

雖然Kubernetes沒有為叢集級日誌記錄提供原生的解決方案，但你可以考慮幾種常見的方法。
以下是一些選項：

* 使用在每個節點上執行的節點級日誌記錄代理。
* 在應用程式的 Pod 中，包含專門記錄日誌的邊車（Sidecar）容器。
* 將日誌直接從應用程式中推送到日誌記錄後端。

<!--
### Using a node logging agent

![Using a node level logging agent](/images/docs/user-guide/logging/logging-with-node-agent.png)
-->
### 使用節點級日誌代理

![使用節點日誌記錄代理](/images/docs/user-guide/logging/logging-with-node-agent.png)

<!--
You can implement cluster-level logging by including a _node-level logging agent_ on each node. The logging agent is a dedicated tool that exposes logs or pushes logs to a backend. Commonly, the logging agent is a container that has access to a directory with log files from all of the application containers on that node.
-->
你可以透過在每個節點上使用 _節點級的日誌記錄代理_ 來實現叢集級日誌記錄。
日誌記錄代理是一種用於暴露日誌或將日誌推送到後端的專用工具。
通常，日誌記錄代理程式是一個容器，它可以訪問包含該節點上所有應用程式容器的日誌檔案的目錄。

<!--
Because the logging agent must run on every node, it's common to run the agent
as a `DaemonSet`.
Node-level logging creates only one agent per node, and doesn't require any changes to the applications running on the node. 
-->
由於日誌記錄代理必須在每個節點上執行，通常可以用 `DaemonSet` 的形式執行該代理。
節點級日誌在每個節點上僅建立一個代理，不需要對節點上的應用做修改。

<!--
Containers write to stdout and stderr, but with no agreed format. A node-level agent collects these logs and forwards them for aggregation.
-->
容器向標準輸出和標準錯誤輸出寫出資料，但在格式上並不統一。
節點級代理
收集這些日誌並將其進行轉發以完成彙總。

<!--
### Using a sidecar container with the logging agent {#sidecar-container-with-logging-agent}

You can use a sidecar container in one of the following ways:
-->
### 使用 sidecar 容器執行日誌代理   {#sidecar-container-with-logging-agent}

你可以透過以下方式之一使用邊車（Sidecar）容器：

<!--
* The sidecar container streams application logs to its own `stdout`.
* The sidecar container runs a logging agent, which is configured to pick up logs from an application container.
-->
* 邊車容器將應用程式日誌傳送到自己的標準輸出。
* 邊車容器執行一個日誌代理，配置該日誌代理以便從應用容器收集日誌。

<!--
#### Streaming sidecar container

![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

By having your sidecar containers stream to their own `stdout` and `stderr`
streams, you can take advantage of the kubelet and the logging agent that
already run on each node. The sidecar containers read logs from a file, a socket,
or the journald. Each sidecar container prints log to its own `stdout` or `stderr` stream.
-->
#### 傳輸資料流的 sidecar 容器

![帶資料流容器的邊車容器](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

利用邊車容器向自己的 `stdout` 和 `stderr` 傳輸流的方式，
你就可以利用每個節點上的 kubelet 和日誌代理來處理日誌。
邊車容器從檔案、套接字或 journald 讀取日誌。
每個邊車容器向自己的 `stdout` 和 `stderr` 流中輸出日誌。

<!--
This approach allows you to separate several log streams from different
parts of your application, some of which can lack support
for writing to `stdout` or `stderr`. The logic behind redirecting logs
is minimal, so it's hardly a significant overhead. Additionally, because
`stdout` and `stderr` are handled by the kubelet, you can use built-in tools
like `kubectl logs`.
-->
這種方法允許你將日誌流從應用程式的不同部分分離開，其中一些可能缺乏對寫入
`stdout` 或 `stderr` 的支援。重定向日誌背後的邏輯是最小的，因此它的開銷幾乎可以忽略不計。
另外，因為 `stdout`、`stderr` 由 kubelet 處理，你可以使用內建的工具 `kubectl logs`。

<!--
For example, a pod runs a single container, and the container
writes to two different log files, using two different formats. Here's a
configuration file for the Pod:
-->
例如，某 Pod 中執行一個容器，該容器向兩個檔案寫不同格式的日誌。
下面是這個 pod 的配置檔案:

{{< codenew file="admin/logging/two-files-counter-pod.yaml" >}}

<!--
It is not recommended to write log entries with different formats to the same log
stream, even if you managed to redirect both components to the `stdout` stream of
the container. Instead, you can create two sidecar containers. Each sidecar
container could tail a particular log file from a shared volume and then redirect
the logs to its own `stdout` stream.
-->
不建議在同一個日誌流中寫入不同格式的日誌條目，即使你成功地將其重定向到容器的
`stdout` 流。相反，你可以建立兩個邊車容器。每個邊車容器可以從共享卷
跟蹤特定的日誌檔案，並將檔案內容重定向到各自的 `stdout` 流。

<!--
Here's a configuration file for a pod that has two sidecar containers:
-->
下面是執行兩個邊車容器的 Pod 的配置檔案：

{{< codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" >}}

<!--
Now when you run this pod, you can access each log stream separately by
running the following commands:
-->
現在當你執行這個 Pod 時，你可以執行如下命令分別訪問每個日誌流：

```shell
kubectl logs counter count-log-1
```

<!--
The output is:
-->
輸出為：

```console
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

```shell
kubectl logs counter count-log-2
```

<!--
The output is:
-->
輸出為：

```console
Mon Jan  1 00:00:00 UTC 2001 INFO 0
Mon Jan  1 00:00:01 UTC 2001 INFO 1
Mon Jan  1 00:00:02 UTC 2001 INFO 2
...
```

<!--
The node-level agent installed in your cluster picks up those log streams
automatically without any further configuration. If you like, you can configure
the agent to parse log lines depending on the source container.
-->
叢集中安裝的節點級代理會自動獲取這些日誌流，而無需進一步配置。
如果你願意，你也可以配置代理程式來解析源容器的日誌行。

<!--
Note, that despite low CPU and memory usage (order of couple of millicores
for cpu and order of several megabytes for memory), writing logs to a file and
then streaming them to `stdout` can double disk usage. If you have
an application that writes to a single file, it's generally better to set
`/dev/stdout` as destination rather than implementing the streaming sidecar
container approach.
-->
注意，儘管 CPU 和記憶體使用率都很低（以多個 CPU 毫核指標排序或者按記憶體的兆位元組排序），
向檔案寫日誌然後輸出到 `stdout` 流仍然會成倍地增加磁碟使用率。
如果你的應用向單一檔案寫日誌，通常最好設定 `/dev/stdout` 作為目標路徑，
而不是使用流式的邊車容器方式。

<!--
Sidecar containers can also be used to rotate log files that cannot be
rotated by the application itself. An example of this approach is a small container running logrotate periodically.
However, it's recommended to use `stdout` and `stderr` directly and leave rotation
and retention policies to the kubelet.
-->
應用本身如果不具備輪轉日誌檔案的功能，可以透過邊車容器實現。
該方式的一個例子是執行一個小的、定期輪轉日誌的容器。
然而，還是推薦直接使用 `stdout` 和 `stderr`，將日誌的輪轉和保留策略
交給 kubelet。

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
如果節點級日誌記錄代理程式對於你的場景來說不夠靈活，你可以建立一個
帶有單獨日誌記錄代理的邊車容器，將代理程式專門配置為與你的應用程式一起執行。

{{< note >}}
<!--
Using a logging agent in a sidecar container can lead
to significant resource consumption. Moreover, you won't be able to access
those logs using `kubectl logs` command, because they are not controlled
by the kubelet.
-->
在邊車容器中使用日誌代理會帶來嚴重的資源損耗。
此外，你不能使用 `kubectl logs` 命令訪問日誌，因為日誌並沒有被 kubelet 管理。
{{< /note >}}

<!--
Here are two configuration files that you can use to implement a sidecar container with a logging agent. The first file contains
a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) to configure fluentd.
-->
下面是兩個配置檔案，可以用來實現一個帶日誌代理的邊車容器。
第一個檔案包含用來配置 fluentd 的
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)。

{{< codenew file="admin/logging/fluentd-sidecar-config.yaml" >}}

{{< note >}}
<!--
For information about configuring fluentd, see the [fluentd documentation](https://docs.fluentd.org/).
-->
要進一步瞭解如何配置 fluentd，請參考 [fluentd 官方文件](https://docs.fluentd.org/)。
{{< /note >}}

<!--
The second file describes a pod that has a sidecar container running fluentd.
The pod mounts a volume where fluentd can pick up its configuration data.
-->
第二個檔案描述了執行 fluentd 邊車容器的 Pod 。
flutend 透過 Pod 的掛載卷獲取它的配置資料。

{{< codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" >}}

<!--
In the sample configurations, you can replace fluentd with any logging agent, reading from any source inside an application container.
-->
在示例配置中，你可以將 fluentd 替換為任何日誌代理，從應用容器內
的任何來源讀取資料。

<!--
### Exposing logs directly from the application

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)
-->
### 從應用中直接暴露日誌目錄

![直接從應用程式暴露日誌](/images/docs/user-guide/logging/logging-from-application.png)

<!--
Cluster-logging that exposes or pushes logs directly from every application is outside the scope of Kubernetes.
-->
從各個應用中直接暴露和推送日誌資料的叢集日誌機制
已超出 Kubernetes 的範圍。

