---
reviewers:
- serathius
title: Weighted Load Balancing for kube-apiserver
content_type: concept
weight: 120
---

<!-- overview -->

{{< feature-state feature_gate_name="RequestCostAggregation" >}}

In high-availability Kubernetes clusters with multiple
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} replicas behind
a load balancer, traffic and CPU consumption across replicas are often asymmetric.
Leader-elected controllers and clients using long-lived HTTP/2 connections or watch
streams can saturate one `kube-apiserver` instance while other replicas have spare
capacity.

Weighted load balancing enables the `kube-apiserver` to report its real-time load
metrics to an upstream Layer 7 load balancer using the Open Request Cost Aggregation
(ORCA) standard. Compatible load balancers use these reports to run weighted routing
policies (such as Weighted Round Robin or Weighted Least Request) and steer traffic
toward less loaded API server replicas.

<!-- body -->

## Enabling endpoint load metrics {#enabling}

Endpoint load metrics reporting is disabled by default. To enable it, set both the
`RequestCostAggregation`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/#RequestCostAggregation)
and the `--enable-endpoint-load-metrics` flag on every `kube-apiserver` replica:

```shell
kube-apiserver \
  --feature-gates=RequestCostAggregation=true \
  --enable-endpoint-load-metrics=true
```

Both settings are required:

- Enabling `RequestCostAggregation` without `--enable-endpoint-load-metrics=true`
  makes the capability available but never attaches load reports to responses.
- Setting `--enable-endpoint-load-metrics=true` while `RequestCostAggregation` is
  disabled has no effect.

{{< alert color="info" title="Note" >}}
Endpoint load metrics CPU sampling is supported only on Linux. Starting
`kube-apiserver` with `RequestCostAggregation=true` and
`--enable-endpoint-load-metrics=true` on non-Linux platforms fails at startup.
{{< /alert >}}

To disable endpoint load metrics reporting, remove `--enable-endpoint-load-metrics`
(or set it to `false`) or disable `RequestCostAggregation` and restart
`kube-apiserver`. When reporting stops, the load balancer falls back to unweighted
routing.

## How ORCA load reporting works {#how-it-works}

### Load sampling

When enabled, `kube-apiserver` runs a background sampler that records cumulative
process CPU time and incoming HTTP request counts every 250 milliseconds over a
5-second sliding window. On each tick after a full window is collected, it computes
and caches an updated load report:

`cpu_utilization`
: Average process CPU usage over the 5-second sliding window divided by the process
  CPU core limit (`GOMAXPROCS`, which accounts for host logical CPUs, process CPU
  affinity, and Linux cgroup CPU quotas). Per the CNCF xDS ORCA specification,
  `cpu_utilization` is non-negative and can exceed `1.0` when OS thread CPU usage
  exceeds `GOMAXPROCS`.

`rps_fractional`
: Average incoming request rate (requests per second) observed over the 5-second
  sliding window.

During the first 5 seconds after `kube-apiserver` starts (or after a sampling error
resets the sample window), no report is ready yet, so `kube-apiserver` omits the
load metrics response header until a full window is available. Because the latest
report is pre-computed in the background and read lock-free on the HTTP request path,
attaching the header adds minimal per-request overhead.

### Header negotiation and format

ORCA does not define a standard request negotiation header, so `kube-apiserver` uses
an explicit opt-in request header to avoid exposing load reports to arbitrary clients.
Requests that do not carry the expected negotiation header receive no load metrics.

{{< table caption="HTTP headers used for ORCA endpoint load metrics" >}}
Header                          | Direction | Supported value and format                           | Description
:------------------------------ | :-------- | :--------------------------------------------------- | :----------
`endpoint-load-metrics-request` | Request   | `TEXT`                                               | Requests an ORCA load report on the response. `kube-apiserver` strips this header before forwarding requests downstream.
`endpoint-load-metrics`         | Response  | `TEXT cpu_utilization=<float>, rps_fractional=<float>` | Carries the latest ORCA load report, formatted to four decimal places, when negotiated.
`endpoint-load-metrics-bin`     | Response  | Binary protobuf (not emitted)                        | Stripped by `kube-apiserver` from proxied backend responses so backends cannot inject spoofed reports.
{{< /table >}}

