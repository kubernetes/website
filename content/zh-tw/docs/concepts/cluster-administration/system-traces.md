---
title: 追蹤 Kubernetes 系統組件
content_type: concept
weight: 90
---
<!-- 
title: Traces For Kubernetes System Components
reviewers:
- logicalhan
- lilic
content_type: concept
weight: 90
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

<!-- 
System component traces record the latency of and relationships between operations in the cluster.
-->
系統組件追蹤功能記錄各個叢集操作的時延資訊和這些操作之間的關係。

<!-- 
Kubernetes components emit traces using the
[OpenTelemetry Protocol](https://opentelemetry.io/docs/specs/otlp/)
with the gRPC exporter and can be collected and routed to tracing backends using an
[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector).
-->
Kubernetes 組件基於 gRPC 導出器的
[OpenTelemetry 協議](https://opentelemetry.io/docs/specs/otlp/)
發送追蹤資訊，並用
[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector)
收集追蹤資訊，再將其轉交給追蹤系統的後臺。

<!-- body -->

<!-- 
## Trace Collection

Kubernetes components have built-in gRPC exporters for OTLP to export traces, either with an OpenTelemetry Collector, 
or without an OpenTelemetry Collector.
-->
## 追蹤資訊的收集 {#trace-collection}

Kubernetes 組件具有內置的 gRPC 導出器，供 OTLP 導出追蹤資訊，可以使用 OpenTelemetry Collector，
也可以不使用 OpenTelemetry Collector。

<!-- 
For a complete guide to collecting traces and using the collector, see
[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/).
However, there are a few things to note that are specific to Kubernetes components.
-->
關於收集追蹤資訊、以及使用收集器的完整指南，可參見
[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)。
不過，還有一些特定於 Kubernetes 組件的事項值得注意。

<!-- 
By default, Kubernetes components export traces using the grpc exporter for OTLP on the
[IANA OpenTelemetry port](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry), 4317.
As an example, if the collector is running as a sidecar to a Kubernetes component,
the following receiver configuration will collect spans and log them to standard output:
-->
預設情況下，Kubernetes 組件使用 gRPC 的 OTLP 導出器來導出追蹤資訊，將資訊寫到
[IANA OpenTelemetry 端口](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry)。
舉例來說，如果收集器以 Kubernetes 組件的邊車模式運行，
以下接收器設定會收集 span 資訊，並將它們寫入到標準輸出。

<!-- 
```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # Replace this exporter with the exporter for your backend
  exporters:
    debug:
      verbosity: detailed
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug]
```
-->
```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # 用適合你後端環境的導出器替換此處的導出器
  exporters:
    debug:
      verbosity: detailed
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug]
```

<!--
To directly emit traces to a backend without utilizing a collector, 
specify the endpoint field in the Kubernetes tracing configuration file with the desired trace backend address. 
This method negates the need for a collector and simplifies the overall structure.
-->
要在不使用收集器的情況下直接將追蹤資訊發送到後端，請在 Kubernetes
追蹤設定檔案中指定端點字段以及所需的追蹤後端地址。
該方法不需要收集器並簡化了整體結構。

<!--
For trace backend header configuration, including authentication details, environment variables can be used with `OTEL_EXPORTER_OTLP_HEADERS`, 
see [OTLP Exporter Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/).
-->
對於追蹤後端標頭設定，包括身份驗證詳細資訊，環境變量可以與 `OTEL_EXPORTER_OTLP_HEADERS`
一起使用，請參閱 [OTLP 導出器設定](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)。

<!--
Additionally, for trace resource attribute configuration such as Kubernetes cluster name, namespace, Pod name, etc., 
environment variables can also be used with `OTEL_RESOURCE_ATTRIBUTES`, see [OTLP Kubernetes Resource](https://opentelemetry.io/docs/specs/semconv/resource/k8s/).
-->
另外，對於 Kubernetes 叢集名稱、命名空間、Pod 名稱等追蹤資源屬性設定，
環境變量也可以與 `OTEL_RESOURCE_ATTRIBUTES` 配合使用，請參見
[OTLP Kubernetes 資源](https://opentelemetry.io/docs/specs/semconv/resource/k8s/)。

<!-- 
## Component traces

### kube-apiserver traces
-->
## 組件追蹤 {#component-traces}

### kube-apiserver 追蹤 {#kube-apiserver-traces}

<!-- 
The kube-apiserver generates spans for incoming HTTP requests, and for outgoing requests
to webhooks, etcd, and re-entrant requests. It propagates the
[W3C Trace Context](https://www.w3.org/TR/trace-context/) with outgoing requests
but does not make use of the trace context attached to incoming requests,
as the kube-apiserver is often a public endpoint.
-->
kube-apiserver 爲傳入的 HTTP 請求、傳出到 webhook 和 etcd 的請求以及重入的請求生成 span。
由於 kube-apiserver 通常是一個公開的端點，所以它通過出站的請求傳播
[W3C 追蹤上下文](https://www.w3.org/TR/trace-context/)，
但不使用入站請求的追蹤上下文。

<!-- 
#### Enabling tracing in the kube-apiserver
-->
#### 在 kube-apiserver 中啓用追蹤 {#enabling-tracing-in-the-kube-apiserver}

<!-- 
To enable tracing, provide the kube-apiserver with a tracing configuration file
with `--tracing-config-file=<path-to-config>`. This is an example config that records
spans for 1 in 10000 requests, and uses the default OpenTelemetry endpoint:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: TracingConfiguration
# default value
#endpoint: localhost:4317
samplingRatePerMillion: 100
```
-->
要啓用追蹤特性，需要使用 `--tracing-config-file=<<配置文件路徑>` 爲
kube-apiserver 提供追蹤設定檔案。下面是一個示例設定，它爲萬分之一的請求記錄
span，並使用了預設的 OpenTelemetry 端點。

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: TracingConfiguration
# 默認值
#endpoint: localhost:4317
samplingRatePerMillion: 100
```

<!-- 
For more information about the `TracingConfiguration` struct, see
[API server config API (v1)](/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-TracingConfiguration).
-->
有關 TracingConfiguration 結構體的更多資訊，請參閱
[API 伺服器設定 API](/zh-cn/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-TracingConfiguration)。

<!--
### kubelet traces
-->
### kubelet 追蹤   {#kubelet-traces}

{{< feature-state feature_gate_name="KubeletTracing" >}}

<!--
The kubelet CRI interface and authenticated http servers are instrumented to generate
trace spans. As with the apiserver, the endpoint and sampling rate are configurable.
Trace context propagation is also configured. A parent span's sampling decision is always respected.
A provided tracing configuration sampling rate will apply to spans without a parent.
Enabled without a configured endpoint, the default OpenTelemetry Collector receiver address of "localhost:4317" is set.
-->
kubelet CRI 介面和實施身份驗證的 HTTP 伺服器被插樁以生成追蹤 span。
與 API 伺服器一樣，端點和採樣率是可設定的。
追蹤上下文傳播也是可以設定的。始終優先採用父 span 的採樣決策。
使用者所提供的追蹤設定採樣率將被應用到不帶父級的 span。
如果在沒有設定端點的情況下啓用，將使用預設的 OpenTelemetry Collector
接收器地址 “localhost:4317”。

<!--
#### Enabling tracing in the kubelet

To enable tracing, apply the [tracing configuration](https://github.com/kubernetes/component-base/blob/release-1.27/tracing/api/v1/types.go).
This is an example snippet of a kubelet config that records spans for 1 in 10000 requests, and uses the default OpenTelemetry endpoint:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
tracing:
  # default value
  #endpoint: localhost:4317
  samplingRatePerMillion: 100
```
-->
#### 在 kubelet 中啓用追蹤 {#enabling-tracing-in-the-kubelet}

要啓用追蹤，需應用[追蹤設定](https://github.com/kubernetes/component-base/blob/release-1.27/tracing/api/v1/types.go)。
以下是 kubelet 設定的示例代碼片段，每 10000 個請求中記錄一個請求的
span，並使用預設的 OpenTelemetry 端點：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
tracing:
  # 默認值
  #endpoint: localhost:4317
  samplingRatePerMillion: 100
```

<!--
If the `samplingRatePerMillion` is set to one million (`1000000`), then every
span will be sent to the exporter.
-->
如果 `samplingRatePerMillion` 被設置爲一百萬（`1000000`），
則所有 span 都將被髮送到導出器。

<!--
The kubelet in Kubernetes v{{< skew currentVersion >}} collects spans from
the garbage collection, pod synchronization routine as well as every gRPC
method. The kubelet propagates trace context with gRPC requests so that
container runtimes with trace instrumentation, such as CRI-O and containerd,
can associate their exported spans with the trace context from the kubelet.
The resulting traces will have parent-child links between kubelet and
container runtime spans, providing helpful context when debugging node
issues.
-->
Kubernetes v{{< skew currentVersion >}} 中的 kubelet 收集與垃圾回收、Pod
同步例程以及每個 gRPC 方法相關的 Span。
kubelet 藉助 gRPC 來傳播跟蹤上下文，以便 CRI-O 和 containerd
這類帶有跟蹤插樁的容器運行時可以在其導出的 Span 與 kubelet
所提供的跟蹤上下文之間建立關聯。所得到的跟蹤資料會包含 kubelet
與容器運行時 Span 之間的父子鏈接關係，從而爲調試節點問題提供有用的上下文資訊。

<!--
Please note that exporting spans always comes with a small performance overhead
on the networking and CPU side, depending on the overall configuration of the
system. If there is any issue like that in a cluster which is running with
tracing enabled, then mitigate the problem by either reducing the
`samplingRatePerMillion` or disabling tracing completely by removing the
configuration.
-->
請注意導出 span 始終會對網路和 CPU 產生少量性能開銷，具體取決於系統的總體設定。
如果在啓用追蹤的叢集中出現類似性能問題，可以通過降低 `samplingRatePerMillion`
或通過移除此設定來徹底禁用追蹤來緩解問題。

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
此類特性在達到穩定版本之前，不能保證追蹤工具的向後兼容性。

## {{% heading "whatsnext" %}}

<!-- 
* Read about [Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
* Read about [OTLP Exporter Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)
-->
* 閱讀 [Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
* 瞭解 [OTLP 導出器設定](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)
