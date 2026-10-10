---
title: Kubernetes 指标原生直方图支持
linkTitle: 原生直方图
content_type: concept
weight: 50
---
<!--
title: Native Histogram Support for Kubernetes Metrics
linkTitle: Native Histograms
content_type: concept
weight: 50
-->

<!-- overview -->

{{< feature-state feature_gate_name="NativeHistograms" >}}

<!--
Kubernetes components can expose histogram metrics in
[Prometheus Native Histogram](https://prometheus.io/docs/specs/native_histograms/) format,
alongside the classic histogram format. Native histograms use exponential bucket boundaries
instead of fixed boundaries, providing significant storage efficiency, improved query
performance, and finer-grained visibility into distributions.
-->
Kubernetes 组件可以以
[Prometheus 原生直方图](https://prometheus.io/docs/specs/native_histograms/)格式暴露直方图指标，
以及经典直方图格式。
原生直方图使用指数桶边界而不是固定边界，从而显著提高存储效率、改善查询性能，并更精细地了解分布情况。

<!-- body -->

<!--
## Before you begin
-->
## 准备工作

<!--
To use native histograms, you need:

- **Kubernetes v1.36 or later** with the `NativeHistograms`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled.
- **Prometheus 2.40 or later** to scrape and store native histograms.
  Prometheus 3.0+ is recommended for per-job configuration.
-->
要使用原生直方图，你需要：

- **Kubernetes v1.36 或更高版本**，并启用 `NativeHistograms`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
- **Prometheus 2.40 或更高版本**来抓取和存储原生直方图。
  推荐使用 Prometheus 3.0+ 进行 per-job 配置。

<!--
## What are native histograms?
-->
## 什么是原生直方图？

<!--
Classic Prometheus histograms use fixed bucket boundaries (for example,
`[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]` seconds).
Each bucket creates a separate time series (`_bucket`, `_count`, `_sum`),
which can lead to:

- **High storage costs** at scale, because each histogram generates many time series.
- **Accuracy issues**, because data points within a wide bucket range are
  indistinguishable. For example, a request completing in 1µs and one completing
  in 4ms both fall into the same `le="0.005"` bucket.
-->
经典 Prometheus 直方图使用固定桶边界（例如，
`[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]` 秒）。
每个桶创建一个单独的时间序列（`_bucket`、`_count`、`_sum`），这可能导致：

- **高存储成本**：因为每个直方图生成许多时间序列。
- **精度问题**：因为宽桶范围内的数据点无法区分。
  例如，完成时间为 1µs 和 4ms 的请求都落入同一个 `le="0.005"` 桶中。

<!--
[Native histograms](https://prometheus.io/docs/specs/native_histograms/)
address these limitations by using exponential bucket boundaries
that automatically adjust to the data distribution. Benefits include:

- **~10x reduction in time series count** per histogram metric, significantly
  reducing Prometheus storage and improving query performance.
- **Finer-grained resolution** for detecting performance regressions and setting
  precise SLO thresholds.
-->
[原生直方图](https://prometheus.io/docs/specs/native_histograms/)
通过使用自动适应数据分布的指数桶边界来解决这些限制。好处包括：

- 每个直方图指标的时间序列数量减少约 **10 倍**，显著降低 Prometheus 存储成本并提高查询性能。
- 更细粒度的分辨率，用于检测性能回归和设置精确的 SLO 阈值。

<!--
## How it works
-->
## 工作原理

<!--
When the `NativeHistograms` feature gate is enabled, Kubernetes components expose
histogram metrics in both classic and native formats simultaneously (dual exposition).
The format returned depends on the `Accept` header in the HTTP request
([Prometheus content negotiation](https://prometheus.io/docs/instrumenting/exposition_formats/#content-negotiation)).
Prometheus sets this header automatically based on your scrape configuration;
you only need to be aware of it when querying the `/metrics` endpoint directly.
-->
当 `NativeHistograms` 特性门控启用时，Kubernetes 组件同时以经典格式和原生格式（双暴露）暴露直方图指标。
返回的格式取决于 HTTP 请求中的 `Accept` 头
（[Prometheus 内容协商](https://prometheus.io/docs/instrumenting/exposition_formats/#content-negotiation)）。
Prometheus 根据你的抓取配置自动设置此头；
只有在直接查询 `/metrics` 端点时才需要关注它。

<!--
- **Text format** (Accept: `text/plain`, OpenMetrics 1.0): Returns only classic histogram
  buckets. Backward compatible with all existing tooling.
-->
- **文本格式**（Accept: `text/plain`，OpenMetrics 1.0）：仅返回经典直方图桶。
  向后兼容所有现有工具。

  ```
  # Classic histogram buckets (always present)
  apiserver_request_duration_seconds_bucket{le="0.005"} 1000
  apiserver_request_duration_seconds_bucket{le="0.01"} 2000
  ...
  apiserver_request_duration_seconds_bucket{le="+Inf"} 10000
  apiserver_request_duration_seconds_count 10000
  apiserver_request_duration_seconds_sum 450.5
  ```

<!--
- **Protobuf format** (Accept: `application/vnd.google.protobuf`): Contains both classic
  buckets and native histogram data. Prometheus automatically requests this
  format when `scrape_native_histograms: true` is set in the
  [Prometheus scrape configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)
  for the corresponding scrape job.
-->
- **Protobuf 格式**（Accept: `application/vnd.google.protobuf`）：包含经典桶和原生直方图数据。
  当在相应抓取作业的
  [Prometheus 抓取配置](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)中设置
  `scrape_native_histograms: true` 时，Prometheus 自动请求此格式。

<!--
This dual exposition strategy ensures:

- Existing dashboards and alerts continue to work without changes.
- Users can migrate queries to native histograms at their own pace.
- Prometheus stores whichever format it is configured to ingest.
-->
这种双暴露策略确保：

- 现有仪表板和告警继续正常工作，无需更改。
- 用户可以按自己的节奏将查询迁移到原生直方图。
- Prometheus 存储所配置接收的格式。

<!--
## Enabling native histograms
-->
## 启用原生直方图

<!--
Enabling native histograms is a two-step process: enable the feature gate on
Kubernetes components, and configure Prometheus to scrape native histograms.
-->
启用原生直方图是一个两步过程：在 Kubernetes 组件上启用特性门控，
并配置 Prometheus 抓取原生直方图。

<!--
### Step 1: Enable the Kubernetes feature gate
-->
### 步骤 1：启用 Kubernetes 特性门控

<!--
Enable the `NativeHistograms` feature gate on the Kubernetes components
you want to expose native histograms from:
-->
在你想要暴露原生直方图的 Kubernetes 组件上启用 `NativeHistograms` 特性门控：

```bash
--feature-gates=NativeHistograms=true
```

<!--
This feature gate applies to the following components:
-->
此特性门控适用于以下组件：

- kube-apiserver
- kube-controller-manager
- kube-scheduler
- kubelet
- kube-proxy

<!--
Each component's metrics are independent; you can enable or disable the feature
gate per component.
-->
每个组件的指标是独立的；你可以按组件启用或禁用特性门控。

<!--
### Step 2: Configure Prometheus
-->
### 步骤 2：配置 Prometheus

<!--
The Prometheus configuration depends on your Prometheus version.
-->
Prometheus 配置取决于你的 Prometheus 版本。

<!--
| Prometheus version | Native histogram support | Configuration                                                             | Notes                                                                        |
| ------------------ | ------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| < 2.40             | None                     | N/A                                                                       | Classic histograms only. Enabling the Kubernetes feature gate has no effect. |
| 2.40 – 2.x         | Experimental             | `--enable-feature=native-histograms` (global)                             | All-or-nothing; no per-job control.                                          |
| 3.0 – 3.7          | Stable                   | Per-job `scrape_native_histograms` and `always_scrape_classic_histograms` | Per-job configuration recommended. Global flag still supported.              |
| 3.8                | Stable                   | Per-job configuration (required for fine-grained control)                 | Global flag only changes default for all jobs.                               |
| 3.9+               | Stable                   | Per-job `scrape_native_histograms` only                                   | Global flag removed. Must use per-job configuration.                         |
-->
| Prometheus 版本 | 原生直方图支持 | 配置 | 备注 |
| ------------------ | ------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| < 2.40 | 无 | 不适用 | 仅经典直方图。启用 Kubernetes 特性门控无效。 |
| 2.40 – 2.x | 实验性 | `--enable-feature=native-histograms`（全局） | 全有或全无；无 per-job 控制。 |
| 3.0 – 3.7 | 稳定 | Per-job `scrape_native_histograms` 和 `always_scrape_classic_histograms` | 推荐使用 per-job 配置。全局标志仍然支持。 |
| 3.8 | 稳定 | Per-job 配置（细粒度控制必需） | 全局标志仅更改所有作业的默认值。 |
| 3.9+ | 稳定 | 仅 Per-job `scrape_native_histograms` | 全局标志已移除。必须使用 per-job 配置。 |

<!--
For Prometheus 3.x, use per-job configuration for fine-grained control:
-->
对于 Prometheus 3.x，使用 per-job 配置进行细粒度控制：

<!--
```yaml
scrape_configs:
  - job_name: 'kubernetes-apiservers'
    scrape_native_histograms: true            # Ingest native histograms
    always_scrape_classic_histograms: true     # Keep classic format during migration
```
-->
```yaml
scrape_configs:
  - job_name: 'kubernetes-apiservers'
    scrape_native_histograms: true            # 摄入原生直方图
    always_scrape_classic_histograms: true     # 迁移期间保留经典格式
```

<!--
Set both options to `true` during the migration period. This allows you to
ingest native histograms while keeping classic histograms for existing dashboards.
-->
在迁移期间将两个选项都设置为 `true`。
这允许你摄入原生直方图，同时为现有仪表板保留经典直方图。

{{< note >}}
<!--
Native histograms require the Protobuf exposition format. This is handled automatically by Prometheus by default. However, if you have customized `scrape_protocols`, ensure that `PrometheusProto` is included in the list.
-->
原生直方图需要 Protobuf 暴露格式。
这由 Prometheus 自动处理。但是，如果你自定义了 `scrape_protocols`，
请确保 `PrometheusProto` 包含在列表中。
{{< /note >}}

<!--
## Migrating dashboards and alerts
-->
## 迁移仪表板和告警

{{< caution >}}
<!--
If Prometheus is configured with `scrape_native_histograms: true` but
`always_scrape_classic_histograms: false` (the default), Prometheus ingests
native histograms only. Existing dashboards that use classic histogram queries
(for example, `histogram_quantile(..._bucket...)`) will show no data.
Always set `always_scrape_classic_histograms: true` during migration.
-->
如果 Prometheus 配置了 `scrape_native_histograms: true` 但
`always_scrape_classic_histograms: false`（默认值），Prometheus 仅摄入原生直方图。
使用经典直方图查询的现有仪表板（例如 `histogram_quantile(..._bucket...)`）将不显示数据。
在迁移期间始终将 `always_scrape_classic_histograms: true` 设置为 true。
{{< /caution >}}

<!--
When migrating from classic to native histogram queries, follow this workflow:
-->
从经典直方图查询迁移到原生直方图查询时，请遵循此工作流程：

<!--
1. **Enable both formats**: Set `scrape_native_histograms: true` and
   `always_scrape_classic_histograms: true` in your Prometheus scrape config.
-->
1. **启用两种格式**：在你的 Prometheus 抓取配置中设置
   `scrape_native_histograms: true` 和 `always_scrape_classic_histograms: true`。

<!--
2. **Migrate queries**: Update dashboard queries and alert expressions from
   classic histogram functions to native histogram equivalents.
-->
2. **迁移查询**：将仪表板查询和告警表达式从经典直方图函数更新为原生直方图等效函数。

   <!--
   Classic query:
   -->
   经典查询：
   ```promql
   histogram_quantile(0.99, rate(apiserver_request_duration_seconds_bucket[5m]))
   ```

   <!--
   Native histogram query:
   -->
   原生直方图查询：
   ```promql
   histogram_quantile(0.99, rate(apiserver_request_duration_seconds[5m]))
   ```

<!--
3. **Verify in staging**: Test all dashboards and alerts with native histogram
   queries before rolling out to production.
-->
3. **在预发布环境中验证**：在推送到生产环境之前，使用原生直方图查询测试所有仪表板和告警。

<!--
4. **Disable classic scraping**: Once migration is complete and verified, set
   `always_scrape_classic_histograms: false` to reduce storage overhead.
-->
4. **禁用经典抓取**：迁移完成并验证后，设置
   `always_scrape_classic_histograms: false` 以减少存储开销。

<!--
## Disabling native histograms
-->
## 禁用原生直方图

<!--
You can disable native histograms at any time using either of two approaches:
-->
你可以随时使用以下两种方法之一禁用原生直方图：

<!--
- **Prometheus-side (fastest, no Kubernetes restart needed; Prometheus 3.x only)**:
  Set `scrape_native_histograms: false` per scrape job. Prometheus resumes
  scraping classic format on the next scrape interval.
-->
- **Prometheus 端（最快，无需重启 Kubernetes；仅限 Prometheus 3.x）**：
  按抓取作业设置 `scrape_native_histograms: false`。
  Prometheus 在下一个抓取间隔恢复抓取经典格式。

<!--
- **Kubernetes feature gate**: Restart the component with
  `--feature-gates=NativeHistograms=false`. Only classic histogram format is
  exposed after restart.
-->
- **Kubernetes 特性门控**：使用 `--feature-gates=NativeHistograms=false` 重启组件。
  重启后仅暴露经典直方图格式。

<!--
When native histograms are disabled, the metrics endpoint reverts to
classic histogram format only. Historical native histogram data in Prometheus
remains queryable.
-->
当原生直方图被禁用时，指标端点仅恢复为经典直方图格式。
Prometheus 中的历史原生直方图数据仍然可查询。

<!--
## Troubleshooting
-->
## 故障排除

<!--
- **Dashboards show no data after enabling native histograms**
: This occurs when Prometheus is configured with `scrape_native_histograms: true`
  but `always_scrape_classic_histograms: false` (the default), and your dashboards
  still use classic histogram queries (for example, `histogram_quantile(..._bucket...)`).

  Fix: Set `always_scrape_classic_histograms: true` to restore classic format
  ingestion while you migrate dashboards.
-->
- **启用原生直方图后仪表板不显示数据**
: 当 Prometheus 配置了 `scrape_native_histograms: true`
  但 `always_scrape_classic_histograms: false`（默认值），且你的仪表板仍使用经典直方图查询
 （例如 `histogram_quantile(..._bucket...)`）时，会发生这种情况。

  修复：在迁移仪表板时设置 `always_scrape_classic_histograms: true` 以恢复经典格式摄入。

<!--
- **Memory usage increase after enabling native histograms**
: A small memory increase is expected for native histogram bucket storage,
  bounded by a maximum of 160 buckets per histogram. Monitor
  `process_resident_memory_bytes` for unexpected increases.

  Fix: If memory pressure is severe, disable native histogram ingestion in
  Prometheus (`scrape_native_histograms: false`) or disable the Kubernetes feature
  gate.
-->
- **启用原生直方图后内存使用量增加**
: 原生直方图桶存储的内存小幅增加是预期的，每个直方图最多有 160 个桶的限制。
  监视 `process_resident_memory_bytes` 以发现意外增加。

  修复：如果内存压力严重，在 Prometheus 中禁用原生直方图摄入
  （`scrape_native_histograms: false`）或禁用 Kubernetes 特性门控。

<!--
- **Prometheus logs errors about unknown metric format**
: Your Prometheus version is too old to understand native histograms.

  Fix: Upgrade Prometheus to 2.40+ or disable native histograms in Kubernetes.
-->
- **Prometheus 日志中出现未知指标格式错误**
: 你的 Prometheus 版本太旧，无法理解原生直方图。

  修复：将 Prometheus 升级到 2.40+ 或在 Kubernetes 中禁用原生直方图。

<!--
- **Not sure if native histograms are being exposed**
: Check the feature gate status by querying `kubernetes_feature_enabled{name="NativeHistograms"}`
  in Prometheus. A value of `1` indicates the feature is enabled. You can also
  query the metrics endpoint directly with protobuf format:
-->
- **不确定原生直方图是否正在被暴露**
: 通过在 Prometheus 中查询 `kubernetes_feature_enabled{name="NativeHistograms"}`
  来检查特性门控状态。值为 `1` 表示该特性已启用。
  你还可以使用 protobuf 格式直接查询指标端点：

  ```bash
  curl -H "Accept: application/vnd.google.protobuf;proto=io.prometheus.client.MetricFamily;encoding=delimited" \
    https://<component-address>/metrics
  ```

  <!--
  The response should contain native histogram encoding for histogram metrics.
  -->
  响应应包含直方图指标的原生地直方图编码。

<!--
## References
-->
## 参考

<!--
- Read the [Prometheus Native Histograms documentation](https://prometheus.io/docs/specs/native_histograms/)
  for details on the native histogram format and query functions.
- See the [Kubernetes metrics reference](/docs/reference/instrumentation/metrics/)
  for the full list of metrics exposed by Kubernetes components.
-->
- 阅读 [Prometheus 原生直方图文档](https://prometheus.io/docs/specs/native_histograms/)
  以了解原生直方图格式和查询函数的详细信息。
- 查看 [Kubernetes 指标参考](/zh-cn/docs/reference/instrumentation/metrics/)以获取
  Kubernetes 组件暴露的指标完整列表。