An example response header emitted by `kube-apiserver` looks like:

```http
endpoint-load-metrics: TEXT cpu_utilization=0.3125, rps_fractional=42.8000
```

## Securing load metrics {#securing-load-metrics}

API server utilization reveals operational load and tenant activity and could help
a malicious caller target saturated instances. Because the endpoint load metrics
handler runs before request authentication and authorization, any caller that can
send `endpoint-load-metrics-request: TEXT` directly to `kube-apiserver` (including
to unauthenticated endpoints such as `/livez` or `/version`) would receive load
metrics if the feature is enabled.

To reduce exposure and prevent spoofing, `kube-apiserver` enforces these rules:

- **Explicit opt-in**: Load metrics are never sent unless both
  `RequestCostAggregation` and `--enable-endpoint-load-metrics=true` are enabled and
  the request carries `endpoint-load-metrics-request: TEXT`.
- **Downstream request stripping**: `kube-apiserver` removes
  `endpoint-load-metrics-request` before delegating the request so it is not leaked
  to aggregated API servers, admission webhooks, or proxied Pods, Nodes, or
  Services.
- **Upstream response sanitization**: `kube-apiserver` removes
  `endpoint-load-metrics-bin` and replaces or removes `endpoint-load-metrics` on
  responses so proxied backends cannot override the API server's own load report.

{{< alert color="caution" title="Caution" >}}
The `endpoint-load-metrics-request` header signals opt-in intent and does not
authenticate the load balancer. Enable `--enable-endpoint-load-metrics` only when
`kube-apiserver` is reachable exclusively through trusted Layer 7 load balancers that
strip `endpoint-load-metrics` and `endpoint-load-metrics-bin` from responses before
returning them to clients.
{{< /alert >}}

## Configuring a Layer 7 load balancer {#load-balancer-configuration}

Any Layer 7 load balancer consuming ORCA load reports from `kube-apiserver` must:

1. Set `endpoint-load-metrics-request: TEXT` on requests forwarded to
   `kube-apiserver`.
1. Remove `endpoint-load-metrics` and `endpoint-load-metrics-bin` from every response
   after reading the load report, before returning the response to clients.

{{% thirdparty-content single="true" %}}

For example, in an [Envoy Proxy](https://www.envoyproxy.io/) route configuration:

```yaml
routes:
- match:
    prefix: "/"
  route:
    cluster: kube-apiserver
  request_headers_to_add:
  - header:
      key: endpoint-load-metrics-request
      value: TEXT
    append_action: OVERWRITE_IF_EXISTS_OR_ADD
  response_headers_to_remove:
  - endpoint-load-metrics
  - endpoint-load-metrics-bin
```

If you use [Envoy Gateway](https://gateway.envoyproxy.io/), its `BackendUtilization`
load balancer strips both `endpoint-load-metrics` and `endpoint-load-metrics-bin` by
default unless `keepResponseHeaders` is set to `true`.

## Alpha limitations {#alpha-limitations}

In Kubernetes v1.38 (Alpha):

- Only in-band HTTP response reporting using the `TEXT` format
  (`endpoint-load-metrics-request: TEXT`) is supported. Requests specifying other
  ORCA formats (such as `JSON` or `BIN`) receive no load report, and out-of-band
  gRPC ORCA reporting is not supported.
- Load reports include only `cpu_utilization` and `rps_fractional`.
- Endpoint load metrics reporting is supported only on Linux `kube-apiserver` hosts.
- The 250ms sampling interval and 5-second sliding window are fixed defaults.

## {{% heading "whatsnext" %}}

- Learn about [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control/)
  for per-server request concurrency control.
- Read about [Proxies in Kubernetes](/docs/concepts/cluster-administration/proxies/)
  for load balancers in front of the API server.
- Check the [`RequestCostAggregation` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#RequestCostAggregation).
- Read [KEP-6315: Weighted Load Balancing for Kube-Apiserver](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/6315-weighted-load-balancing)
  for the design proposal.
