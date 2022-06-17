---
title: Kubernetes 系統元件指標
content_type: concept
weight: 60
---

<!--
title: Metrics For Kubernetes System Components
reviewers:
- brancz
- logicalhan
- RainbowMango
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
System component metrics can give a better look into what is happening inside them. Metrics are particularly useful for building dashboards and alerts.

Kubernetes components emit metrics in [Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/).
This format is structured plain text, designed so that people and machines can both read it.
-->
透過系統元件指標可以更好地瞭解系統組個內部發生的情況。系統元件指標對於構建儀表板和告警特別有用。

Kubernetes 元件以 [Prometheus 格式](https://prometheus.io/docs/instrumenting/exposition_formats/)
生成度量值。
這種格式是結構化的純文字，旨在使人和機器都可以閱讀。

<!-- body -->

<!--
## Metrics in Kubernetes

In most cases metrics are available on `/metrics` endpoint of the HTTP server. For components that doesn't expose endpoint by default it can be enabled using `--bind-address` flag.

Examples of those components:
-->
## Kubernetes 中元件的指標

在大多數情況下，可以透過 HTTP 訪問元件的 `/metrics` 端點來獲取元件的度量值。
對於那些預設情況下不暴露端點的元件，可以使用 `--bind-address` 標誌啟用。

這些元件的示例：

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
在生產環境中，你可能需要配置 [Prometheus 伺服器](https://prometheus.io/) 或
某些其他指標蒐集器以定期收集這些指標，並使它們在某種時間序列資料庫中可用。

請注意，{{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 還會在 `/metrics/cadvisor`，
`/metrics/resource` 和 `/metrics/probes` 端點中公開度量值。這些度量值的生命週期各不相同。

如果你的叢集使用了 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}，
則讀取指標需要透過基於使用者、組或 ServiceAccount 的鑑權，要求具有允許訪問
`/metrics` 的 ClusterRole。
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

Alpha metric →  Stable metric →  Deprecated metric →  Hidden metric → Deleted metric

Alpha metrics have no stability guarantees. These metrics can be modified or deleted at any time.

Stable metrics are guaranteed to not change. This means:
* A stable metric without a deprecated signature will not be deleted or renamed
* A stable metric's type will not be modified

Deprecated metrics are slated for deletion, but are still available for use.
These metrics include an annotation about the version in which they became deprecated.
-->
## 指標生命週期

Alpha 指標 →  穩定的指標 →  棄用的指標 →  隱藏的指標 → 刪除的指標

Alpha 指標沒有穩定性保證。這些指標可以隨時被修改或者刪除。

穩定的指標可以保證不會改變。這意味著：

* 穩定的、不包含已棄用（deprecated）簽名的指標不會被刪除（或重新命名）
* 穩定的指標的型別不會被更改

已棄用的指標最終將被刪除，不過仍然可用。
這類指標包含註解，標明其被廢棄的版本。

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
Hidden metrics are no longer published for scraping, but are still available for use. To use a hidden metric, please refer to the [Show hidden metrics](#show-hidden-metrics) section. 

Deleted metrics are no longer published and cannot be used.
-->
隱藏的指標不會再被髮布以供抓取，但仍然可用。
要使用隱藏指標，請參閱[顯式隱藏指標](#show-hidden-metrics)節。

刪除的指標不再被髮布，亦無法使用。

<!--
## Show hidden metrics

As described above, admins can enable hidden metrics through a command-line flag on a specific binary. This intends to be used as an escape hatch for admins if they missed the migration of the metrics deprecated in the last release.

The flag `show-hidden-metrics-for-version` takes a version for which you want to show metrics deprecated in that release. The version is expressed as x.y, where x is the major version, y is the minor version. The patch version is not needed even though a metrics can be deprecated in a patch release, the reason for that is the metrics deprecation policy runs against the minor release.

The flag can only take the previous minor version as it's value. All metrics hidden in previous will be emitted if admins set the previous version to `show-hidden-metrics-for-version`. The too old version is not allowed because this violates the metrics deprecated policy.

Take metric `A` as an example, here assumed that `A` is deprecated in 1.n. According to metrics deprecated policy, we can reach the following conclusion:
-->
## 顯示隱藏指標   {#show-hidden-metrics}

如上所述，管理員可以透過設定可執行檔案的命令列引數來啟用隱藏指標，
如果管理員錯過了上一版本中已經棄用的指標的遷移，則可以把這個用作管理員的逃生門。

`show-hidden-metrics-for-version` 標誌接受版本號作為取值，版本號給出
你希望顯示該發行版本中已棄用的指標。
版本表示為 x.y，其中 x 是主要版本，y 是次要版本。補丁程式版本不是必須的，
即使指標可能會在補丁程式發行版中棄用，原因是指標棄用策略規定僅針對次要版本。

該引數只能使用前一個次要版本。如果管理員將先前版本設定為 `show-hidden-metrics-for-version`，
則先前版本中隱藏的度量值會再度生成。不允許使用過舊的版本，因為那樣會違反指標棄用策略。

以指標 `A` 為例，此處假設 `A` 在 1.n 中已棄用。根據指標棄用策略，我們可以得出以下結論：

<!--
* In release `1.n`, the metric is deprecated, and it can be emitted by default.
* In release `1.n+1`, the metric is hidden by default and it can be emitted by command line `show-hidden-metrics-for-version=1.n`.
* In release `1.n+2`, the metric should be removed from the codebase. No escape hatch anymore.

If you're upgrading from release `1.12` to `1.13`, but still depend on a metric `A` deprecated in `1.12`, you should set hidden metrics via command line: `--show-hidden-metrics=1.12` and remember to remove this metric dependency before upgrading to `1.14`
-->
* 在版本 `1.n` 中，這個指標已經棄用，且預設情況下可以生成。
* 在版本 `1.n+1` 中，這個指標預設隱藏，可以透過命令列引數 `show-hidden-metrics-for-version=1.n` 來再度生成。
* 在版本 `1.n+2` 中，這個指標就將被從程式碼中移除，不會再有任何逃生視窗。

如果你要從版本 `1.12` 升級到 `1.13`，但仍依賴於 `1.12` 中棄用的指標 `A`，則應透過命令列設定隱藏指標：
`--show-hidden-metrics=1.12`，並記住在升級到 `1.14` 版本之前刪除此指標依賴項。

<!--
## Disable accelerator metrics

The kubelet collects accelerator metrics through cAdvisor. To collect these metrics, for accelerators like NVIDIA GPUs, kubelet held an open handle on the driver. This meant that in order to perform infrastructure changes (for example, updating the driver), a cluster administrator needed to stop the kubelet agent.

The responsibility for collecting accelerator metrics now belongs to the vendor rather than the kubelet. Vendors must provide a container that collects metrics and exposes them to the metrics service (for example, Prometheus).

The [`DisableAcceleratorUsageMetrics` feature gate](/docs/reference/command-line-tools-reference/feature-gates/) disables metrics collected by the kubelet, with a [timeline for enabling this feature by default](https://github.com/kubernetes/enhancements/tree/411e51027db842355bd489691af897afc1a41a5e/keps/sig-node/1867-disable-accelerator-usage-metrics#graduation-criteria).
-->
## 禁用加速器指標

kubelet 透過 cAdvisor 收集加速器指標。為了收集這些指標，對於 NVIDIA GPU 之類的加速器，
kubelet 在驅動程式上保持開啟狀態。這意味著為了執行基礎結構更改（例如更新驅動程式），
叢集管理員需要停止 kubelet 代理。

現在，收集加速器指標的責任屬於供應商，而不是 kubelet。供應商必須提供一個收集指標的容器，
並將其公開給指標服務（例如 Prometheus）。

[`DisableAcceleratorUsageMetrics` 特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
禁止由 kubelet 收集的指標。
關於[何時會在預設情況下啟用此功能也有一定規劃](https://github.com/kubernetes/enhancements/tree/411e51027db842355bd489691af897afc1a41a5e/keps/sig-node/1867-disable-accelerator-usage-metrics#graduation-criteria)。

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
## 元件指標

### kube-controller-manager 指標

控制器管理器指標可提供有關控制器管理器效能和執行狀況的重要洞察。
這些指標包括通用的 Go 語言執行時指標（例如 go_routine 數量）和控制器特定的度量指標，
例如可用於評估叢集執行狀況的 etcd 請求延遲或雲提供商（AWS、GCE、OpenStack）的 API 延遲等。

從 Kubernetes 1.7 版本開始，詳細的雲提供商指標可用於 GCE、AWS、Vsphere 和 OpenStack 的儲存操作。
這些指標可用於監控持久卷操作的執行狀況。

比如，對於 GCE，這些指標稱為：

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
The scheduler exposes optional metrics that reports the requested resources and the desired limits of all running pods. These metrics can be used to build capacity planning dashboards, assess current or historical scheduling limits, quickly identify workloads that cannot schedule due to lack of resources, and compare actual usage to the pod's request.
-->
排程器會暴露一些可選的指標，報告所有執行中 Pods 所請求的資源和期望的約束值。
這些指標可用來構造容量規劃監控面板、訪問排程約束的當前或歷史資料、
快速發現因為缺少資源而無法被排程的負載，或者將 Pod 的實際資源用量
與其請求值進行比較。

<!--
The kube-scheduler identifies the resource [requests and limits](/docs/concepts/configuration/manage-resources-containers/) configured for each Pod; when either a request or limit is non-zero, the kube-scheduler reports a metrics timeseries. The time series is labelled by:
- namespace
- pod name
- the node where the pod is scheduled or an empty string if not yet scheduled
- priority
- the assigned scheduler for that pod
- the name of the resource (for example, `cpu`)
- the unit of the resource if known (for example, `cores`)
-->
kube-scheduler 元件能夠辯識各個 Pod 所配置的資源
[請求和約束](/zh-cn/docs/concepts/configuration/manage-resources-containers/)。
在 Pod 的資源請求值或者約束值非零時，kube-scheduler 會以度量值時間序列的形式
生成報告。該時間序列值包含以下標籤：
- 名字空間
- Pod 名稱
- Pod 排程所處節點，或者當 Pod 未被排程時用空字串表示
- 優先順序
- 為 Pod 所指派的排程器
- 資源的名稱（例如，`cpu`）
- 資源的單位，如果知道的話（例如，`cores`）

<!--
Once a pod reaches completion (has a `restartPolicy` of `Never` or `OnFailure` and is in the `Succeeded` or `Failed` pod phase, or has been deleted and all containers have a terminated state) the series is no longer reported since the scheduler is now free to schedule other pods to run. The two metrics are called `kube_pod_resource_request` and `kube_pod_resource_limit`.

The metrics are exposed at the HTTP endpoint `/metrics/resources` and require the same authorization as the `/metrics`
endpoint on the scheduler. You must use the `-show-hidden-metrics-for-version=1.20` flag to expose these alpha stability metrics.
-->
一旦 Pod 進入完成狀態（其 `restartPolicy` 為 `Never` 或 `OnFailure`，且
其處於 `Succeeded` 或 `Failed` Pod 階段，或者已經被刪除且所有容器都具有
終止狀態），該時間序列停止報告，因為排程器現在可以排程其它 Pod 來執行。
這兩個指標稱作 `kube_pod_resource_request` 和 `kube_pod_resource_limit`。

指標暴露在 HTTP 端點 `/metrics/resources`，與排程器上的 `/metrics` 端點
一樣要求相同的訪問授權。你必須使用
`--show-hidden-metrics-for-version=1.20` 標誌才能暴露那些穩定性為 Alpha
的指標。

<!--
## Disabling metrics

You can explicitly turn off metrics via command line flag `--disabled-metrics`. This may be desired if, for example, a metric is causing a performance problem. The input is a list of disabled metrics (i.e. `--disabled-metrics=metric1,metric2`).
-->
## 禁用指標 {#disabling-metrics}

你可以透過命令列標誌 `--disabled-metrics` 來關閉某指標。
在例如某指標會帶來效能問題的情況下，這一操作可能是有用的。
標誌的引數值是一組被禁止的指標（例如：`--disabled-metrics=metric1,metric2`）。

<!--
## Metric cardinality enforcement

Metrics with unbounded dimensions could cause memory issues in the components they instrument. To limit resource use, you can use the `--allow-label-value` command line option to dynamically configure an allow-list of label values for a metric.
-->
## 指標順序性保證    {#metric-cardinality-enforcement}

在 Alpha 階段，標誌只能接受一組對映值作為可以使用的指標標籤。
每個對映值的格式為`<指標名稱>,<標籤名稱>=<可用標籤列表>`，其中
`<可用標籤列表>` 是一個用逗號分隔的、可接受的標籤名的列表。

<!--
The overall format looks like:
`--allow-label-value <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...`.
-->
最終的格式看起來會是這樣：
`--allow-label-value <指標名稱>,<標籤名稱>='<可用值1>,<可用值2>...', <指標名稱2>,<標籤名稱>='<可用值1>, <可用值2>...', ...`.

<!--
Here is an example:
-->
下面是一個例子：

`--allow-label-value number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'`

## {{% heading "whatsnext" %}}

<!--
* Read about the [Prometheus text format](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format) for metrics
* Read about the [Kubernetes deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
-->
* 閱讀有關指標的 [Prometheus 文字格式](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format)
* 閱讀有關 [Kubernetes 棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
