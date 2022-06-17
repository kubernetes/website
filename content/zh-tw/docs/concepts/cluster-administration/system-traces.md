---
title: 追蹤 Kubernetes 系統元件
content_type: concept
weight: 60
---
<!-- 
---
title: Traces For Kubernetes System Components
reviewers:
- logicalhan
- lilic
content_type: concept
weight: 60
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

<!-- 
System component traces record the latency of and relationships between operations in the cluster.
-->
系統元件追蹤功能記錄各個叢集操作的時延資訊和這些操作之間的關係。

<!-- 
Kubernetes components emit traces using the
[OpenTelemetry Protocol](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md#opentelemetry-protocol-specification)
with the gRPC exporter and can be collected and routed to tracing backends using an
[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector).
-->
Kubernetes 元件基於 gRPC 匯出器的
[OpenTelemetry 協議](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md#opentelemetry-protocol-specification)
傳送追蹤資訊，並用
[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector)
收集追蹤資訊，再將其轉交給追蹤系統的後臺。

<!-- body -->

<!-- 
## Trace Collection
-->
## 追蹤資訊的收集 {#trace-collection}

<!-- 
For a complete guide to collecting traces and using the collector, see
[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/).
However, there are a few things to note that are specific to Kubernetes components.
-->
關於收集追蹤資訊、以及使用收集器的完整指南，可參見
[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)。
不過，還有一些特定於 Kubernetes 元件的事項值得注意。

<!-- 
By default, Kubernetes components export traces using the grpc exporter for OTLP on the
[IANA OpenTelemetry port](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry), 4317.
As an example, if the collector is running as a sidecar to a Kubernetes component,
the following receiver configuration will collect spans and log them to standard output:
-->
預設情況下，Kubernetes 元件使用 gRPC 的 OTLP 匯出器來匯出追蹤資訊，將資訊寫到
[IANA OpenTelemetry 埠](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry)。
舉例來說，如果收集器以 Kubernetes 元件的邊車模式執行，以下接收器配置會收集 spans 資訊，並將它們寫入到標準輸出。

<!-- 
# Replace this exporter with the exporter for your backend
-->
```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # 用適合你後端環境的匯出器替換此處的匯出器
  logging:
    logLevel: debug
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [logging]
```

<!-- 
## Component traces

### kube-apiserver traces
-->
## 元件追蹤 {#component-traces}

### kube-apiserver 追蹤 {#kube-apiserver-traces}

<!-- 
The kube-apiserver generates spans for incoming HTTP requests, and for outgoing requests
to webhooks, etcd, and re-entrant requests. It propagates the
[W3C Trace Context](https://www.w3.org/TR/trace-context/) with outgoing requests
but does not make use of the trace context attached to incoming requests,
as the kube-apiserver is often a public endpoint.
-->
kube-apiserver 為傳入的 HTTP 請求、傳出到 webhook 和 etcd 的請求以及重入的請求生成 spans。
由於 kube-apiserver 通常是一個公開的端點，所以它通過出站的請求傳播
[W3C 追蹤上下文](https://www.w3.org/TR/trace-context/)，
但不使用入站請求的追蹤上下文。

<!-- 
#### Enabling tracing in the kube-apiserver
-->
#### 在 kube-apiserver 中啟用追蹤 {#enabling-tracing-in-the-kube-apiserver}

<!-- 
To enable tracing, enable the `APIServerTracing`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the kube-apiserver. Also, provide the kube-apiserver with a tracing configration file
with `--tracing-config-file=<path-to-config>`. This is an example config that records
spans for 1 in 10000 requests, and uses the default OpenTelemetry endpoint:
-->
要啟用追蹤特性，需要啟用 kube-apiserver 上的  `APIServerTracing`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
然後，使用 `--tracing-config-file=<<配置檔案路徑>` 為 kube-apiserver 提供追蹤配置檔案。
下面是一個示例配置，它為萬分之一的請求記錄 spans，並使用了預設的 OpenTelemetry 埠。

```yaml
apiVersion: apiserver.config.k8s.io/v1alpha1
kind: TracingConfiguration
# default value
#endpoint: localhost:4317
samplingRatePerMillion: 100
```

<!-- 
For more information about the `TracingConfiguration` struct, see
[API server config API (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-TracingConfiguration).
-->

有關 TracingConfiguration 結構體的更多資訊，請參閱 
[API 伺服器配置 API (v1alpha1)](/zh-cn/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-TracingConfiguration)。

<!-- 
## Stability
-->
## 穩定性 {#stability}

<!-- 
Tracing instrumentation is still under active development, and may change
in a variety of ways. This includes span names, attached attributes,
instrumented endpoints, etc. Until this feature graduates to stable,
there are no guarantees of backwards compatibility for tracing instrumentation.
-->
追蹤工具仍在積極開發中，未來它會以多種方式發生變化。
這些變化包括：span 名稱、附加屬性、檢測端點等等。
此類特性在達到穩定版本之前，不能保證追蹤工具的向後相容性。

## {{% heading "whatsnext" %}}

<!-- 
* Read about [Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
-->
* 閱讀[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
