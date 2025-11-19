---
title: 從 dockershim 遷移遙測和安全代理
content_type: task 
weight: 60
---
<!-- 
title: Migrating telemetry and security agents from dockershim
content_type: task 
reviewers:
- SergeyKanzhelev
weight: 60
-->

<!-- overview -->

{{% thirdparty-content %}}

<!-- 
Kubernetes' support for direct integration with Docker Engine is deprecated and
has been removed. Most apps do not have a direct dependency on runtime hosting
containers. However, there are still a lot of telemetry and monitoring agents
that have a dependency on Docker to collect containers metadata, logs, and
metrics. This document aggregates information on how to detect these
dependencies as well as links on how to migrate these agents to use generic tools or
alternative runtimes.
-->
Kubernetes 對與 Docker Engine 直接集成的支持已被棄用且已經被刪除。
大多數應用程序不直接依賴於託管容器的運行時。但是，仍然有大量的遙測和監控代理依賴
Docker 來收集容器元數據、日誌和指標。
本文彙總了一些如何探查這些依賴的信息以及如何遷移這些代理去使用通用工具或其他容器運行時的參考鏈接。

<!-- 
## Telemetry and security agents 
-->
## 遙測和安全代理 {#telemetry-and-security-agents}

<!-- 
Within a Kubernetes cluster there are a few different ways to run telemetry or security agents.
Some agents have a direct dependency on Docker Engine when they run as DaemonSets or
directly on nodes.
-->
在 Kubernetes 集羣中，有幾種不同的方式來運行遙測或安全代理。
一些代理在以 DaemonSet 的形式運行或直接在節點上運行時，直接依賴於 Docker Engine。

<!-- 
###  Why do some telemetry agents communicate with Docker Engine?
-->
### 爲什麼有些遙測代理會與 Docker Engine 通信？

<!-- 
Historically, Kubernetes was written to work specifically with Docker Engine.
Kubernetes took care of networking and scheduling, relying on Docker Engine for
launching and running containers (within Pods) on a node. Some information that
is relevant to telemetry, such as a pod name, is only available from Kubernetes
components. Other data, such as container metrics, is not the responsibility of
the container runtime. Early telemetry agents needed to query the container
runtime *and* Kubernetes to report an accurate picture. Over time, Kubernetes
gained the ability to support multiple runtimes, and now supports any runtime
that is compatible with the [container runtime interface](/docs/concepts/architecture/cri/).
-->
從歷史上看，Kubernetes 是專門爲與 Docker Engine 一起工作而編寫的。
Kubernetes 負責網絡和調度，依靠 Docker Engine
在節點上啓動並運行容器（在 Pod 內）。一些與遙測相關的信息，例如 pod 名稱，
只能從 Kubernetes 組件中獲得。其他數據，例如容器指標，不是容器運行時的責任。
早期遙測代理需要查詢容器運行時**和** Kubernetes 以報告準確的信息。
隨着時間的推移，Kubernetes 獲得了支持多種運行時的能力，
現在支持任何兼容[容器運行時接口](/zh-cn/docs/concepts/architecture/cri/)的運行時。

