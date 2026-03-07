---
title: 可观测性
reviewers:
weight: 55
content_type: concept
description: >
  理解如何通过收集 **指标（metrics）**、**日志（logs）** 和 **链路（traces）** 来获得对 Kubernetes 集群的端到端可观测性。
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#metrics"
    title: 指标
  - anchor: "#logs"
    title: 日志
  - anchor: "#traces"
    title: 链路
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
在 Kubernetes 中，可观测性是通过收集和分析指标、日志和链路（通常被称为可观测性的三大支柱），
以便更好地了解集群的内部状态、性能和健康情况的过程。

<!--
Kubernetes control plane components, as well as many add-ons, generate and emit these signals. By aggregating and correlating them, you can gain a unified picture of the control plane, add-ons, and applications across the cluster.
-->
Kubernetes 控制平面组件以及许多插件都会生成并发出这些信号。
通过聚合这些信号并在其间建立关联，你可以获得整个集群中控制平面、插件和应用程序的统一视图。

<!--
Figure 1 outlines how cluster components emit the three primary signal types.
-->
图 1 概述了集群组件如何发出三种主要信号类型。

{{< mermaid >}}

flowchart LR
    A[集群组件] --> M[指标流水线]
    A --> L[日志流水线]
    A --> T[链路流水线]
    M --> S[(存储和分析)]
    L --> S
    T --> S
    S --> O[操作员和自动化组件]
{{< /mermaid >}}


*图 1. 集群组件发出的大致信号及其消费者。*

<!-- body -->

<!--
## Metrics
-->
## 指标 {#metrics}

<!--
Kubernetes components emit metrics in [Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/) from their `/metrics` endpoints, including:

