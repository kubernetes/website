---
title: 可觀測性
reviewers:
weight: 55
content_type: concept
description: >
  理解如何通過收集 **指標（metrics）**、**日誌（logs）** 和 **鏈路（traces）** 來獲得對 Kubernetes 叢集的端到端可觀測性。
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#metrics"
    title: 指標
  - anchor: "#logs"
    title: 日誌
  - anchor: "#traces"
    title: 鏈路
---
<!--
title: Observability
reviewers:
weight: 55
content_type: concept
description: >
  Understand how to gain end-to-end visibility of a Kubernetes cluster through the collection of metrics, logs, and traces.
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#metrics"
    title: Metrics
  - anchor: "#logs"
    title: Logs
  - anchor: "#traces"
    title: Traces
-->

<!-- overview -->
<!--
In Kubernetes, observability is the process of collecting and analyzing metrics, logs, and traces—often referred to as the three pillars of observability—in order to obtain a better understanding of the internal state, performance, and health of the cluster.
-->
在 Kubernetes 中，可觀測性是通過收集和分析指標、日誌和鏈路（通常被稱爲可觀測性的三大支柱），
以便更好地瞭解叢集的內部狀態、性能和健康情況的過程。

<!--
Kubernetes control plane components, as well as many add-ons, generate and emit these signals. By aggregating and correlating them, you can gain a unified picture of the control plane, add-ons, and applications across the cluster.
-->
Kubernetes 控制平面組件以及許多插件都會生成併發出這些信號。
通過聚合這些信號並在其間建立關聯，你可以獲得整個叢集中控制平面、插件和應用程序的統一視圖。

<!--
Figure 1 outlines how cluster components emit the three primary signal types.
-->
圖 1 概述了叢集組件如何發出三種主要信號類型。

{{< mermaid >}}

flowchart LR
    A[叢集組件] --> M[指標流水線]
    A --> L[日誌流水線]
    A --> T[鏈路流水線]
    M --> S[(存儲和分析)]
    L --> S
    T --> S
    S --> O[操作員和自動化組件]
{{< /mermaid >}}


*圖 1. 叢集組件發出的大致信號及其消費者。*

<!-- body -->

<!--
## Metrics
-->
## 指標 {#metrics}

<!--
Kubernetes components emit metrics in [Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/) from their `/metrics` endpoints, including:

