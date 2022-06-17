---
title: Pod 水平自動擴縮
feature:
  title: 水平擴縮 
  description: >
    使用一個簡單的命令、一個 UI 或基於 CPU 使用情況自動對應用程式進行擴縮。

content_type: concept
weight: 90
---

<!-- overview -->

<!--
In Kubernetes, a _HorizontalPodAutoscaler_ automatically updates a workload resource (such as
a {{< glossary_tooltip text="Deployment" term_id="deployment" >}} or
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}), with the
aim of automatically scaling the workload to match demand.
-->
在 Kubernetes 中，_HorizontalPodAutoscaler_ 自動更新工作負載資源
（例如 {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或者 
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}），
目的是自動擴縮工作負載以滿足需求。

<!--
Horizontal scaling means that the response to increased load is to deploy more
{{< glossary_tooltip text="Pods" term_id="pod" >}}.
This is different from _vertical_ scaling, which for Kubernetes would mean
assigning more resources (for example: memory or CPU) to the Pods that are already
running for the workload.

If the load decreases, and the number of Pods is above the configured minimum,
the HorizontalPodAutoscaler instructs the workload resource (the Deployment, StatefulSet,
or other similar resource) to scale back down.
-->
水平擴縮意味著對增加的負載的響應是部署更多的 {{< glossary_tooltip text="Pods" term_id="pod" >}}。
這與 “垂直（Vertical）” 擴縮不同，對於 Kubernetes，
垂直擴縮意味著將更多資源（例如：記憶體或 CPU）分配給已經為工作負載執行的 Pod。

如果負載減少，並且 Pod 的數量高於配置的最小值，
HorizontalPodAutoscaler 會指示工作負載資源（ Deployment、StatefulSet 或其他類似資源）縮減。

<!--
Horizontal pod autoscaling does not apply to objects that can't be scaled (for example:
a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}.)
-->
水平 Pod 自動擴縮不適用於無法擴縮的物件（例如：{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}。）

<!--
The HorizontalPodAutoscaler is implemented as a Kubernetes API resource and a
{{< glossary_tooltip text="controller" term_id="controller" >}}.
The resource determines the behavior of the controller.
The horizontal pod autoscaling controller, running within the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}, periodically adjusts the
desired scale of its target (for example, a Deployment) to match observed metrics such as average
CPU utilization, average memory utilization, or any other custom metric you specify.
 -->
HorizontalPodAutoscaler 被實現為 Kubernetes API 資源和{{< glossary_tooltip text="控制器" term_id="controller" >}}。

資源決定了控制器的行為。在 Kubernetes {{< glossary_tooltip text="控制平面" term_id="control-plane" >}}內執行的水平
Pod 自動擴縮控制器會定期調整其目標（例如：Deployment）的所需規模，以匹配觀察到的指標，
例如，平均 CPU 利用率、平均記憶體利用率或你指定的任何其他自定義指標。

<!--
There is [walkthrough example](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) of using
horizontal pod autoscaling.
-->
使用水平 Pod 自動擴縮[演練示例](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)。

<!-- body -->

<!--
## How does a HorizontalPodAutoscaler work?
-->
## HorizontalPodAutoscaler 是如何工作的？ {#how-does-a-horizontalpodautoscaler-work}

{{< figure src="/images/docs/horizontal-pod-autoscaler.svg" caption="HorizontalPodAutoscaler 控制 Deployment 及其 ReplicaSet 的規模" class="diagram-medium">}}