<!-- 
Some telemetry agents rely specifically on Docker Engine tooling. For example, an agent
might run a command such as
[`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)
or [`docker top`](https://docs.docker.com/engine/reference/commandline/top/) to list
containers and processes or [`docker logs`](https://docs.docker.com/engine/reference/commandline/logs/)
to receive streamed logs. If nodes in your existing cluster use
Docker Engine, and you switch to a different container runtime,
these commands will not work any longer.
-->
一些代理和 Docker 工具緊密綁定。比如代理會用到
[`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)
或 [`docker top`](https://docs.docker.com/engine/reference/commandline/top/)
這類命令來列出容器和進程，用
[`docker logs`](https://docs.docker.com/engine/reference/commandline/logs/)
訂閱 Docker 的日誌。
如果現有集羣中的節點使用 Docker Engine，在你切換到其它容器運行時的時候，
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
如果某 Pod 想調用運行在節點上的 `dockerd`，該 Pod 必須滿足以下兩個條件之一：

- 將包含 Docker 守護進程特權套接字的文件系統掛載爲一個{{< glossary_tooltip text="卷" term_id="volume" >}}；或
- 直接以卷的形式掛載 Docker 守護進程特權套接字的特定路徑。

<!-- 
For example: on COS images, Docker exposes its Unix domain socket at
`/var/run/docker.sock` This means that the pod spec will include a
`hostPath` volume mount of `/var/run/docker.sock`.
-->
舉例來說：在 COS 鏡像中，Docker 通過 `/var/run/docker.sock` 開放其 Unix 域套接字。
這意味着 Pod 的規約中需要包含 `hostPath` 卷以掛載 `/var/run/docker.sock`。

<!-- 
Here's a sample shell script to find Pods that have a mount directly mapping the
Docker socket. This script outputs the namespace and name of the pod. You can
remove the `grep '/var/run/docker.sock'` to review other mounts.
-->
下面是一個 shell 示例腳本，用於查找包含直接映射 Docker 套接字的掛載點的 Pod。
你也可以刪掉 `grep '/var/run/docker.sock'` 這一代碼片段以查看其它掛載信息。

```bash
kubectl get pods --all-namespaces \
-o=jsonpath='{range .items[*]}{"\n"}{.metadata.namespace}{":\t"}{.metadata.name}{":\t"}{range .spec.volumes[*]}{.hostPath.path}{", "}{end}{end}' \
| sort \
| grep '/var/run/docker.sock'
```

{{< note >}}
<!-- 
There are alternative ways for a pod to access Docker on the host. For instance, the parent
directory `/var/run` may be mounted instead of the full path (like in [this
example](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)).
The script above only detects the most common uses.
-->
對於 Pod 來說，訪問宿主機上的 Docker 還有其他方式。
例如，可以掛載 `/var/run` 的父目錄而非其完整路徑
（就像[這個例子](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)）。
上述腳本只檢測最常見的使用方式。
{{< /note >}}

<!-- 
### Detecting Docker dependency from node agents
-->
### 檢測節點代理對 Docker 的依賴性 {#detecting-docker-dependency-from-node-agents}

<!-- 
If your cluster nodes are customized and install additional security and
telemetry agents on the node, check with the agent vendor
to verify whether it has any dependency on Docker.
-->
在你的集羣節點被定製、且在各個節點上均安裝了額外的安全和遙測代理的場景下，
一定要和代理的供應商確認：該代理是否依賴於 Docker。

<!-- 
### Telemetry and security agent vendors
-->
### 遙測和安全代理的供應商 {#telemetry-and-security-agent-vendors}

<!-- 
This section is intended to aggregate information about various telemetry and
security agents that may have a dependency on container runtimes.

We keep the work in progress version of migration instructions for various telemetry and security agent vendors
in [Google doc](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#).
Please contact the vendor to get up to date instructions for migrating from dockershim.
-->
本節旨在彙總有關可能依賴於容器運行時的各種遙測和安全代理的信息。

我們通過[谷歌文檔](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#)
提供了爲各類遙測和安全代理供應商準備的持續更新的遷移指導。
請與供應商聯繫，獲取從 dockershim 遷移的最新說明。

<!--
## Migration from dockershim
-->
## 從 dockershim 遷移 {#migration-from-dockershim}

### [Aqua](https://www.aquasec.com)

<!--
No changes are needed: everything should work seamlessly on the runtime switch.
-->
無需更改：在運行時變更時可以無縫切換運行。

### [Datadog](https://www.datadoghq.com/product/)

<!--
How to migrate:
[Docker deprecation in Kubernetes](https://docs.datadoghq.com/agent/guide/docker-deprecation/)
The pod that accesses Docker Engine may have a name containing any of:

- `datadog-agent`
- `datadog`
- `dd-agent`
-->
如何遷移：
[Kubernetes 中對於 Docker 的棄用](https://docs.datadoghq.com/agent/guide/docker-deprecation/)。
名字中包含以下字符串的 Pod 可能訪問 Docker Engine：

- `datadog-agent`
- `datadog`
- `dd-agent`

### [Dynatrace](https://www.dynatrace.com/)

<!--
How to migrate:
[Migrating from Docker-only to generic container metrics in Dynatrace](https://community.dynatrace.com/t5/Best-practices/Migrating-from-Docker-only-to-generic-container-metrics-in/m-p/167030#M49)

Containerd support announcement: [Get automated full-stack visibility into
containerd-based Kubernetes
environments](https://www.dynatrace.com/news/blog/get-automated-full-stack-visibility-into-containerd-based-kubernetes-environments/)

CRI-O support announcement: [Get automated full-stack visibility into your CRI-O Kubernetes containers (Beta)](https://www.dynatrace.com/news/blog/get-automated-full-stack-visibility-into-your-cri-o-kubernetes-containers-beta/)

The pod accessing Docker may have name containing: 
- `dynatrace-oneagent`
-->
如何遷移：
[在 Dynatrace 上從 Docker-only 遷移到通用容器指標](https://community.dynatrace.com/t5/Best-practices/Migrating-from-Docker-only-to-generic-container-metrics-in/m-p/167030#M49)

containerd 支持公告：[在基於 containerd 的 Kubernetes 環境的獲取容器的自動化全棧可見性](https://www.dynatrace.com/news/blog/get-automated-full-stack-visibility-into-containerd-based-kubernetes-environments/)

CRI-O 支持公告：[在基於 CRI-O 的 Kubernetes 環境獲取容器的自動化全棧可見性（測試版）](https://www.dynatrace.com/news/blog/get-automated-full-stack-visibility-into-your-cri-o-kubernetes-containers-beta/)

名字中包含以下字符串的 Pod 可能訪問 Docker：

- `dynatrace-oneagent`

### [Falco](https://falco.org)

<!--
How to migrate:

[Migrate Falco from dockershim](https://falco.org/docs/getting-started/deployment/#docker-deprecation-in-kubernetes)
Falco supports any CRI-compatible runtime (containerd is used in the default configuration); the documentation explains all details.
The pod accessing Docker may have name containing: 
- `falco`
-->
如何遷移：
[遷移 Falco 從 dockershim](https://falco.org/docs/getting-started/deployment/#docker-deprecation-in-kubernetes)。
Falco 支持任何與 CRI 兼容的運行時（默認配置中使用 containerd）；該文檔解釋了所有細節。

名字中包含以下字符串的 Pod 可能訪問 Docker：

- `falco`

### [Prisma Cloud Compute](https://docs.paloaltonetworks.com/prisma/prisma-cloud.html)

<!--
Check [documentation for Prisma Cloud](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin-compute/install/install_kubernetes.html),
under the "Install Prisma Cloud on a CRI (non-Docker) cluster" section.
The pod accessing Docker may be named like:
- `twistlock-defender-ds`
-->
在依賴於 CRI（非 Docker）的集羣上安裝 Prisma Cloud 時，查看
[Prisma Cloud 提供的文檔](https://docs.paloaltonetworks.com/prisma/prisma-cloud/prisma-cloud-admin-compute/install/install_kubernetes.html)。

名字中包含以下字符串的 Pod 可能訪問 Docker：

- `twistlock-defender-ds`

### [SignalFx (Splunk)](https://www.splunk.com/en_us/investor-relations/acquisitions/signalfx.html)

<!--
The SignalFx Smart Agent (deprecated) uses several different monitors for Kubernetes including
`kubernetes-cluster`, `kubelet-stats/kubelet-metrics`, and `docker-container-stats`.
The `kubelet-stats` monitor was previously deprecated by the vendor, in favor of `kubelet-metrics`.
The `docker-container-stats` monitor is the one affected by dockershim removal.
Do not use the `docker-container-stats` with container runtimes other than Docker Engine.
-->
SignalFx Smart Agent（已棄用）在 Kubernetes 集羣上使用了多種不同的監視器，
包括 `kubernetes-cluster`，`kubelet-stats/kubelet-metrics`，`docker-container-stats`。
`kubelet-stats` 監視器此前已被供應商所棄用，現支持 `kubelet-metrics`。
`docker-container-stats` 監視器受 dockershim 移除的影響。
不要爲 `docker-container-stats` 監視器使用 Docker Engine 之外的運行時。

<!--
How to migrate from dockershim-dependent agent:
1. Remove `docker-container-stats` from the list of [configured monitors](https://github.com/signalfx/signalfx-agent/blob/main/docs/monitor-config.md).
   Note, keeping this monitor enabled with non-dockershim runtime will result in incorrect metrics
   being reported when docker is installed on node and no metrics when docker is not installed.
2. [Enable and configure `kubelet-metrics`](https://github.com/signalfx/signalfx-agent/blob/main/docs/monitors/kubelet-metrics.md) monitor.
-->
如何從依賴 dockershim 的代理遷移：

1. 從[所配置的監視器](https://github.com/signalfx/signalfx-agent/blob/main/docs/monitor-config.md)中移除 `docker-container-stats`。
   注意，若節點上已經安裝了 Docker，在非 dockershim 環境中啓用此監視器後會導致報告錯誤的指標；
   如果節點未安裝 Docker，則無法獲得指標。
2. [啓用和配置 `kubelet-metrics`](https://github.com/signalfx/signalfx-agent/blob/main/docs/monitors/kubelet-metrics.md) 監視器。

{{< note >}}
<!--
The set of collected metrics will change. Review your alerting rules and dashboards.
-->
收集的指標會發生變化。具體請查看你的告警規則和儀表盤。
{{< /note >}}

名字中包含以下字符串的 Pod 可能訪問 Docker：

- `signalfx-agent`

### Yahoo Kubectl Flame

<!--
Flame does not support container runtimes other than Docker. See
[https://github.com/yahoo/kubectl-flame/issues/51](https://github.com/yahoo/kubectl-flame/issues/51)
-->
Flame 不支持 Docker 以外的容器運行時，具體參見
[https://github.com/yahoo/kubectl-flame/issues/51](https://github.com/yahoo/kubectl-flame/issues/51)
