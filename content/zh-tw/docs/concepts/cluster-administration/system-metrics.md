---
title: Kubernetes 系統組件指標
content_type: concept
weight: 70
---
<!--
title: Metrics For Kubernetes System Components
reviewers:
- brancz
- logicalhan
- RainbowMango
content_type: concept
weight: 70
-->

<!-- overview -->

<!--
System component metrics can give a better look into what is happening inside them. Metrics are
particularly useful for building dashboards and alerts.

Kubernetes components emit metrics in [Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/).
This format is structured plain text, designed so that people and machines can both read it.
-->
通過系統組件指標可以更好地瞭解系統組個內部發生的情況。系統組件指標對於構建儀表板和告警特別有用。

Kubernetes 組件以
[Prometheus 格式](https://prometheus.io/docs/instrumenting/exposition_formats/)生成度量值。
這種格式是結構化的純文本，旨在使人和機器都可以閱讀。

<!-- body -->

<!--
## Metrics in Kubernetes

In most cases metrics are available on `/metrics` endpoint of the HTTP server. For components that
don't expose endpoint by default, it can be enabled using `--bind-address` flag.

Examples of those components:
-->
## Kubernetes 中組件的指標  {#metrics-in-kubernetes}

在大多數情況下，可以通過 HTTP 服務器的 `/metrics` 端點來獲取組件的度量值。
對於那些默認情況下不暴露端點的組件，可以使用 `--bind-address` 參數來啓用。

這些組件的示例：

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

<!--
In a production environment you may want to configure [Prometheus Server](https://prometheus.io/)
or some other metrics scraper to periodically gather these metrics and make them available in some
kind of time series database.

Note that {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} also exposes metrics in
`/metrics/cadvisor`, `/metrics/resource` and `/metrics/probes` endpoints. Those metrics do not
have the same lifecycle.

If your cluster uses {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, reading metrics requires
authorization via a user, group or ServiceAccount with a ClusterRole that allows accessing
`/metrics`. For example:
-->
在生產環境中，你可能需要配置
[Prometheus 服務器](https://prometheus.io/)或某些其他指標蒐集器以定期收集這些指標，
並使它們在某種時間序列數據庫中可用。

請注意，{{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 還會在 `/metrics/cadvisor`、
`/metrics/resource` 和 `/metrics/probes` 端點中公開度量值。這些度量值的生命週期各不相同。

如果你的集羣使用了 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}，
則讀取指標需要通過基於用戶、組或 ServiceAccount 的鑑權，要求具有允許訪問
`/metrics` 的 ClusterRole。例如：

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

Alpha metric → Beta metric → Stable metric →  Deprecated metric →  Hidden metric → Deleted metric

Alpha metrics have no stability guarantees. These metrics can be modified or deleted at any time.

Beta metrics observe a looser API contract than its stable counterparts. No labels can be removed from beta metrics during their lifetime, however, labels can be added while the metric is in the beta stage.
-->
## 指標生命週期  {#metric-lifecycle}

Alpha 指標 → Beta 指標 → 穩定的指標 → 棄用的指標 → 隱藏的指標 → 刪除的指標

Alpha 指標沒有穩定性保證。這些指標可以隨時被修改或者刪除。

Beta 指標相比其穩定版本，所遵循的 API 協議更寬鬆。
在指標的 Beta 階段生命週期內，其現有的標籤不能被移除，但可以新增標籤。

<!--
Stable metrics are guaranteed to not change. This means:

* A stable metric without a deprecated signature will not be deleted or renamed
* A stable metric's type will not be modified

Deprecated metrics are slated for deletion, but are still available for use.
These metrics include an annotation about the version in which they became deprecated.
-->
穩定的指標可以保證不會改變。這意味着：

* 穩定的、不包含已棄用（deprecated）簽名的指標不會被刪除或重命名
* 穩定的指標的類型不會被更改

已棄用的指標最終將被刪除，不過仍然可用。
這類指標包含註解，標明其是在哪個版本被棄用的。

<!--
For example:

* Before deprecation
-->
例如：

* 被棄用之前：

  ```
  # HELP some_counter this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

<!--
* After deprecation
-->
* 被棄用之後：

  ```
  # HELP some_counter (Deprecated since 1.15.0) this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

<!--
Hidden metrics are no longer published for scraping, but are still available for use.
A deprecated metric becomes a hidden metric after a period of time, based on its stability level:
* **STABLE** metrics become hidden after a minimum of 3 releases or 9 months, whichever is longer.
* **BETA** metrics become hidden after a minimum of 1 release or 4 months, whichever is longer.
* **ALPHA** metrics can be hidden or removed in the same release in which they are deprecated.

To use a hidden metric, you must enable it. For more details, refer to the
[Show hidden metrics](#show-hidden-metrics) section. 

Deleted metrics are no longer published and cannot be used.
-->
隱藏的指標不會再被髮布以供抓取，但仍然可用。
棄用的指標會根據其穩定性級別在一段時間後成爲隱藏的指標。

* **STABLE** 指標在棄用後至少 3 個發行版或 9 個月（以較長者爲準）後變爲隱藏。
* **BETA** 指標在棄用後至少 1 個發行版或 4 個月（以較長者爲準）後變爲隱藏。
* **ALPHA** 指標可以在其被棄用的同一發行版內就被隱藏或移除。

要使用某個隱藏的指標，你必須先啓用此指標。
更多細節請參閱[顯示隱藏指標](#show-hidden-metrics)一節。

刪除的指標不再被髮布，亦無法使用。

<!--
## Show hidden metrics

As described above, admins can enable hidden metrics through a command-line flag on a specific
binary. This intends to be used as an escape hatch for admins if they missed the migration of the
metrics deprecated in the last release.

The flag `show-hidden-metrics-for-version` takes a version for which you want to show metrics
deprecated in that release. The version is expressed as x.y, where x is the major version, y is
the minor version. The patch version is not needed even though a metrics can be deprecated in a
patch release, the reason for that is the metrics deprecation policy runs against the minor release.
-->
## 顯示隱藏指標   {#show-hidden-metrics}

如上所述，管理員可以通過設置可執行文件的命令行參數來啓用隱藏指標，
如果管理員錯過了上一版本中已經棄用的指標的遷移，則可以把這個用作管理員的逃生門。

`show-hidden-metrics-for-version` 參數接受版本號作爲取值，
版本號給出你希望顯示該發行版本中已棄用的指標。
版本表示爲 `x.y`，其中 `x` 是主要版本，`y` 是次要版本。補丁程序版本不是必須的，
即使指標可能會在補丁程序發行版中棄用，原因是指標棄用策略規定僅針對次要版本。

<!--
The flag can only take the previous minor version as its value.
If you want to show all metrics hidden in the previous release,
you can set the `show-hidden-metrics-for-version` flag to the previous version.
Using a version that is too old is not allowed because it violates the metrics deprecation policy.

For example, let's assume metric `A` is deprecated in `1.29`.
The version in which metric `A` becomes hidden depends on its stability level:
-->
此參數的取值只能使用前一個次要版本。如果你想顯示前一發行版中隱藏的所有指標，你可以將
`show-hidden-metrics-for-version` 參數設置爲前一個版本。
不允許使用過舊的版本，因爲那樣會違反指標棄用策略。

例如，假設指標 `A` 在 `1.29` 中被棄用。指標 `A` 在哪個版本變爲隱藏取決於其穩定性級別：

<!--
* If metric `A` is **ALPHA**, it could be hidden in `1.29`.
* If metric `A` is **BETA**, it will be hidden in `1.30` at the earliest.
  If you are upgrading to `1.30` and still need `A`, you must use the
  command-line flag `--show-hidden-metrics-for-version=1.29`.
* If metric `A` is **STABLE**, it will be hidden in `1.32` at the earliest.
  If you are upgrading to `1.32` and still need `A`, you must use the
  command-line flag `--show-hidden-metrics-for-version=1.31`.
-->
* 如果指標 `A` 是 **ALPHA** 指標，它可能會在 `1.29` 中被隱藏。
* 如果指標 `A` 是 **BETA** 指標，它最早會在 `1.30` 中被隱藏。如果你要升級到 `1.30`
  且仍然需要 `A`，你必須使用命令行參數 `--show-hidden-metrics-for-version=1.29`。
* 如果指標 `A` 是 **STABLE（穩定）**版本，它最早會在 `1.32` 中被隱藏。如果你要升級到 `1.32`
  且仍然需要 `A`，你必須使用命令行參數 `--show-hidden-metrics-for-version=1.31`。

<!--
## Component metrics

### kube-controller-manager metrics

Controller manager metrics provide important insight into the performance and health of the
controller manager. These metrics include common Go language runtime metrics such as go_routine
count and controller specific metrics such as etcd request latencies or Cloudprovider (AWS, GCE,
OpenStack) API latencies that can be used to gauge the health of a cluster.
-->
## 組件指標  {#component-metrics}

### kube-controller-manager 指標  {#kube-controller-manager-metrics}

控制器管理器指標可提供有關控制器管理器性能和運行狀況的重要洞察。
這些指標包括通用的 Go 語言運行時指標（例如 go_routine 數量）和控制器特定的度量指標，
例如可用於評估集羣運行狀況的 etcd 請求延遲或雲提供商（AWS、GCE、OpenStack）的 API 延遲等。

<!--
Starting from Kubernetes 1.7, detailed Cloudprovider metrics are available for storage operations
for GCE, AWS, Vsphere and OpenStack.
These metrics can be used to monitor health of persistent volume operations.

For example, for GCE these metrics are called:
-->
從 Kubernetes 1.7 版本開始，詳細的雲提供商指標可用於 GCE、AWS、Vsphere 和 OpenStack 的存儲操作。
這些指標可用於監控持久卷操作的運行狀況。

比如，對於 GCE，這些指標稱爲：

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

<!--
### kube-scheduler metrics
-->
### kube-scheduler 指標   {#kube-scheduler-metrics}

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

<!--
The scheduler exposes optional metrics that reports the requested resources and the desired limits
of all running pods. These metrics can be used to build capacity planning dashboards, assess
current or historical scheduling limits, quickly identify workloads that cannot schedule due to
lack of resources, and compare actual usage to the pod's request.
-->
調度器會暴露一些可選的指標，報告所有運行中 Pod 所請求的資源和期望的限制值。
這些指標可用來構造容量規劃監控面板、訪問當前或歷史的調度限制值、
快速發現因爲缺少資源而無法被調度的負載，或者將 Pod 的實際資源用量與其請求值進行比較。

<!--
The kube-scheduler identifies the resource [requests and limits](/docs/concepts/configuration/manage-resources-containers/)
configured for each Pod; when either a request or limit is non-zero, the kube-scheduler reports a
metrics timeseries. The time series is labelled by:

- namespace
- pod name
- the node where the pod is scheduled or an empty string if not yet scheduled
- priority
- the assigned scheduler for that pod
- the name of the resource (for example, `cpu`)
- the unit of the resource if known (for example, `cores`)
-->
kube-scheduler 組件能夠辯識各個 Pod
所配置的資源[請求和限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/)。
在 Pod 的資源請求值或者限制值非零時，kube-scheduler 會以度量值時間序列的形式生成報告。
該時間序列值包含以下標籤：

- 名字空間
- Pod 名稱
- Pod 調度所處節點，或者當 Pod 未被調度時用空字符串表示
- 優先級
- 爲 Pod 所指派的調度器
- 資源的名稱（例如，`cpu`）
- 資源的單位，如果知道的話（例如，`cores`）

<!--
Once a pod reaches completion (has a `restartPolicy` of `Never` or `OnFailure` and is in the
`Succeeded` or `Failed` pod phase, or has been deleted and all containers have a terminated state)
the series is no longer reported since the scheduler is now free to schedule other pods to run.
The two metrics are called `kube_pod_resource_request` and `kube_pod_resource_limit`.

The metrics are exposed at the HTTP endpoint `/metrics/resources`. They require
authorization for the `/metrics/resources` endpoint, usually granted by a
ClusterRole with the `get` verb for the `/metrics/resources` non-resource URL.

On Kubernetes 1.21 you must use the `--show-hidden-metrics-for-version=1.20`
flag to expose these alpha stability metrics.
-->
一旦 Pod 進入完成狀態（其 `restartPolicy` 爲 `Never` 或 `OnFailure`，且其處於
`Succeeded` 或 `Failed` Pod 階段，或者已經被刪除且所有容器都具有終止狀態），
該時間序列停止報告，因爲調度器現在可以調度其它 Pod 來執行。
這兩個指標稱作 `kube_pod_resource_request` 和 `kube_pod_resource_limit`。

這些指標通過 HTTP 端點 `/metrics/resources` 公開出來。
訪問 `/metrics/resources` 端點需要鑑權，通常通過對
`/metrics/resources` 非資源 URL 的 `get` 訪問授予訪問權限。  

在 Kubernetes 1.21 中，你必須使用 `--show-hidden-metrics-for-version=1.20`
參數來公開 Alpha 級穩定性的指標。

<!--
### kubelet Pressure Stall Information (PSI) metrics
-->
### kubelet 壓力阻塞信息（PSI）指標  {#kubelet-pressure-stall-information-psi-metrics}

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

<!--
As a beta feature, Kubernetes lets you configure kubelet to collect Linux kernel
[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
(PSI) for CPU, memory and I/O usage.
The information is collected at node, pod and container level.
The metrics are exposed at the `/metrics/cadvisor` endpoint with the following names:
-->
作爲一個 Beta 階段的特性，Kubernetes 允許你配置 kubelet 以基於 CPU、內存和 I/O 的使用情況收集 Linux
內核的[壓力阻塞信息（PSI）](https://docs.kernel.org/accounting/psi.html)。
此信息是在節點、Pod 和容器級別進行收集的。
這些指標通過 `/metrics/cadvisor` 端點暴露，指標名稱如下：

```
container_pressure_cpu_stalled_seconds_total
container_pressure_cpu_waiting_seconds_total
container_pressure_memory_stalled_seconds_total
container_pressure_memory_waiting_seconds_total
container_pressure_io_stalled_seconds_total
container_pressure_io_waiting_seconds_total
```

<!--
This feature is enabled by default, by setting the `KubeletPSI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/). The information is also exposed in the
[Summary API](/docs/reference/instrumentation/node-metrics#psi).
-->
此特性默認啓用，通過 `KubeletPSI`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)管理。
此信息也會通過 [Summary API](/zh-cn/docs/reference/instrumentation/node-metrics#psi) 暴露。

<!--
You can learn how to interpret the PSI metrics in [Understand PSI Metrics](/docs/reference/instrumentation/understand-psi-metrics/).
-->
參見[瞭解 PSI 指標](/zh-cn/docs/reference/instrumentation/understand-psi-metrics/)，
學習如何解讀 PSI 指標。

<!--
#### Requirements

Pressure Stall Information requires:

- [Linux kernel versions 4.20 or later](/docs/reference/node/kernel-version-requirements#requirements-psi).
- [cgroup v2](/docs/concepts/architecture/cgroups)
-->
#### 要求

啓用壓力阻塞信息需滿足以下條件：

- [Linux 內核版本爲 4.20 或更高](/zh-cn/docs/reference/node/kernel-version-requirements#requirements-psi)
- [CGroup v2](/zh-cn/docs/concepts/architecture/cgroups)

<!--
## Disabling metrics

You can explicitly turn off metrics via command line flag `--disabled-metrics`. This may be
desired if, for example, a metric is causing a performance problem. The input is a list of
disabled metrics (i.e. `--disabled-metrics=metric1,metric2`).
-->
## 禁用指標 {#disabling-metrics}

你可以通過命令行參數 `--disabled-metrics` 來關閉某指標。
在例如某指標會帶來性能問題的情況下，這一操作可能是有用的。
參數值是一組被禁用的指標（例如：`--disabled-metrics=metric1,metric2`）。

<!--
## Metric cardinality enforcement

Metrics with unbounded dimensions could cause memory issues in the components they instrument. To
limit resource use, you can use the `--allow-metric-labels` command line option to dynamically
configure an allow-list of label values for a metric.

In alpha stage, the flag can only take in a series of mappings as metric label allow-list.
Each mapping is of the format `<metric_name>,<label_name>=<allowed_labels>` where 
`<allowed_labels>` is a comma-separated list of acceptable label names.
-->
## 指標順序性保證    {#metric-cardinality-enforcement}

具有無限維度的指標可能會在其監控的組件中引起內存問題。
爲了限制資源使用，你可以使用 `--allow-metric-labels` 命令行選項來爲指標動態配置允許的標籤值列表。

在 Alpha 階段，此選項只能接受一組映射值作爲可以使用的指標標籤。
每個映射值的格式爲`<指標名稱>,<標籤名稱>=<可用標籤列表>`，其中
`<可用標籤列表>` 是一個用逗號分隔的、可接受的標籤名的列表。

<!--
The overall format looks like:

```
--allow-metric-labels <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...
```
-->
最終的格式看起來會是這樣：

```
--allow-metric-labels <指標名稱>,<標籤名稱>='<可用值1>,<可用值2>...', <指標名稱2>,<標籤名稱>='<可用值1>, <可用值2>...', ...
```

<!--
Here is an example:
-->
下面是一個例子：

```none
--allow-metric-labels number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'
```

<!--
In addition to specifying this from the CLI, this can also be done within a configuration file. You
can specify the path to that configuration file using the `--allow-metric-labels-manifest` command
line argument to a component. Here's an example of the contents of that configuration file:
-->
除了從 CLI 中指定之外，還可以在配置文件中完成此操作。
你可以使用組件的 `--allow-metric-labels-manifest` 命令行參數指定該配置文件的路徑。
以下是該配置文件的內容示例：

```yaml
"metric1,label2": "v1,v2,v3"
"metric2,label1": "v1,v2,v3"
```

<!--
Additionally, the `cardinality_enforcement_unexpected_categorizations_total` meta-metric records the
count of unexpected categorizations during cardinality enforcement, that is, whenever a label value
is encountered that is not allowed with respect to the allow-list constraints.
-->
此外，`cardinality_enforcement_unexpected_categorizations_total`
元指標記錄基數執行期間意外分類的計數，
即每當遇到不在允許列表約束中的標籤值時進行計數。

## {{% heading "whatsnext" %}}

<!--
* Read about the [Prometheus text format](https://github.com/prometheus/docs/blob/main/docs/instrumenting/exposition_formats.md#text-based-format)
  for metrics
* See the list of [stable Kubernetes metrics](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)
* Read about the [Kubernetes deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
-->
* 閱讀有關指標的 [Prometheus 文本格式](https://github.com/prometheus/docs/blob/main/docs/instrumenting/exposition_formats.md#text-based-format)
* 參閱[穩定的 Kubernetes 指標](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)的列表
* 閱讀有關 [Kubernetes 棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