- kube-controller-manager
- kube-proxy
- kube-apiserver
- kube-scheduler
- kubelet
-->
Kubernetes 組件在其 `/metrics` 端點以 [Prometheus 格式](https://prometheus.io/docs/instrumenting/exposition_formats/)
發出指標；這些組件包括：

- kube-controller-manager
- kube-proxy
- kube-apiserver
- kube-scheduler
- kubelet

<!--
The kubelet also exposes metrics at `/metrics/cadvisor`, `/metrics/resource`, and `/metrics/probes`, and add-ons such as [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/) enrich those control plane signals with Kubernetes object status.
-->
kubelet 還在 `/metrics/cadvisor`、`/metrics/resource`
和 `/metrics/probes` 端點公開指標。
像 [kube-state-metrics](/zh-cn/docs/concepts/cluster-administration/kube-state-metrics/) 
這樣的插件會用 Kubernetes 對象狀態豐富這些控制平面信號。

<!--
A typical Kubernetes metrics pipeline periodically scrapes these endpoints and stores the samples in a time series database (for example with Prometheus).
-->
典型的 Kubernetes 指標流水線會定期抓取這些端點，
並將樣本存儲在時序數據庫中（例如使用 Prometheus）。

<!--
See the [system metrics guide](/docs/concepts/cluster-administration/system-metrics/) for details and configuration options.

Figure 2 outlines a common Kubernetes metrics pipeline.
-->
有關詳細信息和設定選項，請參閱[系統指標指南](/zh-cn/docs/concepts/cluster-administration/system-metrics/)。

圖 2 概述了一個常見的 Kubernetes 指標流水線。

{{< mermaid >}}
flowchart LR
    C[叢集組件] --> P[Prometheus 抓取器]
    P --> TS[(時序存儲)]
    TS --> D[儀表板和告警]
    TS --> A[自動化操作]
{{< /mermaid >}}

<!--
*Figure 2. Components of a typical Kubernetes metrics pipeline.*

For multi-cluster or multi-cloud visibility, distributed time series databases (for example Thanos or Cortex) can complement Prometheus.
-->
*圖 2. 典型 Kubernetes 指標流水線的組件。*

對於多叢集或多雲可觀測性，分佈式時序數據庫（例如 Thanos 或 Cortex）
可以補充 Prometheus。

<!--
See [Common observability tools - metrics tools](#metrics-tools) for metrics scrapers and time series databases.
-->
有關指標抓取器和時間序列數據庫的信息，
請參閱[常見可觀測性工具 - 指標工具](#metrics-tools)。

<!--
#### {{% heading "seealso" %}}

- [System metrics for Kubernetes components](/docs/concepts/cluster-administration/system-metrics/)
- [Resource usage monitoring with metrics-server](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- [kube-state-metrics concept](/docs/concepts/cluster-administration/kube-state-metrics/)
- [Resource metrics pipeline overview](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
-->
#### {{% heading "seealso" %}}

- [Kubernetes 組件的系統指標](/zh-cn/docs/concepts/cluster-administration/system-metrics/)
- [使用 metrics-server 監控資源使用情況](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- [kube-state-metrics 概念](/zh-cn/docs/concepts/cluster-administration/kube-state-metrics/)
- [資源指標流水線概述](/zh-cn/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)

<!--
## Logs

Logs provide a chronological record of events inside applications, Kubernetes system components, and security-related activities such as audit logging.
-->
## 日誌 {#logs}

日誌爲應用程序、Kubernetes 系統組件的內部事件，以及與安全相關的活動（例如審計日誌）提供按時序排列的記錄。

<!--
Container runtimes capture a containerized application's output from standard output (`stdout`) and standard error (`stderr`) streams. While runtimes implement this differently, the integration with the kubelet is standardized through the _CRI logging format_, and the kubelet makes these logs available through `kubectl logs`.
-->
容器運行時從標準輸出（`stdout`）和標準錯誤（`stderr`）流捕獲容器化應用程序的輸出。
雖然運行時以不同方式實現此功能，但它們與 kubelet 的集成通過 **CRI 日誌格式**標準化，
kubelet 通過 `kubectl logs` 使這些日誌可被訪問。

<!--
![Node-level logging](/images/docs/user-guide/logging/logging-node-level.png)

*Figure 3a. Node-level logging architecture.*
-->
![節點級日誌記錄](/images/docs/user-guide/logging/logging-node-level.png)

*圖 3a. 節點級日誌記錄架構。*

<!--
System component logs capture events from the cluster and are often useful for debugging and troubleshooting. These components are classified in two different ways: those that run in a container and those that do not. For example, the `kube-scheduler` and `kube-proxy` usually run in containers, whereas the `kubelet` and the container runtime run directly on the host.
-->
系統組件日誌捕獲來自叢集的事件，通常對調試和故障排查很有用。
這些組件可以分類爲兩種不同方式：在容器中運行的組件和不在容器中運行的組件。
例如，`kube-scheduler` 和 `kube-proxy` 通常在容器中運行，
而 `kubelet` 和容器運行時直接在主機上運行。

<!--
- On machines with `systemd`, the kubelet and container runtime write to journald. Otherwise, they write to `.log` files in the `/var/log` directory.
- System components that run inside containers always write to `.log` files in `/var/log`, bypassing the default container logging mechanism.
-->
- 在安裝了 `systemd` 的機器上，kubelet 和容器運行時寫入 journald。
  否則，它們寫入 `/var/log` 目錄中的 `.log` 文件。
- 在容器內運行的系統組件始終寫入 `/var/log` 中的 `.log` 文件，
  繞過默認的容器日誌記錄機制。

<!--
System component and container logs stored under `/var/log` require log rotation to prevent uncontrolled growth. Some cluster provisioning scripts install log rotation by default; verify your environment and adjust as needed. See the [system logs reference](/docs/concepts/cluster-administration/system-logs/) for details on locations, formats, and configuration options.
-->
存儲在 `/var/log` 下的系統組件和容器日誌需要進行日誌輪轉以防止不受控制的增長。
某些叢集設定腳本默認安裝日誌輪轉；請檢查你的環境並根據需要進行調整。
有關位置、格式和設定選項的詳細信息，請參閱[系統日誌參考](/zh-cn/docs/concepts/cluster-administration/system-logs/)。

<!--
Most clusters run a node-level logging agent (for example, Fluent Bit or Fluentd) that tails these files and forwards entries to a central log store. The [logging architecture guidance](/docs/concepts/cluster-administration/logging/) explains how to design such pipelines, apply retention, and log flows to backends.

Figure 3 outlines a common log aggregation pipeline.
-->
大多數叢集運行一個節點級日誌記錄代理（例如 Fluent Bit 或 Fluentd），
該代理尾部跟蹤這些日誌文件並將日誌條目轉發到某集中式日誌存儲。
[日誌記錄架構指南](/zh-cn/docs/concepts/cluster-administration/logging/)
解釋瞭如何設計此類流水線、如何實施保留策略以及如何將日誌流傳輸到後端。

圖 3 概述了一個常見的日誌聚合流水線。

{{< mermaid >}}
flowchart LR
    subgraph Sources
        A[應用程序stdout/stderr]
        B[控制平面日誌]
        C[審計記錄]
    end
    A --> N[節點日誌代理]
    B --> N
    C --> N
    N --> L[集中式日誌存儲]
    L --> Q[儀表板、告警、SIEM]
{{< /mermaid >}}


*圖 3. 典型 Kubernetes 日誌流水線的組件。*
<!--
*Figure 3. Components of a typical Kubernetes logs pipeline.*

See [Common observability tools - logging tools](#logging-tools) for logging agents and central log stores.

#### {{% heading "seealso" %}}

- [Logging architecture](/docs/concepts/cluster-administration/logging/)
- [System logs](/docs/concepts/cluster-administration/system-logs/)
- [Logging tasks and tutorials](/docs/tasks/debug/logging/)
- [Configure audit logging](/docs/tasks/debug/debug-cluster/audit/)
-->
有關日誌記錄代理和集中式日誌存儲的信息，請參閱[常見可觀測性工具 - 日誌工具](#logging-tools)。

#### {{% heading "seealso" %}}

- [日誌記錄架構](/zh-cn/docs/concepts/cluster-administration/logging/)
- [系統日誌](/zh-cn/docs/concepts/cluster-administration/system-logs/)
- [日誌記錄任務和教程](/zh-cn/docs/tasks/debug/logging/)
- [設定審計日誌](/zh-cn/docs/tasks/debug/debug-cluster/audit/)

<!--
## Traces

Traces capture how requests moves across Kubernetes components and applications, linking latency, timing and relationships between operations.By collecting traces, you can visualize end-to-end request flow, diagnose performance issues, and identify bottlenecks or unexpected interactions in the control plane, add-ons, or applications.
-->
## 鏈路 {#traces}

鏈路數據記錄請求如何在 Kubernetes 組件和應用程序之間移動，
將操作之間的延遲、時序和關係聯繫起來。
通過收集鏈路數據，你可以將端到端的請求流可視化、診斷性能問題，
並發現控制平面、插件或應用程序中的瓶頸或意外交互。

<!--
Kubernetes {{< skew currentVersion >}} can export spans over the [OpenTelemetry Protocol](/docs/concepts/cluster-administration/system-traces/) (OTLP), either directly via built-in gRPC exporters or by forwarding them through an OpenTelemetry Collector.
-->
Kubernetes {{< skew currentVersion >}} 可以通過 [OpenTelemetry 協議](/zh-cn/docs/concepts/cluster-administration/system-traces/)
（OTLP）導出跨度（span）數據，既可以直接通過內置的 gRPC 導出器導出，
也可以通過 OpenTelemetry Collector 轉發它們。

<!--
The OpenTelemetry Collector receives spans from components and applications, processes them (for example by applying sampling or redaction), and forwards them to a tracing backend for storage and analysis.

Figure 4 outlines a typical distributed tracing pipeline.
-->
OpenTelemetry Collector 從組件和應用程序接收跨度數據，
處理它們（例如通過執行某些採樣或編輯動作），
並將它們轉發到鏈路後端進行存儲和分析。

圖 4 概述了一個典型的分佈式鏈路流水線。

{{< mermaid >}}
flowchart LR
    subgraph Sources
        A[控制平面跨度]
        B[應用程序跨度]
    end
    A --> X[OTLP 導出器]
    B --> X
    X --> COL[OpenTelemetry Collector]
    COL --> TS[(鏈路後端)]
    TS --> V[可視化和分析]
{{< /mermaid >}}


*圖 4. 典型 Kubernetes 鏈路流水線的組件。*
<!--
*Figure 4. Components of a typical Kubernetes traces pipeline.*

See [Common observability tools - tracing tools](#tracing-tools) for tracing collectors and backends.

#### {{% heading "seealso" %}}

- [System traces for Kubernetes components](/docs/concepts/cluster-administration/system-traces/)
- [OpenTelemetry Collector getting started guide](https://opentelemetry.io/docs/collector/getting-started/)
- [Monitoring and tracing tasks](/docs/tasks/debug/monitoring/)
-->
有關鏈路收集器和後端的信息，請參閱[常見可觀測性工具 - 鏈路工具](#tracing-tools)。

#### {{% heading "seealso" %}}

- [Kubernetes 組件的系統鏈路](/zh-cn/docs/concepts/cluster-administration/system-traces/)
- [OpenTelemetry Collector 入門指南](https://opentelemetry.io/docs/collector/getting-started/)
- [監控和鏈路任務](/zh-cn/docs/tasks/debug/monitoring/)

<!--
## Common observability tools

{{% thirdparty-content %}}

Note: This section links to third-party projects that provide observability capabilities required by Kubernetes.
The Kubernetes project authors aren't responsible for these projects, which are listed alphabetically. To add a
project to this list, read the [content guide](/docs/contribute/style/content-guide/) before submitting a change.
-->
## 常見可觀測性工具 {#common-observability-tools}

{{% thirdparty-content %}}

注意：本節包含指向提供 Kubernetes 所需可觀測性能力的第三方項目的鏈接。
Kubernetes 項目作者不對這些項目負責，這些項目按字母順序列出。
要將項目添加到此列表，請在提交更改之前閱讀[內容指南](/zh-cn/docs/contribute/style/content-guide/)。

<!--
### Metrics tools

- [Cortex](https://cortexmetrics.io/) offers horizontally scalable, long-term Prometheus storage.
- [Grafana Mimir](https://grafana.com/oss/mimir/) is a Grafana Labs project that provides multi-tenant, horizontally scalable Prometheus-compatible storage.
- [Prometheus](https://prometheus.io/) is the monitoring system that scrapes and stores metrics from Kubernetes components.
- [Thanos](https://thanos.io/) extends Prometheus with global querying, downsampling, and object storage support.
-->
### 指標工具 {#metrics-tools}

- [Cortex](https://cortexmetrics.io/) 提供水平可擴展的長期 Prometheus 存儲。
- [Grafana Mimir](https://grafana.com/oss/mimir/) 是一個 Grafana Labs 項目，
  提供多租戶、水平可擴展的 Prometheus 兼容存儲。
- [Prometheus](https://prometheus.io/) 是從 Kubernetes 組件抓取和存儲指標的監控系統。
- [Thanos](https://thanos.io/) 使用全局查詢、下采樣和對象存儲支持擴展 Prometheus。

<!--
### Logging tools

- [Elasticsearch](https://www.elastic.co/elasticsearch/) delivers distributed log indexing and search.
- [Fluent Bit](https://fluentbit.io/) collects and forwards container and node logs with a low resource footprint.
- [Fluentd](https://www.fluentd.org/) routes and transforms logs to multiple destinations.
- [Grafana Loki](https://grafana.com/oss/loki/) stores logs in a Prometheus-inspired, label-based format.
- [OpenSearch](https://opensearch.org/) provides open source log indexing and search compatible with Elasticsearch APIs.
-->
### 日誌工具 {#logging-tools}

- [Elasticsearch](https://www.elastic.co/elasticsearch/) 提供分佈式日誌索引和搜索。
- [Fluent Bit](https://fluentbit.io/) 以低資源佔用收集並轉發容器和節點日誌。
- [Fluentd](https://www.fluentd.org/) 將日誌路由和轉換到多個目標。
- [Grafana Loki](https://grafana.com/oss/loki/) 以 Prometheus 啓發的基於標籤的格式存儲日誌。
- [OpenSearch](https://opensearch.org/) 提供與 Elasticsearch API 兼容的開源日誌索引和搜索。

<!--
### Tracing tools

- [Grafana Tempo](https://grafana.com/oss/tempo/) offers scalable, low-cost distributed tracing storage.
- [Jaeger](https://www.jaegertracing.io/) captures and visualizes distributed traces for microservices.
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) receives, processes, and exports telemetry data including traces.
- [Zipkin](https://zipkin.io/) provides distributed tracing collection and visualization.
-->
### 鏈路工具 {#tracing-tools}

- [Grafana Tempo](https://grafana.com/oss/tempo/) 提供可擴展、低成本的分佈式鏈路存儲。
- [Jaeger](https://www.jaegertracing.io/) 捕獲並可視化微服務的分佈式鏈路。
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) 接收、處理和導出包括鏈路在內的遙測數據。
- [Zipkin](https://zipkin.io/) 提供分佈式鏈路收集和可視化。

<!--
## {{% heading "whatsnext" %}}

- Learn how to [collect resource usage metrics with metrics-server](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- Explore [logging tasks and tutorials](/docs/tasks/debug/logging/)
- Follow the [monitoring and tracing task guides](/docs/tasks/debug/monitoring/)
- Review the [system metrics guide](/docs/concepts/cluster-administration/system-metrics/) for component endpoints and stability
- Review the [common observability tools](#common-observability-tools) section for vetted third-party options
-->
## {{% heading "whatsnext" %}}

- 瞭解如何[使用 metrics-server 收集資源使用指標](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- 探索[日誌記錄任務和教程](/zh-cn/docs/tasks/debug/logging/)
- 閱讀[監控和鏈路任務指南](/zh-cn/docs/tasks/debug/monitoring/)
- 查看[系統指標指南](/zh-cn/docs/concepts/cluster-administration/system-metrics/)以瞭解組件端點和穩定性
- 查看[常見可觀測性工具](#common-observability-tools)部分以瞭解經過驗證的第三方選項
