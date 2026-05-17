---
title: Native Histogram Support for Kubernetes Metrics
linkTitle: Native Histograms
content_type: concept
weight: 50
---

<!-- overview -->

{{< feature-state feature_gate_name="NativeHistograms" >}}

Kubernetes components can expose histogram metrics in
[Prometheus Native Histogram](https://prometheus.io/docs/specs/native_histograms/) format,
alongside the classic histogram format. Native histograms use exponential bucket boundaries
instead of fixed boundaries, providing significant storage efficiency, improved query
performance, and finer-grained visibility into distributions.

<!-- body -->

## Before you begin

To use native histograms, you need:

- **Kubernetes v1.36 or later** with the `NativeHistograms`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled.
- **Prometheus 2.40 or later** to scrape and store native histograms.
  Prometheus 3.0+ is recommended for per-job configuration.

## What are native histograms?

Classic Prometheus histograms use fixed bucket boundaries (for example,
`[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]` seconds).
Each bucket creates a separate time series (`_bucket`, `_count`, `_sum`),
which can lead to:

- **High storage costs** at scale, because each histogram generates many time series.
- **Accuracy issues**, because data points within a wide bucket range are
  indistinguishable. For example, a request completing in 1µs and one completing
  in 4ms both fall into the same `le="0.005"` bucket.

[Native histograms](https://prometheus.io/docs/specs/native_histograms/)
address these limitations by using exponential bucket boundaries
that automatically adjust to the data distribution. Benefits include:

- **~10x reduction in time series count** per histogram metric, significantly
  reducing Prometheus storage and improving query performance.
- **Finer-grained resolution** for detecting performance regressions and setting
  precise SLO thresholds.

## How it works

When the `NativeHistograms` feature gate is enabled, Kubernetes components expose
histogram metrics in both classic and native formats simultaneously (dual exposition).
The format returned depends on the `Accept` header in the HTTP request
([Prometheus content negotiation](https://prometheus.io/docs/instrumenting/exposition_formats/#content-negotiation)).
Prometheus sets this header automatically based on your scrape configuration;
you only need to be aware of it when querying the `/metrics` endpoint directly.

- **Text format** (Accept: `text/plain`, OpenMetrics 1.0): Returns only classic histogram
  buckets. Backward compatible with all existing tooling.
  ```
  # Classic histogram buckets (always present)
  apiserver_request_duration_seconds_bucket{le="0.005"} 1000
  apiserver_request_duration_seconds_bucket{le="0.01"} 2000
  ...
  apiserver_request_duration_seconds_bucket{le="+Inf"} 10000
  apiserver_request_duration_seconds_count 10000
  apiserver_request_duration_seconds_sum 450.5
  ```

- **Protobuf format** (Accept: `application/vnd.google.protobuf`): Contains both classic
  buckets and native histogram data. Prometheus automatically requests this
  format when `scrape_native_histograms: true` is set in the
  [Prometheus scrape configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)
  for the corresponding scrape job.

This dual exposition strategy ensures:

- Existing dashboards and alerts continue to work without changes.
- Users can migrate queries to native histograms at their own pace.
- Prometheus stores whichever format it is configured to ingest.

## Enabling native histograms

Enabling native histograms is a two-step process: enable the feature gate on
Kubernetes components, and configure Prometheus to scrape native histograms.

### Step 1: Enable the Kubernetes feature gate

Enable the `NativeHistograms` feature gate on the Kubernetes components
you want to expose native histograms from:

```bash
--feature-gates=NativeHistograms=true
```

This feature gate applies to the following components:
- kube-apiserver
- kube-controller-manager
- kube-scheduler
- kubelet
- kube-proxy

Each component's metrics are independent; you can enable or disable the feature
gate per component.

### Step 2: Configure Prometheus

The Prometheus configuration depends on your Prometheus version.

| Prometheus version | Native histogram support | Configuration                                                             | Notes                                                                        |
| ------------------ | ------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| < 2.40             | None                     | N/A                                                                       | Classic histograms only. Enabling the Kubernetes feature gate has no effect. |
| 2.40 – 2.x         | Experimental             | `--enable-feature=native-histograms` (global)                             | All-or-nothing; no per-job control.                                          |
| 3.0 – 3.7          | Stable                   | Per-job `scrape_native_histograms` and `always_scrape_classic_histograms` | Per-job configuration recommended. Global flag still supported.              |
| 3.8                | Stable                   | Per-job configuration (required for fine-grained control)                 | Global flag only changes default for all jobs.                               |
| 3.9+               | Stable                   | Per-job `scrape_native_histograms` only                                   | Global flag removed. Must use per-job configuration.                         |

For Prometheus 3.x, use per-job configuration for fine-grained control:

```yaml
scrape_configs:
  - job_name: 'kubernetes-apiservers'
    scrape_native_histograms: true            # Ingest native histograms
    always_scrape_classic_histograms: true     # Keep classic format during migration
```

Set both options to `true` during the migration period. This allows you to
ingest native histograms while keeping classic histograms for existing dashboards.

{{< note >}}
Native histograms require the Protobuf exposition format. This is handled automatically by Prometheus by default. However, if you have customized `scrape_protocols`, ensure that `PrometheusProto` is included in the list.
{{< /note >}}

## Migrating dashboards and alerts

{{< caution >}}
If Prometheus is configured with `scrape_native_histograms: true` but
`always_scrape_classic_histograms: false` (the default), Prometheus ingests
native histograms only. Existing dashboards that use classic histogram queries
(for example, `histogram_quantile(..._bucket...)`) will show no data.
Always set `always_scrape_classic_histograms: true` during migration.
{{< /caution >}}

When migrating from classic to native histogram queries, follow this workflow:

1. **Enable both formats**: Set `scrape_native_histograms: true` and
   `always_scrape_classic_histograms: true` in your Prometheus scrape config.

2. **Migrate queries**: Update dashboard queries and alert expressions from
   classic histogram functions to native histogram equivalents.

   Classic query:
   ```promql
   histogram_quantile(0.99, rate(apiserver_request_duration_seconds_bucket[5m]))
   ```

   Native histogram query:
   ```promql
   histogram_quantile(0.99, rate(apiserver_request_duration_seconds[5m]))
   ```

3. **Verify in staging**: Test all dashboards and alerts with native histogram
   queries before rolling out to production.

4. **Disable classic scraping**: Once migration is complete and verified, set
   `always_scrape_classic_histograms: false` to reduce storage overhead.

## Disabling native histograms

You can disable native histograms at any time using either of two approaches:

- **Prometheus-side (fastest, no Kubernetes restart needed; Prometheus 3.x only)**:
  Set `scrape_native_histograms: false` per scrape job. Prometheus resumes
  scraping classic format on the next scrape interval.

- **Kubernetes feature gate**: Restart the component with
  `--feature-gates=NativeHistograms=false`. Only classic histogram format is
  exposed after restart.

When native histograms are disabled, the metrics endpoint reverts to
classic histogram format only. Historical native histogram data in Prometheus
remains queryable.

## Troubleshooting

- **Dashboards show no data after enabling native histograms**
: This occurs when Prometheus is configured with `scrape_native_histograms: true`
  but `always_scrape_classic_histograms: false` (the default), and your dashboards
  still use classic histogram queries (for example, `histogram_quantile(..._bucket...)`).

  Fix: Set `always_scrape_classic_histograms: true` to restore classic format
  ingestion while you migrate dashboards.

- **Memory usage increase after enabling native histograms**
: A small memory increase is expected for native histogram bucket storage,
  bounded by a maximum of 160 buckets per histogram. Monitor
  `process_resident_memory_bytes` for unexpected increases.

  Fix: If memory pressure is severe, disable native histogram ingestion in
  Prometheus (`scrape_native_histograms: false`) or disable the Kubernetes feature
  gate.

- **Prometheus logs errors about unknown metric format**
: Your Prometheus version is too old to understand native histograms.

  Fix: Upgrade Prometheus to 2.40+ or disable native histograms in Kubernetes.

- **Not sure if native histograms are being exposed**
: Check the feature gate status by querying `kubernetes_feature_enabled{name="NativeHistograms"}`
  in Prometheus. A value of `1` indicates the feature is enabled. You can also
  query the metrics endpoint directly with protobuf format:
  ```bash
  curl -H "Accept: application/vnd.google.protobuf;proto=io.prometheus.client.MetricFamily;encoding=delimited" \
    https://<component-address>/metrics
  ```
  The response should contain native histogram encoding for histogram metrics.

## References

- Read the [Prometheus Native Histograms documentation](https://prometheus.io/docs/specs/native_histograms/)
  for details on the native histogram format and query functions.
- See the [Kubernetes metrics reference](/docs/reference/instrumentation/metrics/)
  for the full list of metrics exposed by Kubernetes components.
