---
title: 追踪 Kubernetes 系统组件
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

Kubernetes components have built-in gRPC exporters for OTLP to export traces, either with an OpenTelemetry Collector, 
or without an OpenTelemetry Collector.
-->
## 追踪信息的收集 {#trace-collection}

Kubernetes 组件具有内置的 gRPC 导出器，供 OTLP 导出追踪信息，可以使用 OpenTelemetry Collector，
也可以不使用 OpenTelemetry Collector。

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
举例来说，如果收集器以 Kubernetes 组件的边车模式运行，
以下接收器配置会收集 span 信息，并将它们写入到标准输出。

<!-- 
```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # Replace this exporter with the exporter for your backend
  logging:
    logLevel: debug
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [logging]
```
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
To directly emit traces to a backend without utilizing a collector, 
specify the endpoint field in the Kubernetes tracing configuration file with the desired trace backend address. 
This method negates the need for a collector and simplifies the overall structure.
-->
要在不使用收集器的情况下直接将追踪信息发送到后端，请在 Kubernetes
追踪配置文件中指定端点字段以及所需的追踪后端地址。
该方法不需要收集器并简化了整体结构。

<!--
For trace backend header configuration, including authentication details, environment variables can be used with `OTEL_EXPORTER_OTLP_HEADERS`, 
see [OTLP Exporter Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/).
-->
对于追踪后端标头配置，包括身份验证详细信息，环境变量可以与 `OTEL_EXPORTER_OTLP_HEADERS`
一起使用，请参阅 [OTLP 导出器配置](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)。

<!--
Additionally, for trace resource attribute configuration such as Kubernetes cluster name, namespace, Pod name, etc., 
environment variables can also be used with `OTEL_RESOURCE_ATTRIBUTES`, see [OTLP Kubernetes Resource](https://opentelemetry.io/docs/specs/semconv/resource/k8s/).
-->
另外，对于 Kubernetes 集群名称、命名空间、Pod 名称等追踪资源属性配置，
环境变量也可以与 `OTEL_RESOURCE_ATTRIBUTES` 配合使用，请参见
[OTLP Kubernetes 资源](https://opentelemetry.io/docs/specs/semconv/resource/k8s/)。

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
kube-apiserver 为传入的 HTTP 请求、传出到 webhook 和 etcd 的请求以及重入的请求生成 span。
由于 kube-apiserver 通常是一个公开的端点，所以它通过出站的请求传播
[W3C 追踪上下文](https://www.w3.org/TR/trace-context/)，
但不使用入站请求的追踪上下文。

<!-- 
#### Enabling tracing in the kube-apiserver
-->
#### 在 kube-apiserver 中启用追踪 {#enabling-tracing-in-the-kube-apiserver}

<!-- 
To enable tracing, provide the kube-apiserver with a tracing configuration file
with `--tracing-config-file=<path-to-config>`. This is an example config that records
spans for 1 in 10000 requests, and uses the default OpenTelemetry endpoint:

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: TracingConfiguration
# default value
#endpoint: localhost:4317
samplingRatePerMillion: 100
```
-->
要启用追踪特性，需要使用 `--tracing-config-file=<<配置文件路径>` 为
kube-apiserver 提供追踪配置文件。下面是一个示例配置，它为万分之一的请求记录
span，并使用了默认的 OpenTelemetry 端点。

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: TracingConfiguration
# 默认值
#endpoint: localhost:4317
samplingRatePerMillion: 100
```

<!-- 
For more information about the `TracingConfiguration` struct, see
[API server config API (v1beta1)](/docs/reference/config-api/apiserver-config.v1beta1/#apiserver-k8s-io-v1beta1-TracingConfiguration).
-->
有关 TracingConfiguration 结构体的更多信息，请参阅
[API 服务器配置 API (v1beta1)](/zh-cn/docs/reference/config-api/apiserver-config.v1beta1/#apiserver-k8s-io-v1beta1-TracingConfiguration)。

<!--
### kubelet traces
-->
### kubelet 追踪   {#kubelet-traces}

{{< feature-state feature_gate_name="KubeletTracing" >}}

<!--
The kubelet CRI interface and authenticated http servers are instrumented to generate
trace spans. As with the apiserver, the endpoint and sampling rate are configurable.
Trace context propagation is also configured. A parent span's sampling decision is always respected.
A provided tracing configuration sampling rate will apply to spans without a parent.
Enabled without a configured endpoint, the default OpenTelemetry Collector receiver address of "localhost:4317" is set.
-->
kubelet CRI 接口和实施身份验证的 HTTP 服务器被插桩以生成追踪 span。
与 API 服务器一样，端点和采样率是可配置的。
追踪上下文传播也是可以配置的。始终优先采用父 span 的采样决策。
用户所提供的追踪配置采样率将被应用到不带父级的 span。
如果在没有配置端点的情况下启用，将使用默认的 OpenTelemetry Collector
接收器地址 “localhost:4317”。

<!--
#### Enabling tracing in the kubelet

To enable tracing, apply the [tracing configuration](https://github.com/kubernetes/component-base/blob/release-1.27/tracing/api/v1/types.go).
This is an example snippet of a kubelet config that records spans for 1 in 10000 requests, and uses the default OpenTelemetry endpoint:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletTracing: true
tracing:
  # default value
  #endpoint: localhost:4317
  samplingRatePerMillion: 100
```
-->
#### 在 kubelet 中启用追踪 {#enabling-tracing-in-the-kubelet}

要启用追踪，需应用[追踪配置](https://github.com/kubernetes/component-base/blob/release-1.27/tracing/api/v1/types.go)。
以下是 kubelet 配置的示例代码片段，每 10000 个请求中记录一个请求的
span，并使用默认的 OpenTelemetry 端点：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  KubeletTracing: true
tracing:
  # 默认值
  #endpoint: localhost:4317
  samplingRatePerMillion: 100
```

<!--
If the `samplingRatePerMillion` is set to one million (`1000000`), then every
span will be sent to the exporter.
-->
如果 `samplingRatePerMillion` 被设置为一百万 (`1000000`)，则所有 span 都将被发送到导出器。

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
Kubernetes v{{< skew currentVersion >}} 中的 kubelet 收集与垃圾回收、Pod
同步例程以及每个 gRPC 方法相关的 Span。
kubelet 借助 gRPC 来传播跟踪上下文，以便 CRI-O 和 containerd
这类带有跟踪插桩的容器运行时可以在其导出的 Span 与 kubelet
所提供的跟踪上下文之间建立关联。所得到的跟踪数据会包含 kubelet
与容器运行时 Span 之间的父子链接关系，从而为调试节点问题提供有用的上下文信息。

<!--
Please note that exporting spans always comes with a small performance overhead
on the networking and CPU side, depending on the overall configuration of the
system. If there is any issue like that in a cluster which is running with
tracing enabled, then mitigate the problem by either reducing the
`samplingRatePerMillion` or disabling tracing completely by removing the
configuration.
-->
请注意导出 span 始终会对网络和 CPU 产生少量性能开销，具体取决于系统的总体配置。
如果在启用追踪的集群中出现类似性能问题，可以通过降低 `samplingRatePerMillion`
或通过移除此配置来彻底禁用追踪来缓解问题。

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
* Read about [OTLP Exporter Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)
-->
* 阅读 [Getting Started with the OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
* 了解 [OTLP 导出器配置](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)
