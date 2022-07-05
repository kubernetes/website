---
title: 追踪 Kubernetes 系统组件
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
系统组件追踪功能记录各个集群操作的时延信息和这些操作之间的关系。

<!-- 
Kubernetes components emit traces using the
[OpenTelemetry Protocol](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md#opentelemetry-protocol-specification)
with the gRPC exporter and can be collected and routed to tracing backends using an
[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector).
-->
Kubernetes 组件基于 gRPC 导出器的
[OpenTelemetry 协议](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md#opentelemetry-protocol-specification)
发送追踪信息，并用
[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector)
收集追踪信息，再将其转交给追踪系统的后台。

<!-- body -->

<!-- 
## Trace Collection
-->
## 追踪信息的收集 {#trace-collection}

<!-- 
For a complete guide to collecting traces and using the collector, see
[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/).
However, there are a few things to note that are specific to Kubernetes components.
-->
关于收集追踪信息、以及使用收集器的完整指南，可参见
[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)。
不过，还有一些特定于 Kubernetes 组件的事项值得注意。

<!-- 
By default, Kubernetes components export traces using the grpc exporter for OTLP on the
[IANA OpenTelemetry port](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry), 4317.
As an example, if the collector is running as a sidecar to a Kubernetes component,
the following receiver configuration will collect spans and log them to standard output:
-->
默认情况下，Kubernetes 组件使用 gRPC 的 OTLP 导出器来导出追踪信息，将信息写到
[IANA OpenTelemetry 端口](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry)。
举例来说，如果收集器以 Kubernetes 组件的边车模式运行，以下接收器配置会收集 spans 信息，并将它们写入到标准输出。

<!-- 
# Replace this exporter with the exporter for your backend
-->
```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # 用适合你后端环境的导出器替换此处的导出器
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
## 组件追踪 {#component-traces}

### kube-apiserver 追踪 {#kube-apiserver-traces}

<!-- 
The kube-apiserver generates spans for incoming HTTP requests, and for outgoing requests
to webhooks, etcd, and re-entrant requests. It propagates the
[W3C Trace Context](https://www.w3.org/TR/trace-context/) with outgoing requests
but does not make use of the trace context attached to incoming requests,
as the kube-apiserver is often a public endpoint.
-->
kube-apiserver 为传入的 HTTP 请求、传出到 webhook 和 etcd 的请求以及重入的请求生成 spans。
由于 kube-apiserver 通常是一个公开的端点，所以它通过出站的请求传播
[W3C 追踪上下文](https://www.w3.org/TR/trace-context/)，
但不使用入站请求的追踪上下文。

<!-- 
#### Enabling tracing in the kube-apiserver
-->
#### 在 kube-apiserver 中启用追踪 {#enabling-tracing-in-the-kube-apiserver}

<!-- 
To enable tracing, enable the `APIServerTracing`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the kube-apiserver. Also, provide the kube-apiserver with a tracing configration file
with `--tracing-config-file=<path-to-config>`. This is an example config that records
spans for 1 in 10000 requests, and uses the default OpenTelemetry endpoint:
-->
要启用追踪特性，需要启用 kube-apiserver 上的  `APIServerTracing`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
然后，使用 `--tracing-config-file=<<配置文件路径>` 为 kube-apiserver 提供追踪配置文件。
下面是一个示例配置，它为万分之一的请求记录 spans，并使用了默认的 OpenTelemetry 端口。

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

有关 TracingConfiguration 结构体的更多信息，请参阅 
[API 服务器配置 API (v1alpha1)](/zh-cn/docs/reference/config-api/apiserver-config.v1alpha1/#apiserver-k8s-io-v1alpha1-TracingConfiguration)。

<!-- 
## Stability
-->
## 稳定性 {#stability}

<!-- 
Tracing instrumentation is still under active development, and may change
in a variety of ways. This includes span names, attached attributes,
instrumented endpoints, etc. Until this feature graduates to stable,
there are no guarantees of backwards compatibility for tracing instrumentation.
-->
追踪工具仍在积极开发中，未来它会以多种方式发生变化。
这些变化包括：span 名称、附加属性、检测端点等等。
此类特性在达到稳定版本之前，不能保证追踪工具的向后兼容性。

## {{% heading "whatsnext" %}}

<!-- 
* Read about [Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
-->
* 阅读[Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
