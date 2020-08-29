---
title: Kubernetes 控制面的指标
content_type: concept
weight: 60
aliases:
- controller-metrics.md
---

<!-- overview -->

<!--
System component metrics can give a better look into what is happening inside them. Metrics are particularly useful for building dashboards and alerts.

Metrics in Kubernetes control plane are emitted in [prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/) and are human readable.
-->
系统组件的指标可以让我们更好的看清系统内部究竟发生了什么，尤其对于构建仪表盘和告警都非常有用。

Kubernetes 控制面板中的指标是以
[prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/)
格式发出的，而且是易于阅读的。

<!-- body -->

<!--
## Metrics in Kubernetes
In most cases metrics are available on `/metrics` endpoint of the HTTP server. For components that doesn't expose endpoint by default it can be enabled using `--bind-address` flag.
-->
## Kubernetes 的指标

在大多数情况下，指标在 HTTP 服务器的 `/metrics` 端点使用。
对于默认情况下不暴露端点的组件，可以使用 `--bind-address` 参数启用。

<!--
Examples of those components:
-->
举例下面这些组件：

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

<!--
In a production environment you may want to configure [Prometheus Server](https://prometheus.io/) or some other metrics scraper
to periodically gather these metrics and make them available in some kind of time series database.

Note that {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} also exposes metrics in `/metrics/cadvisor`, `/metrics/resource` and `/metrics/probes` endpoints. Those metrics do not have same lifecycle.

If your cluster uses {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, reading metrics requires authorization via a user, group or ServiceAccount with a ClusterRole that allows accessing `/metrics`.
For example:
-->
在生产环境中，你可能需要配置 [Prometheus 服务器](https://prometheus.io/) 
或其他指标收集器来定期收集这些指标，并使它们在某种时间序列数据库中可用。

请注意 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 同样在
`/metrics/cadvisor`、`/metrics/resource` 和 `/metrics/probes`  等端点提供性能指标。
这些指标的生命周期并不相同。

如果你的集群还使用了 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}，
那读取指标数据的时候，还需要通过具有 ClusterRole 的用户、组或者 ServiceAccount 来进行授权，
才有权限访问 `/metrics` 。

举例：

```
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
-->
## 指标的生命周期

内测版指标 → 稳定版指标 → 弃用指标 → 隐藏指标 → 删除

内测版指标没有任何稳定性保证，因此可能随时被修改或删除。

稳定版指标可以保证不会改变，具体的说，稳定就意味着：

<!--
* the metric itself will not be deleted (or renamed)
* the type of metric will not be modified
-->

* 这个指标自身不会被删除或者重命名。
* 这个指标类型不会被更改

<!--
Deprecated metric signal that the metric will eventually be deleted; to find which version, you need to check annotation, which includes from which kubernetes version that metric will be considered deprecated.

Before deprecation:
-->
弃用指标表明这个指标最终将会被删除，要想查找是哪个版本，你需要检查其注释，
注释中包括该指标从哪个 kubernetes 版本被弃用。

指标弃用前：

```
# HELP some_counter this counts things
# TYPE some_counter counter
some_counter 0
```

<!-- After deprecation: -->
指标弃用后：

```
# HELP some_counter (Deprecated since 1.15.0) this counts things
# TYPE some_counter counter
some_counter 0
```

<!--
Once a metric is hidden then by default the metrics is not published for scraping. To use a hidden metric, you need to override the configuration for the relevant cluster component.

Once a metric is deleted, the metric is not published. You cannot change this using an override.
-->
一个指标一旦被隐藏，默认这个指标是不会发布来被抓取的。
如果你想要使用这个隐藏指标，你需要覆盖相关集群组件的配置。

一个指标一旦被删除，那这个指标就不会被发布，您也不可以通过覆盖配置来进行更改。

<!--
## Show Hidden Metrics

As described above, admins can enable hidden metrics through a command-line flag on a specific binary. This intends to be used as an escape hatch for admins if they missed the migration of the metrics deprecated in the last release.

The flag `show-hidden-metrics-for-version` takes a version for which you want to show metrics deprecated in that release. The version is expressed as x.y, where x is the major version, y is the minor version. The patch version is not needed even though a metrics can be deprecated in a patch release, the reason for that is the metrics deprecation policy runs against the minor release.

The flag can only take the previous minor version as it's value. All metrics hidden in previous will be emitted if admins set the previous version to `show-hidden-metrics-for-version`. The too old version is not allowed because this violates the metrics deprecated policy.

Take metric `A` as an example, here assumed that `A` is deprecated in 1.n. According to metrics deprecated policy, we can reach the following conclusion:
-->
## 显示隐藏指标

综上所述，管理员可以通过在运行可执行文件时添加一些特定的参数来开启一些隐藏的指标。
当管理员错过了之前版本的的一些已弃用的指标时，这个可被视作是一个后门。

`show-hidden-metrics-for-version` 参数可以指定一个版本，用来显示这个版本中被隐藏的指标。
这个版本号形式是x.y，x 是主要版本号，y 是次要版本号。补丁版本并不是必须的，
尽管在一些补丁版本中也会有一些指标会被弃用，因为指标弃用策略主要是针对次要版本。

这个参数只能使用上一版本作为其值，如果管理员将上一版本设置为 `show-hidden-metrics-for-version` 的值，
那么就会显示上一版本所有被隐藏的指标，太老的版本是不允许的，因为这不符合指标弃用策略。

以指标 `A` 为例，这里假设 `A` 指标在 1.n 版本中被弃用，根据指标弃用策略，我们可以得出以下结论：

<!--
* In release `1.n`, the metric is deprecated, and it can be emitted by default.
* In release `1.n+1`, the metric is hidden by default and it can be emitted by command line `show-hidden-metrics-for-version=1.n`.
* In release `1.n+2`, the metric should be removed from the codebase. No escape hatch anymore.

If you're upgrading from release `1.12` to `1.13`, but still depend on a metric `A` deprecated in `1.12`, you should set hidden metrics via command line: `--show-hidden-metrics=1.12` and remember to remove this metric dependency before upgrading to `1.14`
-->

* 在 `1.n` 版本中，这个指标被弃用，并且默认情况下，这个指标还是可以发出.
* 在 `1.n+1` 版本中，这个指标默认被隐藏，你可以通过设置参数 `show-hidden-metrics-for-version=1.n` 来使它可以被发出.
* 在 `1.n+2` 版本中，这个指标就被从代码库中删除，也不会再有后门了.

如果你想要从 `1.12` 版本升级到 `1.13` ，但仍然需要依赖指标 `A` ，
你可以通过命令行设置隐藏指标 `--show-hidden-metrics=1.12`，
但是在升级到 `1.14`时就必须要删除这个指标的依赖，因为这个版本中这个指标已经被删除了。

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

控制器管理器指标提供了有关控制器管理器性能和运行状况的重要见解。这些指标包括常见的一些 Go 语言运行时的重要指标（比如 go_routine 的数量）和一些控制器的特定指标（比如 etcd 的请求时延），还有一些云供应商（比如 AWS、GCE、OpenStack）的 API 请求延迟，用来评估集群的整体运行状况。

从 Kubernetes 1.7 开始，详细的云供应商指标便可用于 GCE、 AWS、Vsphere 和 OpenStack 的存储操作，这些指标可用于监控持久卷运行时的健康状况。

举例，GCE 的这些指标是这些：

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
* Read about the [Kubernetes deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior )
-->

* 了解有关 [Prometheus 指标相关的文本格式](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format)
* 查看 [Kubernetes 稳定版指标](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)列表
* 了解有关 [Kubernetes 指标弃用策略](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior )


