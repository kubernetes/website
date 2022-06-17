---
title: 從 dockershim 遷移遙測和安全代理
content_type: task 
weight: 70
---
<!-- 
title: Migrating telemetry and security agents from dockershim
content_type: task 
reviewers:
- SergeyKanzhelev
weight: 70
-->

<!-- overview -->

<!-- 
Kubernetes' support for direct integration with Docker Engine is deprecated, and will be removed. Most apps do not have a direct dependency on runtime hosting containers. However, there are still a lot of telemetry and monitoring agents that has a dependency on docker to collect containers metadata, logs and metrics. This document aggregates information on how to detect these dependencies and links on how to migrate these agents to use generic tools or alternative runtimes.
-->
Kubernetes 對與 Docker Engine 直接整合的支援已被棄用並將被刪除。
大多數應用程式不直接依賴於託管容器的執行時。但是，仍然有大量的遙測和監控代理依賴
docker 來收集容器元資料、日誌和指標。
本文彙總了一些資訊和連結：資訊用於闡述如何探查這些依賴，連結用於解釋如何遷移這些代理去使用通用的工具或其他容器執行。

<!-- 
## Telemetry and security agents 
-->
## 遙測和安全代理 {#telemetry-and-security-agents}

<!-- 
Within a Kubernetes cluster there are a few different ways to run telemetry or security agents.
Some agents have a direct dependency on Docker Engine when they run as DaemonSets or
directly on nodes.
-->
在 Kubernetes 叢集中，有幾種不同的方式來執行遙測或安全代理。
一些代理在以 DaemonSet 的形式執行或直接在節點上執行時，直接依賴於 Docker Engine。

<!-- 
###  Why do some telemetry agents communicate with Docker Engine?
-->
### 為什麼有些遙測代理會與 Docker Engine 通訊？

<!-- 
Historically, Kubernetes was written to work specifically with Docker Engine.
Kubernetes took care of networking and scheduling, relying on Docker Engine for launching
and running containers (within Pods) on a node. Some information that is relevant to telemetry,
such as a pod name, is only available from Kubernetes components. Other data, such as container
metrics, is not the responsibility of the container runtime. Early telemetry agents needed to query the
container runtime **and** Kubernetes to report an accurate picture. Over time, Kubernetes gained
the ability to support multiple runtimes, and now supports any runtime that is compatible with
the container runtime interface.

-->
從歷史上看，Kubernetes 是專門為與 Docker Engine 一起工作而編寫的。
Kubernetes 負責網路和排程，依靠 Docker Engine
在節點上啟動並執行容器（在 Pod 內）。一些與遙測相關的資訊，例如 pod 名稱，
只能從 Kubernetes 元件中獲得。其他資料，例如容器指標，不是容器執行時的責任。
早期遙測代理需要查詢容器執行時**和** Kubernetes 以報告準確的資訊。
隨著時間的推移，Kubernetes 獲得了支援多種執行時的能力，現在支援任何相容容器執行時介面的執行時。

<!-- 
Some telemetry agents rely specifically on Docker Engine tooling. For example, an agent
might run a command such as
[`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)
or [`docker top`](https://docs.docker.com/engine/reference/commandline/top/) to list
containers and processes or [`docker logs`](https://docs.docker.com/engine/reference/commandline/logs/)
+to receive streamed logs. If nodes in your existing cluster use
+Docker Engine, and you switch to a different container runtime,
these commands will not work any longer.
-->
一些代理和 Docker 工具緊密繫結。比如代理會用到
[`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)
或 [`docker top`](https://docs.docker.com/engine/reference/commandline/top/)
這類命令來列出容器和程序，用
[`docker logs`](https://docs.docker.com/engine/reference/commandline/logs/)
訂閱 Docker 的日誌。
如果現有叢集中的節點使用 Docker Engine，在你切換到其它容器執行時的時候，
這些命令將不再起作用。

<!-- 
### Identify DaemonSets that depend on Docker Engine {#identify-docker-dependency}
-->
### 識別依賴於 Docker Engine 的 DaemonSet {#identify-docker-dependency}

<!-- 
If a pod wants to make calls to the `dockerd` running on the node, the pod must either:

- mount the filesystem containing the Docker daemon's privileged socket, as a
  {{< glossary_tooltip text="volume" term_id="volume" >}}; or
- mount the specific path of the Docker daemon's privileged socket directly, also as a volume.
-->
如果某 Pod 想呼叫執行在節點上的 `dockerd`，該 Pod 必須滿足以下兩個條件之一：

- 將包含 Docker 守護程序特權套接字的檔案系統掛載為一個{{< glossary_tooltip text="卷" term_id="volume" >}}；或
- 直接以卷的形式掛載 Docker 守護程序特權套接字的特定路徑。

<!-- 
For example: on COS images, Docker exposes its Unix domain socket at
`/var/run/docker.sock` This means that the pod spec will include a
`hostPath` volume mount of `/var/run/docker.sock`.
-->
舉例來說：在 COS 映象中，Docker 透過 `/var/run/docker.sock` 開放其 Unix 域套接字。
這意味著 Pod 的規約中需要包含 `hostPath` 卷以掛載 `/var/run/docker.sock`。

<!-- 
Here's a sample shell script to find Pods that have a mount directly mapping the
Docker socket. This script outputs the namespace and name of the pod. You can
remove the `grep '/var/run/docker.sock'` to review other mounts.
-->
下面是一個 shell 示例指令碼，用於查詢包含直接對映 Docker 套接字的掛載點的 Pod。
你也可以刪掉 `grep '/var/run/docker.sock'` 這一程式碼片段以檢視其它掛載資訊。

```bash
kubectl get pods --all-namespaces \
-o=jsonpath='{range .items[*]}{"\n"}{.metadata.namespace}{":\t"}{.metadata.name}{":\t"}{range .spec.volumes[*]}{.hostPath.path}{", "}{end}{end}' \
| sort \
| grep '/var/run/docker.sock'
```

<!-- 
There are alternative ways for a pod to access Docker on the host. For instance, the parent
directory `/var/run` may be mounted instead of the full path (like in [this
example](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)).
The script above only detects the most common uses.
-->
{{< note >}}
對於 Pod 來說，訪問宿主機上的 Docker 還有其他方式。
例如，可以掛載 `/var/run` 的父目錄而非其完整路徑
（就像[這個例子](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)）。
上述指令碼只檢測最常見的使用方式。
{{< /note >}}

<!-- 
### Detecting Docker dependency from node agents
-->
### 檢測節點代理對 Docker 的依賴性 {#detecting-docker-dependency-from-node-agents}

<!-- 
In case your cluster nodes are customized and install additional security and
telemetry agents on the node, make sure to check with the vendor of the agent whether it has dependency on Docker.
-->
在你的叢集節點被定製、且在各個節點上均安裝了額外的安全和遙測代理的場景下，
一定要和代理的供應商確認：該代理是否依賴於 Docker。

<!-- 
### Telemetry and security agent vendors
-->
### 遙測和安全代理的供應商 {#telemetry-and-security-agent-vendors}

<!-- 
We keep the work in progress version of migration instructions for various telemetry and security agent vendors
in [Google doc](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#).
Please contact the vendor to get up to date instructions for migrating from dockershim.
-->
我們透過
[谷歌文件](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#)
提供了為各類遙測和安全代理供應商準備的持續更新的遷移指導。
請與供應商聯絡，獲取從 dockershim 遷移的最新說明。
