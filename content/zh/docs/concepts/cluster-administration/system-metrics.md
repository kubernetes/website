---
title: Kubernetes 系统组件指标
content_type: concept
weight: 60
---

<!-- overview -->

<!--
System component metrics can give a better look into what is happening inside them. Metrics are particularly useful for building dashboards and alerts.

Kubernetes components emit metrics in [Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/).
This format is structured plain text, designed so that people and machines can both read it.
-->
系统组件指标可以更好地了解系统内部发生的情况。指标对于构建仪表板和告警特别有用。

Kubernetes 组件以 [Prometheus 格式](https://prometheus.io/docs/instrumenting/exposition_formats/)生成度量值。
这种格式是结构化的纯文本，旨在使人和机器都可以阅读。

<!-- body -->

<!--
## Metrics in Kubernetes

In most cases metrics are available on `/metrics` endpoint of the HTTP server. For components that doesn't expose endpoint by default it can be enabled using `--bind-address` flag.

Examples of those components:

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

In a production environment you may want to configure [Prometheus Server](https://prometheus.io/) or some other metrics scraper
to periodically gather these metrics and make them available in some kind of time series database.

Note that {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} also exposes metrics in `/metrics/cadvisor`, `/metrics/resource` and `/metrics/probes` endpoints. Those metrics do not have same lifecycle.

If your cluster uses {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, reading metrics requires authorization via a user, group or ServiceAccount with a ClusterRole that allows accessing `/metrics`.
For example:
-->
## Kubernetes 中的指标

在大多数情况下，可以在 HTTP 服务器的 `/metrics` 端点上访问度量值。
对于默认情况下不公开端点的组件，可以使用 `--bind-address` 标志启用。

这些组件的示例：

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

在生产环境中，你可能需要配置 [Prometheus 服务](https://prometheus.io/) 或
某些其他指标搜集器以定期收集这些指标，并使它们在某种时间序列数据库中可用。

请注意，{{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 还会在 `/metrics/cadvisor`，
`/metrics/resource` 和 `/metrics/probes` 端点中公开度量值。这些度量值的生命周期各不相同。

如果你的集群使用了 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}，
则读取指标需要通过基于用户、组或 ServiceAccount 的鉴权，要求具有允许访问 `/metrics` 的 ClusterRole。
例如：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - nonResourceURLs:
      - "/metrics"
    verbs:
      - get
```

<!--
## Metric lifecycle

Alpha metric →  Stable metric →  Deprecated metric →  Hidden metric → Deletion

Alpha metrics have no stability guarantees; as such they can be modified or deleted at any time.

Stable metrics can be guaranteed to not change; Specifically, stability means:

* the metric itself will not be deleted (or renamed)
* the type of metric will not be modified

Deprecated metric signal that the metric will eventually be deleted; to find which version, you need to check annotation, which includes from which kubernetes version that metric will be considered deprecated.
-->
## 指标生命周期

Alpha 指标 →  稳定指标 →  弃用指标 →  隐藏指标 → 删除

Alpha 指标没有稳定性保证，因此可以随时对其进行修改或者删除。

稳定指标可以保证不会改变；具体而言，稳定意味着：

* 指标本身不会被删除（或重命名）
* 指标的类型不会被更改

已弃用的指标表明该指标最终将被删除；要搞清楚对应版本，你需要检查其注解，
其中包括从哪个 kubernetes 版本开始，将不再考虑该指标。

过期前：

```
# HELP some_counter this counts things
# TYPE some_counter counter
some_counter 0
```

过期后:

```
# HELP some_counter (Deprecated since 1.15.0) this counts things
# TYPE some_counter counter
some_counter 0
```

<!--
Once a metric is hidden then by default the metrics is not published for scraping. To use a hidden metric, you need to override the configuration for the relevant cluster component.

Once a metric is deleted, the metric is not published. You cannot change this using an override.
-->
隐藏指标后，默认情况下，该指标不会发布以供抓取。要使用隐藏指标，你需要覆盖相关集群组件的配置。

指标一旦删除，就不会发布。你无法通过重载配置来改变这一点。

<!--
## Show Hidden Metrics

As described above, admins can enable hidden metrics through a command-line flag on a specific binary. This intends to be used as an escape hatch for admins if they missed the migration of the metrics deprecated in the last release.

The flag `show-hidden-metrics-for-version` takes a version for which you want to show metrics deprecated in that release. The version is expressed as x.y, where x is the major version, y is the minor version. The patch version is not needed even though a metrics can be deprecated in a patch release, the reason for that is the metrics deprecation policy runs against the minor release.

The flag can only take the previous minor version as it's value. All metrics hidden in previous will be emitted if admins set the previous version to `show-hidden-metrics-for-version`. The too old version is not allowed because this violates the metrics deprecated policy.

Take metric `A` as an example, here assumed that `A` is deprecated in 1.n. According to metrics deprecated policy, we can reach the following conclusion:
-->
## 显示隐藏指标

综上所述，管理员可以通过设置可执行文件的命令行参数来启用隐藏指标，
如果管理员错过了上一版本中已经弃用的指标的迁移，则可以把这个用作管理员的逃生门。

`show-hidden-metrics-for-version` 标志接受版本号作为取值，版本号给出你希望显示该发行版本中已弃用的指标。
版本表示为 x.y，其中 x 是主要版本，y 是次要版本。补丁程序版本不是必须的，
即使指标可能会在补丁程序发行版中弃用，原因是指标弃用策略规定仅针对次要版本。

该参数只能使用前一个次要版本。如果管理员将先前版本设置为 `show-hidden-metrics-for-version`，
则先前版本中隐藏的度量值会再度生成。不允许使用过旧的版本，因为那样会违反指标弃用策略。

以指标 `A` 为例，此处假设 `A` 在 1.n 中已弃用。根据指标弃用策略，我们可以得出以下结论：

<!--
* In release `1.n`, the metric is deprecated, and it can be emitted by default.
* In release `1.n+1`, the metric is hidden by default and it can be emitted by command line `show-hidden-metrics-for-version=1.n`.
* In release `1.n+2`, the metric should be removed from the codebase. No escape hatch anymore.

If you're upgrading from release `1.12` to `1.13`, but still depend on a metric `A` deprecated in `1.12`, you should set hidden metrics via command line: `--show-hidden-metrics=1.12` and remember to remove this metric dependency before upgrading to `1.14`
-->
* 在版本 `1.n` 中，这个指标已经弃用，且默认情况下可以生成。
* 在版本 `1.n+1` 中，这个指标默认隐藏，可以通过命令行参数 `show-hidden-metrics-for-version=1.n` 来再度生成。
* 在版本 `1.n+2` 中，这个指标就将被从代码中移除，不会再有任何逃生窗口。

如果你要从版本 `1.12` 升级到 `1.13`，但仍依赖于 `1.12` 中弃用的指标 `A`，则应通过命令行设置隐藏指标：
`--show-hidden-metrics=1.12`，并记住在升级到 `1.14` 版本之前删除此指标依赖项。

<!--
## Disable accelerator metrics

The kubelet collects accelerator metrics through cAdvisor. To collect these metrics, for accelerators like NVIDIA GPUs, kubelet held an open handle on the driver. This meant that in order to perform infrastructure changes (for example, updating the driver), a cluster administrator needed to stop the kubelet agent.

The responsibility for collecting accelerator metrics now belongs to the vendor rather than the kubelet. Vendors must provide a container that collects metrics and exposes them to the metrics service (for example, Prometheus).

The [`DisableAcceleratorUsageMetrics` feature gate](/docs/references/command-line-tools-reference/feature-gate.md#feature-gates-for-alpha-or-beta-features:~:text= DisableAcceleratorUsageMetrics,-false) disables metrics collected by the kubelet, with a [timeline for enabling this feature by default](https://github.com/kubernetes/enhancements/tree/411e51027db842355bd489691af897afc1a41a5e/keps/sig-node/1867-disable-accelerator-usage-metrics#graduation-criteria).
-->
## 禁用加速器指标

kubelet 通过 cAdvisor 收集加速器指标。为了收集这些指标，对于 NVIDIA GPU 之类的加速器，
kubelet 在驱动程序上保持打开状态。这意味着为了执行基础结构更改（例如更新驱动程序），
集群管理员需要停止 kubelet 代理。

现在，收集加速器指标的责任属于供应商，而不是 kubelet。供应商必须提供一个收集指标的容器，
并将其公开给指标服务（例如 Prometheus）。

[`DisableAcceleratorUsageMetrics` 特性门控](/zh/docs/references/command-line-tools-reference/feature-gate.md#feature-gates-for-alpha-or-beta-features:~:text= DisableAcceleratorUsageMetrics,-false)禁止由 kubelet 收集的指标，并[带有一条时间线，默认情况下会启用此功能](https://github.com/kubernetes/enhancements/tree/411e51027db842355bd489691af897afc1a41a5e/keps/sig-node/1867-disable-accelerator-usage-metrics#graduation-criteria)。

<!--
## Component metrics

### kube-controller-manager metrics

Controller manager metrics provide important insight into the performance and health of the controller manager.
These metrics include common Go language runtime metrics such as go_routine count and controller specific metrics such as
etcd request latencies or Cloudprovider (AWS, GCE, OpenStack) API latencies that can be used
to gauge the health of a cluster.

Starting from Kubernetes 1.7, detailed Cloudprovider metrics are available for storage operations for GCE, AWS, Vsphere and OpenStack.
These metrics can be used to monitor health of persistent volume operations.

For example, for GCE these metrics are called:
-->
## 组件指标

### kube-controller-manager 指标

控制器管理器指标可提供有关控制器管理器性能和运行状况的重要洞察。
这些指标包括通用的 Go 语言运行时指标（例如 go_routine 数量）和控制器特定的度量指标，
例如可用于评估集群运行状况的 etcd 请求延迟或云提供商（AWS、GCE、OpenStack）的 API 延迟等。

从 Kubernetes 1.7 版本开始，详细的云提供商指标可用于 GCE、AWS、Vsphere 和 OpenStack 的存储操作。
这些指标可用于监控持久卷操作的运行状况。

比如，对于 GCE，这些指标称为：

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

## {{% heading "whatsnext" %}}

<!--
* Read about the [Prometheus text format](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format) for metrics
* See the list of [stable Kubernetes metrics](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)
* Read about the [Kubernetes deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
-->
* 阅读有关指标的 [Prometheus 文本格式](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format)
* 查看 [Kubernetes 稳定指标](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)的列表
* 阅读有关 [Kubernetes 弃用策略](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)