<!--
Kubernetes implements horizontal pod autoscaling as a control loop that runs intermittently
(it is not a continuous process). The interval is set by the
`--horizontal-pod-autoscaler-sync-period` parameter to the
[`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
(and the default interval is 15 seconds).
-->
Kubernetes 將水平 Pod 自動擴縮實現為一個間歇執行的控制迴路（它不是一個連續的過程）。間隔由 
[`kube-controller-manager`](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/) 
的 `--horizontal-pod-autoscaler-sync-period` 引數設定（預設間隔為 15 秒）。

<!--
Once during each period, the controller manager queries the resource utilization against the
metrics specified in each HorizontalPodAutoscaler definition.  The controller manager 
finds the target resource defined by the `scaleTargetRef`,
then selects the pods based on the target resource's `.spec.selector` labels, and obtains the metrics from either the resource metrics API (for per-pod resource metrics),
or the custom metrics API (for all other metrics).
-->
在每個時間段內，控制器管理器都會根據每個 HorizontalPodAutoscaler 定義中指定的指標查詢資源利用率。
控制器管理器找到由 `scaleTargetRef` 定義的目標資源，然後根據目標資源的 `.spec.selector` 標籤選擇 Pod，
並從資源指標 API（針對每個 Pod 的資源指標）或自定義指標獲取指標 API（適用於所有其他指標）。

<!--
* For per-pod resource metrics (like CPU), the controller fetches the metrics
  from the resource metrics API for each Pod targeted by the HorizontalPodAutoscaler.
  Then, if a target utilization value is set, the controller calculates the utilization
  value as a percentage of the equivalent [resource request](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) on the containers in
  each Pod.  If a target raw value is set, the raw metric values are used directly.
  The controller then takes the mean of the utilization or the raw value (depending on the type
  of target specified) across all targeted Pods, and produces a ratio used to scale
  the number of desired replicas.
-->
* 對於按 Pod 統計的資源指標（如 CPU），控制器從資源指標 API 中獲取每一個
  HorizontalPodAutoscaler 指定的 Pod 的度量值，如果設定了目標使用率，
  控制器獲取每個 Pod 中的容器[資源使用](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) 情況，
  並計算資源使用率。如果設定了 target 值，將直接使用原始資料（不再計算百分比）。
  接下來，控制器根據平均的資源使用率或原始值計算出擴縮的比例，進而計算出目標副本數。

  <!--
  Please note that if some of the Pod's containers do not have the relevant resource request set,
  CPU utilization for the Pod will not be defined and the autoscaler will
  not take any action for that metric. See the [algorithm
  details](#algorithm-details) section below for more information about
  how the autoscaling algorithm works.
  -->
  需要注意的是，如果 Pod 某些容器不支援資源採集，那麼控制器將不會使用該 Pod 的 CPU 使用率。
  下面的[演算法細節](#algorithm-details)章節將會介紹詳細的演算法。

<!--
* For per-pod custom metrics, the controller functions similarly to per-pod resource metrics,
  except that it works with raw values, not utilization values.
-->
* 如果 Pod 使用自定義指示，控制器機制與資源指標類似，區別在於自定義指標只使用
  原始值，而不是使用率。

<!--
* For object metrics and external metrics, a single metric is fetched, which describes
  the object in question. This metric is compared to the target
  value, to produce a ratio as above. In the `autoscaling/v2beta2` API
  version, this value can optionally be divided by the number of Pods before the
  comparison is made.
-->
* 如果 Pod 使用物件指標和外部指標（每個指標描述一個物件資訊）。
  這個指標將直接根據目標設定值相比較，並生成一個上面提到的擴縮比例。
  在 `autoscaling/v2beta2` 版本 API 中，這個指標也可以根據 Pod 數量平分後再計算。

<!--
The common use for HorizontalPodAutoscaler is to configure it to fetch metrics from
{{< glossary_tooltip text="aggregated APIs" term_id="aggregation-layer" >}}
(`metrics.k8s.io`, `custom.metrics.k8s.io`, or `external.metrics.k8s.io`).  The `metrics.k8s.io` API is
usually provided by an add-on named Metrics Server, which needs to be launched separately.
For more information about resource metrics, see
[Metrics Server](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server).
-->
HorizontalPodAutoscaler 的常見用途是將其配置為從{{< glossary_tooltip text="聚合 API" term_id="aggregation-layer" >}}
（`metrics.k8s.io`、`custom.metrics.k8s.io` 或 `external.metrics.k8s.io`）獲取指標。
`metrics.k8s.io` API 通常由名為 Metrics Server 的外掛提供，需要單獨啟動。有關資源指標的更多資訊，
請參閱 [Metrics Server](/zh-cn/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server)。

<!--
[Support for metrics APIs](#support-for-metrics-apis) explains the stability guarantees and support status for these
different APIs.

The HorizontalPodAutoscaler controller accesses corresponding workload resources that support scaling (such as Deployments
and StatefulSet). These resources each have a subresource named `scale`, an interface that allows you to dynamically set the
number of replicas and examine each of their current states.
For general information about subresources in the Kubernetes API, see
[Kubernetes API Concepts](/docs/reference/using-api/api-concepts/).
-->
對 [Metrics API 的支援](#support-for-metrics-apis)解釋了這些不同 API 的穩定性保證和支援狀態

HorizontalPodAutoscaler 控制器訪問支援擴縮的相應工作負載資源（例如：Deployments 和 StatefulSet）。
這些資源每個都有一個名為 `scale` 的子資源，該介面允許你動態設定副本的數量並檢查它們的每個當前狀態。
有關 Kubernetes API 子資源的一般資訊，
請參閱 [Kubernetes API 概念](/zh-cn/docs/reference/using-api/api-concepts/)。

<!--
### Algorithm Details

From the most basic perspective, the Horizontal Pod Autoscaler controller
operates on the ratio between desired metric value and current metric
value:
-->
### 演算法細節   {#algorithm-details}

從最基本的角度來看，Pod 水平自動擴縮控制器根據當前指標和期望指標來計算擴縮比例。

<!--
```
desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
```
-->
```
期望副本數 = ceil[當前副本數 * (當前指標 / 期望指標)]
```

<!--
For example, if the current metric value is `200m`, and the desired value
is `100m`, the number of replicas will be doubled, since `200.0 / 100.0 ==
2.0` If the current value is instead `50m`, you'll halve the number of
replicas, since `50.0 / 100.0 == 0.5`.  The control plane skips any scaling
action if the ratio is sufficiently close to 1.0 (within a globally-configurable
tolerance, 0.1 by default).
-->
例如，如果當前指標值為 `200m`，而期望值為 `100m`，則副本數將加倍，
因為 `200.0 / 100.0 == 2.0` 如果當前值為 `50m`，則副本數將減半，
因為 `50.0 / 100.0 == 0.5`。如果比率足夠接近 1.0（在全域性可配置的容差範圍內，預設為 0.1），
則控制平面會跳過擴縮操作。

<!--
When a `targetAverageValue` or `targetAverageUtilization` is specified,
the `currentMetricValue` is computed by taking the average of the given
metric across all Pods in the HorizontalPodAutoscaler's scale target.

Before checking the tolerance and deciding on the final values, the control
plane also considers whether any metrics are missing, and how many Pods
are [`Ready`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions).
-->
如果 HorizontalPodAutoscaler 指定的是 `targetAverageValue` 或 `targetAverageUtilization`，
那麼將會把指定 Pod 度量值的平均值做為 `currentMetricValue`。

在檢查容差並決定最終值之前，控制平面還會考慮是否缺少任何指標，
以及有多少 Pod [`已就緒`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)。

<!--
All Pods with a deletion timestamp set (objects with a deletion timestamp are
in the process of being shut down / removed) are ignored, and all failed Pods
are discarded.

If a particular Pod is missing metrics, it is set aside for later; Pods
with missing metrics will be used to adjust the final scaling amount.
-->
所有設定了刪除時間戳的 Pod（帶有刪除時間戳的物件正在關閉/移除的過程中）都會被忽略，
所有失敗的 Pod 都會被丟棄。

如果某個 Pod 缺失度量值，它將會被擱置，只在最終確定擴縮數量時再考慮。

<!--
When scaling on CPU, if any pod has yet to become ready (it's still
initializing, or possibly is unhealthy) *or* the most recent metric point for the pod was before it
became ready, that pod is set aside as well.
-->
當使用 CPU 指標來擴縮時，任何還未就緒（還在初始化，或者可能是不健康的）狀態的 Pod **或** 
最近的指標度量值採集於就緒狀態前的 Pod，該 Pod 也會被擱置。

<!--
Due to technical constraints, the HorizontalPodAutoscaler controller
cannot exactly determine the first time a pod becomes ready when
determining whether to set aside certain CPU metrics. Instead, it
considers a Pod "not yet ready" if it's unready and transitioned to
unready within a short, configurable window of time since it started.
This value is configured with the `--horizontal-pod-autoscaler-initial-readiness-delay` flag, and its default is 30
seconds.  Once a pod has become ready, it considers any transition to
ready to be the first if it occurred within a longer, configurable time
since it started. This value is configured with the `--horizontal-pod-autoscaler-cpu-initialization-period` flag, and its
default is 5 minutes.
-->
由於技術限制，HorizontalPodAutoscaler 控制器在確定是否保留某些 CPU 指標時無法準確確定 Pod 首次就緒的時間。
相反，如果 Pod 未準備好並在其啟動後的一個可配置的短時間視窗內轉換為未準備好，它會認為 Pod “尚未準備好”。
該值使用 `--horizontal-pod-autoscaler-initial-readiness-delay` 標誌配置，預設值為 30 秒。
一旦 Pod 準備就緒，如果它發生在自啟動後較長的、可配置的時間內，它就會認為任何向準備就緒的轉換都是第一個。
該值由 `-horizontal-pod-autoscaler-cpu-initialization-period` 標誌配置，預設為 5 分鐘。

<!--
The `currentMetricValue / desiredMetricValue` base scale ratio is then
calculated using the remaining pods not set aside or discarded from above.
-->
在排除掉被擱置的 Pod 後，擴縮比例就會根據 `currentMetricValue/desiredMetricValue`
計算出來。

<!--
If there were any missing metrics, the control plane recomputes the average more
conservatively, assuming those pods were consuming 100% of the desired
value in case of a scale down, and 0% in case of a scale up.  This dampens
the magnitude of any potential scale.
-->
如果缺失某些度量值，控制平面會更保守地重新計算平均值，在需要縮小時假設這些 Pod 消耗了目標值的 100%，
在需要放大時假設這些 Pod 消耗了 0% 目標值。這可以在一定程度上抑制擴縮的幅度。

<!--
Furthermore, if any not-yet-ready pods were present, and the workload would have
scaled up without factoring in missing metrics or not-yet-ready pods,
the controller conservatively assumes that the not-yet-ready pods are consuming 0%
of the desired metric, further dampening the magnitude of a scale up.
-->
此外，如果存在任何尚未就緒的 Pod，工作負載會在不考慮遺漏指標或尚未就緒的 Pod 的情況下進行擴縮，
控制器保守地假設尚未就緒的 Pod 消耗了期望指標的 0%，從而進一步降低了擴縮的幅度。

<!--
After factoring in the not-yet-ready pods and missing metrics, the
controller recalculates the usage ratio.  If the new ratio reverses the scale
direction, or is within the tolerance, the controller doesn't take any scaling
action. In other cases, the new ratio is used to decide any change to the
number of Pods.
-->
考慮到尚未準備好的 Pod 和缺失的指標後，控制器會重新計算使用率。
如果新的比率與擴縮方向相反，或者在容差範圍內，則控制器不會執行任何擴縮操作。
在其他情況下，新比率用於決定對 Pod 數量的任何更改。

<!--
Note that the *original* value for the average utilization is reported
back via the HorizontalPodAutoscaler status, without factoring in the
not-yet-ready pods or missing metrics, even when the new usage ratio is
used.
-->
注意，平均利用率的 **原始** 值是透過 HorizontalPodAutoscaler 狀態體現的，
而不考慮尚未準備好的 Pod 或缺少的指標，即使使用新的使用率也是如此。

<!--
If multiple metrics are specified in a HorizontalPodAutoscaler, this
calculation is done for each metric, and then the largest of the desired
replica counts is chosen. If any of these metrics cannot be converted
into a desired replica count (e.g. due to an error fetching the metrics
from the metrics APIs) and a scale down is suggested by the metrics which
can be fetched, scaling is skipped. This means that the HPA is still capable
of scaling up if one or more metrics give a `desiredReplicas` greater than
the current value.
-->
如果建立 HorizontalPodAutoscaler 時指定了多個指標，
那麼會按照每個指標分別計算擴縮副本數，取最大值進行擴縮。
如果任何一個指標無法順利地計算出擴縮副本數（比如，透過 API 獲取指標時出錯），
並且可獲取的指標建議縮容，那麼本次擴縮會被跳過。
這表示，如果一個或多個指標給出的 `desiredReplicas` 值大於當前值，HPA 仍然能實現擴容。

<!--
Finally, right before HPA scales the target, the scale recommendation is recorded.  The
controller considers all recommendations within a configurable window choosing the
highest recommendation from within that window. This value can be configured using the `--horizontal-pod-autoscaler-downscale-stabilization` flag, which defaults to 5 minutes.
This means that scaledowns will occur gradually, smoothing out the impact of rapidly
fluctuating metric values.
-->
最後，在 HPA 控制器執行擴縮操作之前，會記錄擴縮建議資訊。
控制器會在操作時間視窗中考慮所有的建議資訊，並從中選擇得分最高的建議。
這個值可透過 `kube-controller-manager` 服務的啟動引數
`--horizontal-pod-autoscaler-downscale-stabilization` 進行配置，
預設值為 5 分鐘。
這個配置可以讓系統更為平滑地進行縮容操作，從而消除短時間內指標值快速波動產生的影響。

<!--
## API Object

The Horizontal Pod Autoscaler is an API resource in the Kubernetes
`autoscaling` API group.  The current stable version can be found in
the `autoscaling/v2` API version which includes support for scaling on
memory and custom metrics. The new fields introduced in
`autoscaling/v2` are preserved as annotations when working with
`autoscaling/v1`.
-->
## API 物件   {#api-object}

HorizontalPodAutoscaler 是 Kubernetes `autoscaling` API 組中的 API 資源。
當前的穩定版本可以在 `autoscaling/v2` API 版本中找到，其中包括對基於記憶體和自定義指標執行擴縮的支援。
在使用 `autoscaling/v1` 時，`autoscaling/v2` 中引入的新欄位作為註釋保留。

<!--
When you create a HorizontalPodAutoscaler API object, make sure the name specified is a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
More details about the API object can be found at
[HorizontalPodAutoscaler Object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#horizontalpodautoscaler-v2-autoscaling).
-->
建立 HorizontalPodAutoscaler 物件時，需要確保所給的名稱是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
有關 API 物件的更多資訊，請查閱
[HorizontalPodAutoscaler 物件設計文件](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#horizontalpodautoscaler-v2-autoscaling)。

<!--
## Stability of workload scale {#flapping}

When managing the scale of a group of replicas using the HorizontalPodAutoscaler,
it is possible that the number of replicas keeps fluctuating frequently due to the
dynamic nature of the metrics evaluated. This is sometimes referred to as *thrashing*,
or *flapping*. It's similar to the concept of *hysteresis* in cybernetics.
-->
## 工作量規模的穩定性 {#flapping}

在使用 HorizontalPodAutoscaler 管理一組副本的規模時，由於評估的指標的動態特性，
副本的數量可能會經常波動。這有時被稱為 **抖動（thrashing）** 或 **波動（flapping）**。它類似於控制論中的 **滯後（hysteresis）** 概念。

<!--
## Autoscaling during rolling update

Kubernetes lets you perform a rolling update on a Deployment. In that
case, the Deployment manages the underlying ReplicaSets for you.
When you configure autoscaling for a Deployment, you bind a
HorizontalPodAutoscaler to a single Deployment. The HorizontalPodAutoscaler
manages the `replicas` field of the Deployment. The deployment controller is responsible
for setting the `replicas` of the underlying ReplicaSets so that they add up to a suitable
number during the rollout and also afterwards.
-->
## 滾動升級時擴縮   {#autoscaling-during-rolling-update}

Kubernetes 允許你在 Deployment 上執行滾動更新。在這種情況下，Deployment 為你管理下層的 ReplicaSet。
當你為一個 Deployment 配置自動擴縮時，你要為每個 Deployment 繫結一個 HorizontalPodAutoscaler。
HorizontalPodAutoscaler 管理 Deployment 的 `replicas` 欄位。
Deployment Controller 負責設定下層 ReplicaSet 的 `replicas` 欄位，
以便確保在上線及後續過程副本個數合適。

<!--
If you perform a rolling update of a StatefulSet that has an autoscaled number of
replicas, the StatefulSet directly manages its set of Pods (there is no intermediate resource
similar to ReplicaSet).
-->
如果你對一個副本個數被自動擴縮的 StatefulSet 執行滾動更新， 該 StatefulSet
會直接管理它的 Pod 集合 （不存在類似 ReplicaSet 這樣的中間資源）。

<!--
## Support for resource metrics

Any HPA target can be scaled based on the resource usage of the pods in the scaling target.
When defining the pod specification the resource requests like `cpu` and `memory` should
be specified. This is used to determine the resource utilization and used by the HPA controller
to scale the target up or down. To use resource utilization based scaling specify a metric source
like this:
-->
## 對資源指標的支援   {#support-for-resource-metrics}

HPA 的任何目標資源都可以基於其中的 Pods 的資源用量來實現擴縮。
在定義 Pod 規約時，類似 `cpu` 和 `memory` 這類資源請求必須被設定。
這些設定值被用來確定資源利用量並被 HPA 控制器用來對目標資源完成擴縮操作。
要使用基於資源利用率的擴縮，可以像下面這樣指定一個指標源：

```yaml
type: Resource
resource:
  name: cpu
  target:
    type: Utilization
    averageUtilization: 60
```

<!--
With this metric the HPA controller will keep the average utilization of the pods in the scaling
target at 60%. Utilization is the ratio between the current usage of resource to the requested
resources of the pod. See [Algorithm](#algorithm-details) for more details about how the utilization
is calculated and averaged.
-->
基於這一指標設定，HPA 控制器會維持擴縮目標中的 Pods 的平均資源利用率在 60%。
利用率是 Pod 的當前資源用量與其請求值之間的比值。關於如何計算利用率以及如何計算平均值
的細節可參考[演算法](#algorithm-details)小節。

{{< note >}}
<!--
Since the resource usages of all the containers are summed up the total pod utilization may not
accurately represent the individual container resource usage. This could lead to situations where
a single container might be running with high usage and the HPA will not scale out because the overall
pod usage is still within acceptable limits.
-->
由於所有的容器的資源用量都會被累加起來，Pod 的總體資源用量值可能不會精確體現
各個容器的資源用量。這一現象也會導致一些問題，例如某個容器執行時的資源用量非常
高，但因為 Pod 層面的資源用量總值讓人在可接受的約束範圍內，HPA 不會執行擴大
目標物件規模的操作。
{{< /note >}}

<!--
### Container Resource Metrics
-->
### 容器資源指標   {#container-resource-metrics}

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

<!--
The HorizontalPodAutoscaler API also supports a container metric source where the HPA can track the
resource usage of individual containers across a set of Pods, in order to scale the target resource.
This lets you configure scaling thresholds for the containers that matter most in a particular Pod.
For example, if you have a web application and a logging sidecar, you can scale based on the resource
use of the web application, ignoring the sidecar container and its resource use.
-->
HorizontalPodAutoscaler API 也支援容器指標源，這時 HPA 可以跟蹤記錄一組 Pods 中各個容器的
資源用量，進而觸發擴縮目標物件的操作。
容器資源指標的支援使得你可以為特定 Pod 中最重要的容器配置規模擴縮閾值。
例如，如果你有一個 Web 應用和一個執行日誌操作的邊車容器，你可以基於 Web 應用的
資源用量來執行擴縮，忽略邊車容器的存在及其資源用量。

<!--
If you revise the target resource to have a new Pod specification with a different set of containers,
you should revise the HPA spec if that newly added container should also be used for
scaling. If the specified container in the metric source is not present or only present in a subset
of the pods then those pods are ignored and the recommendation is recalculated. See [Algorithm](#algorithm-details)
for more details about the calculation. To use container resources for autoscaling define a metric
source as follows:
-->
如果你更改擴縮目標物件，令其使用新的、包含一組不同的容器的 Pod 規約，你就需要
修改 HPA 的規約才能基於新新增的容器來執行規模擴縮操作。
如果指標源中指定的容器不存在或者僅存在於部分 Pods 中，那麼這些 Pods 會被忽略，
HPA 會重新計算資源用量值。參閱[演算法](#algorithm-details)小節進一步瞭解計算細節。
要使用容器資源用量來完成自動擴縮，可以像下面這樣定義指標源：

```yaml
type: ContainerResource
containerResource:
  name: cpu
  container: application
  target:
    type: Utilization
    averageUtilization: 60
```

<!--
In the above example the HPA controller scales the target such that the average utilization of the cpu
in the `application` container of all the pods is 60%.
-->
在上面的例子中，HPA 控制器會對目標物件執行擴縮操作以確保所有 Pods 中
`application` 容器的平均 CPU 用量為 60%。

{{< note >}}
<!--
If you change the name of a container that a HorizontalPodAutoscaler is tracking, you can
make that change in a specific order to ensure scaling remains available and effective
whilst the change is being applied. Before you update the resource that defines the container
(such as a Deployment), you should update the associated HPA to track both the new and
old container names. This way, the HPA is able to calculate a scaling recommendation
throughout the update process.
-->
如果你要更改 HorizontalPodAutoscaler 所跟蹤記錄的容器的名稱，你可以按一定順序
來執行這一更改，確保在應用更改的過程中用來判定擴縮行為的容器可用。
在更新定義容器的資源（如 Deployment）之前，你需要更新相關的 HPA，使之能夠同時
跟蹤記錄新的和老的容器名稱。這樣，HPA 就能夠在整個更新過程中繼續計算並提供擴縮操作建議。

<!--
Once you have rolled out the container name change to the workload resource, tidy up by removing
the old container name from the HPA specification.
-->
一旦你已經將容器名稱變更這一操作應用到整個負載物件至上，就可以從 HPA
的規約中去掉老的容器名稱，完成清理操作。
{{< /note >}}

<!--
## Scaling on custom metrics

(the `autoscaling/v2beta2` API version previously provided this ability as a beta feature)

Provided that you use the `autoscaling/v2` API version, you can configure a HorizontalPodAutoscaler
to scale based on a custom metric (that is not built in to Kubernetes or any Kubernetes component).
The HorizontalPodAutoscaler controller then queries for these custom metrics from the Kubernetes
API.

See [Support for metrics APIs](#support-for-metrics-apis) for the requirements.
-->
## 擴充套件自定義指標 {#scaling-on-custom-metrics}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

（之前的 `autoscaling/v2beta2` API 版本將此功能作為 beta 功能提供）

如果你使用 `autoscaling/v2` API 版本，則可以將 HorizontalPodAutoscaler 
配置為基於自定義指標（未內置於 Kubernetes 或任何 Kubernetes 元件）進行擴縮。
HorizontalPodAutoscaler 控制器能夠從 Kubernetes API 查詢這些自定義指標。

有關要求，請參閱對 [Metrics APIs 的支援](#support-for-metrics-apis)。

<!--
## Scaling on multiple metrics

(the `autoscaling/v2beta2` API version previously provided this ability as a beta feature)

Provided that you use the `autoscaling/v2` API version, you can specify multiple metrics for a
HorizontalPodAutoscaler to scale on. Then, the HorizontalPodAutoscaler controller evaluates each metric,
and proposes a new scale based on that metric. The HorizontalPodAutoscaler takes the maximum scale
recommended for each metric and sets the workload to that size (provided that this isn't larger than the
overall maximum that you configured).
-->
## 基於多個指標來執行擴縮 {#scaling-on-multiple-metrics}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

（之前的 `autoscaling/v2beta2` API 版本將此功能作為 beta 功能提供）

如果你使用 `autoscaling/v2` API 版本，你可以為 HorizontalPodAutoscaler 指定多個指標以進行擴縮。
HorizontalPodAutoscaler 控制器評估每個指標，並根據該指標提出一個新的比例。
HorizontalPodAutoscaler 採用為每個指標推薦的最大比例，
並將工作負載設定為該大小（前提是這不大於你配置的總體最大值）。

<!--
## Support for metrics APIs

By default, the HorizontalPodAutoscaler controller retrieves metrics from a series of APIs.  In order for it to access these
APIs, cluster administrators must ensure that:
-->
## 對 Metrics API 的支援   {#support-for-metrics-apis}

預設情況下，HorizontalPodAutoscaler 控制器會從一系列的 API 中檢索度量值。
叢集管理員需要確保下述條件，以保證 HPA 控制器能夠訪問這些 API：

<!--
* The [API aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) is enabled.

* The corresponding APIs are registered:

   * For resource metrics, this is the `metrics.k8s.io` API, generally provided by [metrics-server](https://github.com/kubernetes-sigs/metrics-server).
     It can be launched as a cluster addon.

   * For custom metrics, this is the `custom.metrics.k8s.io` API.  It's provided by "adapter" API servers provided by metrics solution vendors.
     Check with your metrics pipeline to see if there is a Kubernetes metrics adapter available.

   * For external metrics, this is the `external.metrics.k8s.io` API.  It may be provided by the custom metrics adapters provided above.
-->
* 啟用了 [API 聚合層](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

* 相應的 API 已註冊：

   * 對於資源指標，將使用 `metrics.k8s.io` API，一般由 [metrics-server](https://github.com/kubernetes-incubator/metrics-server) 提供。
     它可以作為叢集外掛啟動。
    
   * 對於自定義指標，將使用 `custom.metrics.k8s.io` API。
    它由其他度量指標方案廠商的“介面卡（Adapter）” API 伺服器提供。
    檢查你的指標管道以檢視是否有可用的 Kubernetes 指標介面卡。
   
   * 對於外部指標，將使用 `external.metrics.k8s.io` API。可能由上面的自定義指標介面卡提供。

<!--  
For more information on these different metrics paths and how they differ please see the relevant design proposals for
[the HPA V2](https://github.com/kubernetes/design-proposals-archive/blob/main/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://github.com/kubernetes/design-proposals-archive/blob/main/instrumentation/custom-metrics-api.md)
and [external.metrics.k8s.io](https://github.com/kubernetes/design-proposals-archive/blob/main/instrumentation/external-metrics-api.md).
-->
關於指標來源以及其區別的更多資訊，請參閱相關的設計文件，
[HPA V2](https://github.com/kubernetes/design-proposals-archive/blob/main/autoscaling/hpa-v2.md)，
[custom.metrics.k8s.io](https://github.com/kubernetes/design-proposals-archive/blob/main/instrumentation/custom-metrics-api.md) 和 
[external.metrics.k8s.io](https://github.com/kubernetes/design-proposals-archive/blob/main/instrumentation/external-metrics-api.md)。

<!--
For examples of how to use them see [the walkthrough for using custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
and [the walkthrough for using external metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects).
-->
關於如何使用它們的示例，請參考 
[使用自定義指標的教程](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
和[使用外部指標的教程](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects)。

<!--  
## Configurable scaling behavior

(the `autoscaling/v2beta2` API version previously provided this ability as a beta feature)

If you use the `v2` HorizontalPodAutoscaler API, you can use the `behavior` field
(see the [API reference](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerSpec))
to configure separate scale-up and scale-down behaviors.
You specify these behaviours by setting `scaleUp` and / or `scaleDown`
under the `behavior` field.
-->
## 可配置的擴縮行為 {#configurable-scaling-behavior}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

（之前的 `autoscaling/v2beta2` API 版本將此功能作為 beta 功能提供）

如果你使用 `v2` HorizontalPodAutoscaler API，你可以使用 `behavior` 欄位
（請參閱 [API 參考](/zh-cn/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerSpec)）
來配置單獨的放大和縮小行為。你可以透過在行為欄位下設定 `scaleUp` 和/或 `scaleDown` 來指定這些行為。

<!--
You can specify a _stabilization window_ that prevents [flapping](#flapping)
the replica count for a scaling target. Scaling policies also let you controls the
rate of change of replicas while scaling.
-->

你可以指定一個 “穩定視窗” ，以防止擴縮目標的副本計數發生[波動](#flapping)。
擴縮策略還允許你在擴縮時控制副本的變化率。

<!--  
### Scaling Policies

One or more scaling policies can be specified in the `behavior` section of the spec.
When multiple policies are specified the policy which allows the highest amount of
change is the policy which is selected by default. The following example shows this behavior
while scaling down:
-->
### 擴縮策略 {#scaling-policies}
可以在規約的 `behavior` 部分中指定一個或多個擴縮策略。當指定多個策略時，
允許最大更改量的策略是預設選擇的策略。以下示例顯示了縮小時的這種行為：

```yaml
behavior:
  scaleDown:
    policies:
    - type: Pods
      value: 4
      periodSeconds: 60
    - type: Percent
      value: 10
      periodSeconds: 60
```

<!--  
`periodSeconds` indicates the length of time in the past for which the policy must hold true.
The first policy _(Pods)_ allows at most 4 replicas to be scaled down in one minute. The second policy
_(Percent)_ allows at most 10% of the current replicas to be scaled down in one minute.

Since by default the policy which allows the highest amount of change is selected, the second policy will
only be used when the number of pod replicas is more than 40. With 40 or less replicas, the first policy will be applied.
For instance if there are 80 replicas and the target has to be scaled down to 10 replicas
then during the first step 8 replicas will be reduced. In the next iteration when the number
of replicas is 72, 10% of the pods is 7.2 but the number is rounded up to 8. On each loop of
the autoscaler controller the number of pods to be change is re-calculated based on the number
of current replicas. When the number of replicas falls below 40 the first policy _(Pods)_ is applied
and 4 replicas will be reduced at a time.
-->
`periodSeconds` 表示在過去的多長時間內要求策略值為真。
第一個策略（Pods）允許在一分鐘內最多縮容 4 個副本。第二個策略（Percent）
允許在一分鐘內最多縮容當前副本個數的百分之十。

由於預設情況下會選擇容許更大程度作出變更的策略，只有 Pod 副本數大於 40 時，
第二個策略才會被採用。如果副本數為 40 或者更少，則應用第一個策略。
例如，如果有 80 個副本，並且目標必須縮小到 10 個副本，那麼在第一步中將減少 8 個副本。
在下一輪迭代中，當副本的數量為 72 時，10% 的 Pod 數為 7.2，但是這個數字向上取整為 8。
在 autoscaler 控制器的每個迴圈中，將根據當前副本的數量重新計算要更改的 Pod 數量。
當副本數量低於 40 時，應用第一個策略（Pods），一次減少 4 個副本。

<!--  
The policy selection can be changed by specifying the `selectPolicy` field for a scaling
direction. By setting the value to `Min` which would select the policy which allows the
smallest change in the replica count. Setting the value to `Disabled` completely disables
scaling in that direction.
-->
可以指定擴縮方向的 `selectPolicy` 欄位來更改策略選擇。
透過設定 `Min` 的值，它將選擇副本數變化最小的策略。
將該值設定為 `Disabled` 將完全禁用該方向的擴縮。

<!--  
### Stabilization Window

The stabilization window is used to restrict the [flapping](#flapping) of
replica count when the metrics used for scaling keep fluctuating. The autoscaling algorithm
uses this window to infer a previous desired state and avoid unwanted changes to workload
scale.

For example, in the following example snippet, a stabilization window is specified for `scaleDown`.
-->
### 穩定視窗 {#stabilization-window}

當用於擴縮的指標不斷波動時，穩定視窗用於限制副本計數的[波動](#flapping)。
自動擴縮演算法使用此視窗來推斷先前的期望狀態並避免對工作負載規模進行不必要的更改。

例如，在以下示例程式碼段中，為 `scaleDown` 指定了穩定視窗。

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300
```

<!--  
When the metrics indicate that the target should be scaled down the algorithm looks
into previously computed desired states, and uses the highest value from the specified
interval. In the above example, all desired states from the past 5 minutes will be considered.
-->
當指標顯示目標應該縮容時，自動擴縮演算法檢視之前計算的期望狀態，並使用指定時間間隔內的最大值。
在上面的例子中，過去 5 分鐘的所有期望狀態都會被考慮。

<!--
This approximates a rolling maximum, and avoids having the scaling algorithm frequently
remove Pods only to trigger recreating an equivalent Pod just moments later.
-->
這近似於滾動最大值，並避免了擴縮演算法頻繁刪除 Pod 而又觸發重新建立等效 Pod。

<!--  
### Default Behavior

To use the custom scaling not all fields have to be specified. Only values which need to be
customized can be specified. These custom values are merged with default values. The default values
match the existing behavior in the HPA algorithm.
-->
### 預設行為 {#default-behavior}

要使用自定義擴縮，不必指定所有欄位。
只有需要自定義的欄位才需要指定。
這些自定義值與預設值合併。
預設值與 HPA 演算法中的現有行為匹配。

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
  scaleUp:
    stabilizationWindowSeconds: 0
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
    - type: Pods
      value: 4
      periodSeconds: 15
    selectPolicy: Max
```

<!--  
For scaling down the stabilization window is _300_ seconds (or the value of the
`--horizontal-pod-autoscaler-downscale-stabilization` flag if provided). There is only a single policy
for scaling down which allows a 100% of the currently running replicas to be removed which
means the scaling target can be scaled down to the minimum allowed replicas.
For scaling up there is no stabilization window. When the metrics indicate that the target should be
scaled up the target is scaled up immediately. There are 2 policies where 4 pods or a 100% of the currently
running replicas will be added every 15 seconds till the HPA reaches its steady state.
-->
用於縮小穩定視窗的時間為 _300_  秒(或是 `--horizontal-pod-autoscaler-downscale-stabilization`
引數設定值)。
只有一種縮容的策略，允許 100% 刪除當前執行的副本，這意味著擴縮目標可以縮小到允許的最小副本數。
對於擴容，沒有穩定視窗。當指標顯示目標應該擴容時，目標會立即擴容。
這裡有兩種策略，每 15 秒新增 4 個 Pod 或 100% 當前執行的副本數，直到 HPA 達到穩定狀態。

<!--  
### Example: change downscale stabilization window

To provide a custom downscale stabilization window of 1 minute, the following
behavior would be added to the HPA:
--> 
### 示例：更改縮容穩定視窗 {#example-change-downscale-stabilization-window}

將下面的 behavior 配置新增到 HPA 中，可提供一個 1 分鐘的自定義縮容穩定視窗：

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 60
```

<!--  
### Example: limit scale down rate

To limit the rate at which pods are removed by the HPA to 10% per minute, the
following behavior would be added to the HPA:
-->
### 示例：限制縮容速率 {#example-limit-scale-down-rate}

將下面的 behavior 配置新增到 HPA 中，可限制 Pod 被 HPA 刪除速率為每分鐘 10%：

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
```

<!--  
To ensure that no more than 5 Pods are removed per minute, you can add a second scale-down
policy with a fixed size of 5, and set `selectPolicy` to minimum. Setting `selectPolicy` to `Min` means
that the autoscaler chooses the policy that affects the smallest number of Pods:
-->
為了確保每分鐘刪除的 Pod 數不超過 5 個，可以新增第二個縮容策略，大小固定為 5，並將 `selectPolicy` 設定為最小值。
將 `selectPolicy` 設定為 `Min` 意味著 autoscaler 會選擇影響 Pod 數量最小的策略:

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
    - type: Pods
      value: 5
      periodSeconds: 60
    selectPolicy: Min
```

<!--  
### Example: disable scale down

The `selectPolicy` value of `Disabled` turns off scaling the given direction.
So to prevent downscaling the following policy would be used:
-->

### 示例：禁用縮容 {#example-disable-scale-down}

`selectPolicy` 的值 `Disabled` 會關閉對給定方向的縮容。
因此使用以下策略，將會阻止縮容：

```yaml
behavior:
  scaleDown:
    selectPolicy: Disabled
```
<!--
## Support for HorizontalPodAutoscaler in kubectl

HorizontalPodAutoscaler, like every API resource, is supported in a standard way by `kubectl`.
You can create a new autoscaler using `kubectl create` command.
You can list autoscalers by `kubectl get hpa` or get detailed description by `kubectl describe hpa`.
Finally, you can delete an autoscaler using `kubectl delete hpa`.
-->
## kubectl 對 HorizontalPodAutoscaler 的支援 {#support-for-horizontalpodautoscaler-in-kubectl}

與每個 API 資源一樣，HorizontalPodAutoscaler 都被 `kubectl` 以標準方式支援。
你可以使用 `kubectl create` 命令建立一個新的自動擴縮器。
你可以透過 `kubectl get hpa` 列出自動擴縮器或透過 `kubectl describe hpa` 獲取詳細描述。
最後，你可以使用 `kubectl delete hpa` 刪除自動擴縮器。

<!--
In addition, there is a special `kubectl autoscale` command for creating a HorizontalPodAutoscaler object.
For instance, executing `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for ReplicaSet *foo*, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
-->
此外，還有一個特殊的 `kubectl autoscale` 命令用於建立 HorizontalPodAutoscaler 物件。
例如，執行 `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80` 
將為 ReplicaSet *foo* 建立一個自動擴縮器，目標 CPU 利用率設定為 `80%`，副本數在 2 到 5 之間。

<!--
## Implicit maintenance-mode deactivation

You can implicitly deactivate the HPA for a target without the
need to change the HPA configuration itself. If the target's desired replica count
is set to 0, and the HPA's minimum replica count is greater than 0, the HPA 
stops adjusting the target (and sets the `ScalingActive` Condition on itself
to `false`) until you reactivate it by manually adjusting the target's desired
replica count or HPA's minimum replica count.
-->
## 隱式維護狀態禁用 {#implicit-maintenance-mode-deactivation}

你可以在不必更改 HPA 配置的情況下隱式地為某個目標禁用 HPA。
如果此目標的期望副本個數被設定為 0，而 HPA 的最小副本個數大於 0，
則 HPA 會停止調整目標（並將其自身的 `ScalingActive` 狀況設定為 `false`），
直到你透過手動調整目標的期望副本個數或 HPA 的最小副本個數來重新啟用。

<!--
### Migrating Deployments and StatefulSets to horizontal autoscaling

When an HPA is enabled, it is recommended that the value of `spec.replicas` of
the Deployment and / or StatefulSet be removed from their
{{< glossary_tooltip text="manifest(s)" term_id="manifest" >}}.  If this isn't done, any time
a change to that object is applied, for example via `kubectl apply -f
deployment.yaml`, this will instruct Kubernetes to scale the current number of Pods
to the value of the `spec.replicas` key. This may not be
desired and could be troublesome when an HPA is active.
-->

### 將 Deployment 和 StatefulSet 遷移到水平自動擴縮 {#migrating-deployments-and-statefulsets-to-horizontal-autoscaling}

當啟用 HPA 時，建議從它們的{{< glossary_tooltip text="清單" term_id="manifest" >}}中
刪除 Deployment 和/或 StatefulSet 的 `spec.replicas` 的值。
如果不這樣做，則只要應用對該物件的更改，例如透過 `kubectl apply -f deployment.yaml`，
這將指示 Kubernetes 將當前 Pod 數量擴縮到 `spec.replicas` 鍵的值。這可能不是所希望的，
並且當 HPA 處於活動狀態時可能會很麻煩。

<!--
Keep in mind that the removal of `spec.replicas` may incur a one-time
degradation of Pod counts as the default value of this key is 1 (reference
[Deployment Replicas](/docs/concepts/workloads/controllers/deployment#replicas)).
Upon the update, all Pods except 1 will begin their termination procedures.  Any
deployment application afterwards will behave as normal and respect a rolling
update configuration as desired.  You can avoid this degradation by choosing one of the following two
methods based on how you are modifying your deployments:
-->
請記住，刪除 `spec.replicas` 可能會導致 Pod 計數一次性降級，因為此鍵的預設值為 1
（參考 [Deployment Replicas](/zh-cn/docs/concepts/workloads/controllers/deployment#replicas)）。
更新後，除 1 之外的所有 Pod 都將開始其終止程式。之後的任何部署應用程式都將正常執行，
並根據需要遵守滾動更新配置。你可以根據修改部署的方式選擇以下兩種方法之一來避免這種降級：

{{< tabs name="fix_replicas_instructions" >}}
{{% tab name="客戶端 apply 操作（預設行為）" %}}

<!--
1. `kubectl apply edit-last-applied deployment/<deployment_name>`
2. In the editor, remove `spec.replicas`. When you save and exit the editor, `kubectl`
    applies the update.  No changes to Pod counts happen at this step.
3. You can now remove `spec.replicas` from the manifest. If you use source code management,
    also commit your changes or take whatever other steps for revising the source code
    are appropriate for how you track updates.
4. From here on out you can run `kubectl apply -f deployment.yaml`
-->
1. `kubectl apply edit-last-applied deployment/<Deployment 名稱>`
2. 在編輯器中，刪除 `spec.replicas`。當你儲存並退出編輯器時，`kubectl` 會應用更新。
  在此步驟中不會更改 Pod 計數。
3. 你現在可以從清單中刪除 `spec.replicas`。如果你使用原始碼管理，
  還應提交你的更改或採取任何其他步驟來修改原始碼，以適應你如何跟蹤更新。
4. 從這裡開始，你可以執行 `kubectl apply -f deployment.yaml`

{{% /tab %}}
{{% tab name="伺服器端 apply 操作" %}}

<!--
When using the [Server-Side Apply](/docs/reference/using-api/server-side-apply/)
you can follow the [transferring ownership](/docs/reference/using-api/server-side-apply/#transferring-ownership)
guidelines, which cover this exact use case.
-->
使用[伺服器端 Apply](/zh-cn/docs/reference/using-api/server-side-apply/) 機制，
你可以遵循[交出所有權](/zh-cn/docs/reference/using-api/server-side-apply/#transferring-ownership) 說明，
該指南涵蓋了這個確切的用例。

{{% /tab %}}
{{< /tabs >}}
## {{% heading "whatsnext" %}}

<!--
If you configure autoscaling in your cluster, you may also want to consider running a
cluster-level autoscaler such as [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler).

For more information on HorizontalPodAutoscaler:
-->
如果你在叢集中配置自動擴縮，你可能還需要考慮執行叢集級別的自動擴縮器，
例如 [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)。

有關 HorizontalPodAutoscaler 的更多資訊：

<!--
* Read a [walkthrough example](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) for horizontal pod autoscaling.
* Read documentation for [`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* If you would like to write your own custom metrics adapter, check out the
  [boilerplate](https://github.com/kubernetes-sigs/custom-metrics-apiserver) to get started.
* Read the [API reference](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/) for HorizontalPodAutoscaler.
-->
* 閱讀水平 Pod 自動擴縮的[演練示例](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)。
* 閱讀 [`kubectl autoscale`](/zh-cn/docs/reference/generated/kubectl/kubectl-commands/#autoscale) 的文件。
* 如果你想編寫自己的自定義指標介面卡，
  請檢視 [boilerplate](https://github.com/kubernetes-sigs/custom-metrics-apiserver) 以開始使用。
* 閱讀 [API 參考](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/)。