- kube-controller-manager
- kube-proxy
- kube-apiserver
- kube-scheduler
- kubelet
-->
Kubernetes 组件在其 `/metrics` 端点以 [Prometheus 格式](https://prometheus.io/docs/instrumenting/exposition_formats/)
发出指标；这些组件包括：

- kube-controller-manager
- kube-proxy
- kube-apiserver
- kube-scheduler
- kubelet

<!--
The kubelet also exposes metrics at `/metrics/cadvisor`, `/metrics/resource`, and `/metrics/probes`, and add-ons such as [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/) enrich those control plane signals with Kubernetes object status.
-->
kubelet 还在 `/metrics/cadvisor`、`/metrics/resource`
和 `/metrics/probes` 端点公开指标。
像 [kube-state-metrics](/zh-cn/docs/concepts/cluster-administration/kube-state-metrics/) 
这样的插件会用 Kubernetes 对象状态丰富这些控制平面信号。

<!--
A typical Kubernetes metrics pipeline periodically scrapes these endpoints and stores the samples in a time series database (for example with Prometheus).
-->
典型的 Kubernetes 指标流水线会定期抓取这些端点，
并将样本存储在时序数据库中（例如使用 Prometheus）。

<!--
See the [system metrics guide](/docs/concepts/cluster-administration/system-metrics/) for details and configuration options.

Figure 2 outlines a common Kubernetes metrics pipeline.
-->
有关详细信息和配置选项，请参阅[系统指标指南](/zh-cn/docs/concepts/cluster-administration/system-metrics/)。

图 2 概述了一个常见的 Kubernetes 指标流水线。

{{< mermaid >}}
flowchart LR
    C[集群组件] --> P[Prometheus 抓取器]
    P --> TS[(时序存储)]
    TS --> D[仪表板和告警]
    TS --> A[自动化操作]
{{< /mermaid >}}

<!--
*Figure 2. Components of a typical Kubernetes metrics pipeline.*

For multi-cluster or multi-cloud visibility, distributed time series databases (for example Thanos or Cortex) can complement Prometheus.
-->
*图 2. 典型 Kubernetes 指标流水线的组件。*

对于多集群或多云可观测性，分布式时序数据库（例如 Thanos 或 Cortex）
可以补充 Prometheus。

<!--
See [Common observability tools - metrics tools](#metrics-tools) for metrics scrapers and time series databases.
-->
有关指标抓取器和时间序列数据库的信息，
请参阅[常见可观测性工具 - 指标工具](#metrics-tools)。

<!--
#### {{% heading "seealso" %}}

- [System metrics for Kubernetes components](/docs/concepts/cluster-administration/system-metrics/)
- [Resource usage monitoring with metrics-server](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- [kube-state-metrics concept](/docs/concepts/cluster-administration/kube-state-metrics/)
- [Resource metrics pipeline overview](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
-->
#### {{% heading "seealso" %}}

- [Kubernetes 组件的系统指标](/zh-cn/docs/concepts/cluster-administration/system-metrics/)
- [使用 metrics-server 监控资源使用情况](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- [kube-state-metrics 概念](/zh-cn/docs/concepts/cluster-administration/kube-state-metrics/)
- [资源指标流水线概述](/zh-cn/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)

<!--
## Logs

Logs provide a chronological record of events inside applications, Kubernetes system components, and security-related activities such as audit logging.
-->
## 日志 {#logs}

日志为应用程序、Kubernetes 系统组件的内部事件，以及与安全相关的活动（例如审计日志）提供按时序排列的记录。

<!--
Container runtimes capture a containerized application's output from standard output (`stdout`) and standard error (`stderr`) streams. While runtimes implement this differently, the integration with the kubelet is standardized through the _CRI logging format_, and the kubelet makes these logs available through `kubectl logs`.
-->
容器运行时从标准输出（`stdout`）和标准错误（`stderr`）流捕获容器化应用程序的输出。
虽然运行时以不同方式实现此功能，但它们与 kubelet 的集成通过 **CRI 日志格式**标准化，
kubelet 通过 `kubectl logs` 使这些日志可被访问。

<!--
![Node-level logging](/images/docs/user-guide/logging/logging-node-level.png)

*Figure 3a. Node-level logging architecture.*
-->
![节点级日志记录](/images/docs/user-guide/logging/logging-node-level.png)

*图 3a. 节点级日志记录架构。*

<!--
System component logs capture events from the cluster and are often useful for debugging and troubleshooting. These components are classified in two different ways: those that run in a container and those that do not. For example, the `kube-scheduler` and `kube-proxy` usually run in containers, whereas the `kubelet` and the container runtime run directly on the host.
-->
系统组件日志捕获来自集群的事件，通常对调试和故障排查很有用。
这些组件可以分类为两种不同方式：在容器中运行的组件和不在容器中运行的组件。
例如，`kube-scheduler` 和 `kube-proxy` 通常在容器中运行，
而 `kubelet` 和容器运行时直接在主机上运行。

<!--
- On machines with `systemd`, the kubelet and container runtime write to journald. Otherwise, they write to `.log` files in the `/var/log` directory.
- System components that run inside containers always write to `.log` files in `/var/log`, bypassing the default container logging mechanism.
-->
- 在安装了 `systemd` 的机器上，kubelet 和容器运行时写入 journald。
  否则，它们写入 `/var/log` 目录中的 `.log` 文件。
- 在容器内运行的系统组件始终写入 `/var/log` 中的 `.log` 文件，
  绕过默认的容器日志记录机制。

<!--
System component and container logs stored under `/var/log` require log rotation to prevent uncontrolled growth. Some cluster provisioning scripts install log rotation by default; verify your environment and adjust as needed. See the [system logs reference](/docs/concepts/cluster-administration/system-logs/) for details on locations, formats, and configuration options.
-->
存储在 `/var/log` 下的系统组件和容器日志需要进行日志轮转以防止不受控制的增长。
某些集群配置脚本默认安装日志轮转；请检查你的环境并根据需要进行调整。
有关位置、格式和配置选项的详细信息，请参阅[系统日志参考](/zh-cn/docs/concepts/cluster-administration/system-logs/)。

<!--
Most clusters run a node-level logging agent (for example, Fluent Bit or Fluentd) that tails these files and forwards entries to a central log store. The [logging architecture guidance](/docs/concepts/cluster-administration/logging/) explains how to design such pipelines, apply retention, and log flows to backends.

Figure 3 outlines a common log aggregation pipeline.
-->
大多数集群运行一个节点级日志记录代理（例如 Fluent Bit 或 Fluentd），
该代理尾部跟踪这些日志文件并将日志条目转发到某集中式日志存储。
[日志记录架构指南](/zh-cn/docs/concepts/cluster-administration/logging/)
解释了如何设计此类流水线、如何实施保留策略以及如何将日志流传输到后端。

图 3 概述了一个常见的日志聚合流水线。

{{< mermaid >}}
flowchart LR
    subgraph Sources
        A[应用程序stdout/stderr]
        B[控制平面日志]
        C[审计记录]
    end
    A --> N[节点日志代理]
    B --> N
    C --> N
    N --> L[集中式日志存储]
    L --> Q[仪表板、告警、SIEM]
{{< /mermaid >}}


*图 3. 典型 Kubernetes 日志流水线的组件。*
<!--
*Figure 3. Components of a typical Kubernetes logs pipeline.*

See [Common observability tools - logging tools](#logging-tools) for logging agents and central log stores.

#### {{% heading "seealso" %}}

- [Logging architecture](/docs/concepts/cluster-administration/logging/)
- [System logs](/docs/concepts/cluster-administration/system-logs/)
- [Logging tasks and tutorials](/docs/tasks/debug/logging/)
- [Configure audit logging](/docs/tasks/debug/debug-cluster/audit/)
-->
有关日志记录代理和集中式日志存储的信息，请参阅[常见可观测性工具 - 日志工具](#logging-tools)。

#### {{% heading "seealso" %}}

- [日志记录架构](/zh-cn/docs/concepts/cluster-administration/logging/)
- [系统日志](/zh-cn/docs/concepts/cluster-administration/system-logs/)
- [日志记录任务和教程](/zh-cn/docs/tasks/debug/logging/)
- [配置审计日志](/zh-cn/docs/tasks/debug/debug-cluster/audit/)

<!--
## Traces

Traces capture how requests moves across Kubernetes components and applications, linking latency, timing and relationships between operations.By collecting traces, you can visualize end-to-end request flow, diagnose performance issues, and identify bottlenecks or unexpected interactions in the control plane, add-ons, or applications.
-->
## 链路 {#traces}

链路数据记录请求如何在 Kubernetes 组件和应用程序之间移动，
将操作之间的延迟、时序和关系联系起来。
通过收集链路数据，你可以将端到端的请求流可视化、诊断性能问题，
并发现控制平面、插件或应用程序中的瓶颈或意外交互。

<!--
Kubernetes {{< skew currentVersion >}} can export spans over the [OpenTelemetry Protocol](/docs/concepts/cluster-administration/system-traces/) (OTLP), either directly via built-in gRPC exporters or by forwarding them through an OpenTelemetry Collector.
-->
Kubernetes {{< skew currentVersion >}} 可以通过 [OpenTelemetry 协议](/zh-cn/docs/concepts/cluster-administration/system-traces/)
（OTLP）导出跨度（span）数据，既可以直接通过内置的 gRPC 导出器导出，
也可以通过 OpenTelemetry Collector 转发它们。

<!--
The OpenTelemetry Collector receives spans from components and applications, processes them (for example by applying sampling or redaction), and forwards them to a tracing backend for storage and analysis.

Figure 4 outlines a typical distributed tracing pipeline.
-->
OpenTelemetry Collector 从组件和应用程序接收跨度数据，
处理它们（例如通过执行某些采样或编辑动作），
并将它们转发到链路后端进行存储和分析。

图 4 概述了一个典型的分布式链路流水线。

{{< mermaid >}}
flowchart LR
    subgraph Sources
        A[控制平面跨度]
        B[应用程序跨度]
    end
    A --> X[OTLP 导出器]
    B --> X
    X --> COL[OpenTelemetry Collector]
    COL --> TS[(链路后端)]
    TS --> V[可视化和分析]
{{< /mermaid >}}


*图 4. 典型 Kubernetes 链路流水线的组件。*
<!--
*Figure 4. Components of a typical Kubernetes traces pipeline.*

See [Common observability tools - tracing tools](#tracing-tools) for tracing collectors and backends.

#### {{% heading "seealso" %}}

- [System traces for Kubernetes components](/docs/concepts/cluster-administration/system-traces/)
- [OpenTelemetry Collector getting started guide](https://opentelemetry.io/docs/collector/getting-started/)
- [Monitoring and tracing tasks](/docs/tasks/debug/monitoring/)
-->
有关链路收集器和后端的信息，请参阅[常见可观测性工具 - 链路工具](#tracing-tools)。

#### {{% heading "seealso" %}}

- [Kubernetes 组件的系统链路](/zh-cn/docs/concepts/cluster-administration/system-traces/)
- [OpenTelemetry Collector 入门指南](https://opentelemetry.io/docs/collector/getting-started/)
- [监控和链路任务](/zh-cn/docs/tasks/debug/monitoring/)

<!--
## Common observability tools

{{% thirdparty-content %}}

Note: This section links to third-party projects that provide observability capabilities required by Kubernetes.
The Kubernetes project authors aren't responsible for these projects, which are listed alphabetically. To add a
project to this list, read the [content guide](/docs/contribute/style/content-guide/) before submitting a change.
-->
## 常见可观测性工具 {#common-observability-tools}

{{% thirdparty-content %}}

注意：本节包含指向提供 Kubernetes 所需可观测性能力的第三方项目的链接。
Kubernetes 项目作者不对这些项目负责，这些项目按字母顺序列出。
要将项目添加到此列表，请在提交更改之前阅读[内容指南](/zh-cn/docs/contribute/style/content-guide/)。

<!--
### Metrics tools

- [Cortex](https://cortexmetrics.io/) offers horizontally scalable, long-term Prometheus storage.
- [Grafana Mimir](https://grafana.com/oss/mimir/) is a Grafana Labs project that provides multi-tenant, horizontally scalable Prometheus-compatible storage.
- [Prometheus](https://prometheus.io/) is the monitoring system that scrapes and stores metrics from Kubernetes components.
- [Thanos](https://thanos.io/) extends Prometheus with global querying, downsampling, and object storage support.
-->
### 指标工具 {#metrics-tools}

- [Cortex](https://cortexmetrics.io/) 提供水平可扩展的长期 Prometheus 存储。
- [Grafana Mimir](https://grafana.com/oss/mimir/) 是一个 Grafana Labs 项目，
  提供多租户、水平可扩展的 Prometheus 兼容存储。
- [Prometheus](https://prometheus.io/) 是从 Kubernetes 组件抓取和存储指标的监控系统。
- [Thanos](https://thanos.io/) 使用全局查询、下采样和对象存储支持扩展 Prometheus。

<!--
### Logging tools

- [Elasticsearch](https://www.elastic.co/elasticsearch/) delivers distributed log indexing and search.
- [Fluent Bit](https://fluentbit.io/) collects and forwards container and node logs with a low resource footprint.
- [Fluentd](https://www.fluentd.org/) routes and transforms logs to multiple destinations.
- [Grafana Loki](https://grafana.com/oss/loki/) stores logs in a Prometheus-inspired, label-based format.
- [OpenSearch](https://opensearch.org/) provides open source log indexing and search compatible with Elasticsearch APIs.
-->
### 日志工具 {#logging-tools}

- [Elasticsearch](https://www.elastic.co/elasticsearch/) 提供分布式日志索引和搜索。
- [Fluent Bit](https://fluentbit.io/) 以低资源占用收集并转发容器和节点日志。
- [Fluentd](https://www.fluentd.org/) 将日志路由和转换到多个目标。
- [Grafana Loki](https://grafana.com/oss/loki/) 以 Prometheus 启发的基于标签的格式存储日志。
- [OpenSearch](https://opensearch.org/) 提供与 Elasticsearch API 兼容的开源日志索引和搜索。

<!--
### Tracing tools

- [Grafana Tempo](https://grafana.com/oss/tempo/) offers scalable, low-cost distributed tracing storage.
- [Jaeger](https://www.jaegertracing.io/) captures and visualizes distributed traces for microservices.
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) receives, processes, and exports telemetry data including traces.
- [Zipkin](https://zipkin.io/) provides distributed tracing collection and visualization.
-->
### 链路工具 {#tracing-tools}

- [Grafana Tempo](https://grafana.com/oss/tempo/) 提供可扩展、低成本的分布式链路存储。
- [Jaeger](https://www.jaegertracing.io/) 捕获并可视化微服务的分布式链路。
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) 接收、处理和导出包括链路在内的遥测数据。
- [Zipkin](https://zipkin.io/) 提供分布式链路收集和可视化。

<!--
## {{% heading "whatsnext" %}}

- Learn how to [collect resource usage metrics with metrics-server](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- Explore [logging tasks and tutorials](/docs/tasks/debug/logging/)
- Follow the [monitoring and tracing task guides](/docs/tasks/debug/monitoring/)
- Review the [system metrics guide](/docs/concepts/cluster-administration/system-metrics/) for component endpoints and stability
- Review the [common observability tools](#common-observability-tools) section for vetted third-party options
-->
## {{% heading "whatsnext" %}}

- 了解如何[使用 metrics-server 收集资源使用指标](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- 探索[日志记录任务和教程](/zh-cn/docs/tasks/debug/logging/)
- 阅读[监控和链路任务指南](/zh-cn/docs/tasks/debug/monitoring/)
- 查看[系统指标指南](/zh-cn/docs/concepts/cluster-administration/system-metrics/)以了解组件端点和稳定性
- 查看[常见可观测性工具](#common-observability-tools)部分以了解经过验证的第三方选项
