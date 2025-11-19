---
title: Pod 水平自動擴縮
feature:
  title: 水平擴縮
  description: >
    使用一個簡單的命令、一個 UI 或基於 CPU 使用情況自動對應用程序進行擴縮。
content_type: concept
weight: 90
math: true
---
<!--
reviewers:
- fgrzadkowski
- jszczepkowski
- directxman12
title: Horizontal Pod Autoscaling
feature:
  title: Horizontal scaling
  description: >
    Scale your application up and down with a simple command, with a UI, or automatically based on CPU usage.
content_type: concept
weight: 90
math: true
-->

<!-- overview -->

<!--
In Kubernetes, a _HorizontalPodAutoscaler_ automatically updates a workload resource (such as
a {{< glossary_tooltip text="Deployment" term_id="deployment" >}} or
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}), with the
aim of automatically scaling the workload to match demand.
-->
在 Kubernetes 中，**HorizontalPodAutoscaler** 自動更新工作負載資源
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
水平擴縮意味着對增加的負載的響應是部署更多的 {{< glossary_tooltip text="Pod" term_id="pod" >}}。
這與“垂直（Vertical）”擴縮不同，對於 Kubernetes，
垂直擴縮意味着將更多資源（例如：內存或 CPU）分配給已經爲工作負載運行的 Pod。

如果負載減少，並且 Pod 的數量高於設定的最小值，
HorizontalPodAutoscaler 會指示工作負載資源（Deployment、StatefulSet 或其他類似資源）縮減。

<!--
Horizontal pod autoscaling does not apply to objects that can't be scaled (for example:
a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}.)
-->
水平 Pod 自動擴縮不適用於無法擴縮的對象（例如：{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}。）

<!--
The HorizontalPodAutoscaler is implemented as a Kubernetes API resource and a
{{< glossary_tooltip text="controller" term_id="controller" >}}.
The resource determines the behavior of the controller.
The horizontal pod autoscaling controller, running within the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}, periodically adjusts the
desired scale of its target (for example, a Deployment) to match observed metrics such as average
CPU utilization, average memory utilization, or any other custom metric you specify.
-->
HorizontalPodAutoscaler 被實現爲 Kubernetes API
資源和{{< glossary_tooltip text="控制器" term_id="controller" >}}。
資源決定了控制器的行爲。
在 Kubernetes {{< glossary_tooltip text="控制平面" term_id="control-plane" >}}內運行的水平
Pod 自動擴縮控制器會定期調整其目標（例如：Deployment）的所需規模，以匹配觀察到的指標，
例如，平均 CPU 利用率、平均內存利用率或你指定的任何其他自定義指標。

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

{{< mermaid >}}
graph BT

hpa[HorizontalPodAutoscaler] --> scale[規模]

subgraph rc[RC / Deployment]
    scale
end

scale -.-> pod1[Pod 1]
scale -.-> pod2[Pod 2]
scale -.-> pod3[Pod N]

classDef hpa fill:#D5A6BD,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef rc fill:#F9CB9C,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef scale fill:#B6D7A8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef pod fill:#9FC5E8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
class hpa hpa;
class rc rc;
class scale scale;
class pod1,pod2,pod3 pod
{{< /mermaid >}}

<!--
Figure 1. HorizontalPodAutoscaler controls the scale of a Deployment and its ReplicaSet
-->
圖 1. HorizontalPodAutoscaler 控制 Deployment 及其 ReplicaSet 的規模

<!--
Kubernetes implements horizontal pod autoscaling as a control loop that runs intermittently
(it is not a continuous process). The interval is set by the
`--horizontal-pod-autoscaler-sync-period` parameter to the
[`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
(and the default interval is 15 seconds).
-->
Kubernetes 將水平 Pod 自動擴縮實現爲一個間歇運行的控制迴路（它不是一個連續的過程）。間隔由
[`kube-controller-manager`](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
的 `--horizontal-pod-autoscaler-sync-period` 參數設置（默認間隔爲 15 秒）。

<!--
Once during each period, the controller manager queries the resource utilization against the
metrics specified in each HorizontalPodAutoscaler definition. The controller manager
finds the target resource defined by the `scaleTargetRef`,
then selects the pods based on the target resource's `.spec.selector` labels,
and obtains the metrics from either the resource metrics API (for per-pod resource metrics),
or the custom metrics API (for all other metrics).
-->
在每個時間段內，控制器管理器都會根據每個 HorizontalPodAutoscaler 定義中指定的指標查詢資源利用率。
控制器管理器找到由 `scaleTargetRef` 定義的目標資源，然後根據目標資源的 `.spec.selector` 標籤選擇 Pod，
並從資源指標 API（針對每個 Pod 的資源指標）或自定義指標獲取指標 API（適用於所有其他指標）。

<!--
* For per-pod resource metrics (like CPU), the controller fetches the metrics
  from the resource metrics API for each Pod targeted by the HorizontalPodAutoscaler.
  Then, if a target utilization value is set, the controller calculates the utilization
  value as a percentage of the equivalent
  [resource request](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
  on the containers in each Pod. If a target raw value is set, the raw metric values are used directly.
  The controller then takes the mean of the utilization or the raw value (depending on the type
  of target specified) across all targeted Pods, and produces a ratio used to scale
  the number of desired replicas.
-->
* 對於按 Pod 統計的資源指標（如 CPU），控制器從資源指標 API 中獲取每一個
  HorizontalPodAutoscaler 指定的 Pod 的度量值，如果設置了目標使用率，控制器獲取每個 Pod
  中的容器[資源請求使用](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)情況，
  並計算資源使用率。如果設置了目標原始值，將直接使用原始度量值（不再計算百分比）。
  接下來，控制器根據平均的資源使用率或原始值（取決於指定的目標的類型）計算出擴縮的比例，進而計算出目標副本數。

  <!--
  Please note that if some of the Pod's containers do not have the relevant resource request set,
  CPU utilization for the Pod will not be defined and the autoscaler will
  not take any action for that metric. See the [algorithm details](#algorithm-details) section below
  for more information about how the autoscaling algorithm works.
  -->

  需要注意的是，如果 Pod 某些容器未設置相關的資源請求，那麼此 Pod 的 CPU 利用率將不會被定義。
  自動擴縮器將不會爲該指標採取任何操作。下面的[算法細節](#algorithm-details)章節將會介紹自動擴縮的詳細算法。

<!--
* For per-pod custom metrics, the controller functions similarly to per-pod resource metrics,
  except that it works with raw values, not utilization values.
-->
* 如果 Pod 使用自定義指示，控制器機制與資源指標類似，區別在於自定義指標只使用原始值，而不是使用率。

<!--
* For object metrics and external metrics, a single metric is fetched, which describes
  the object in question. This metric is compared to the target
  value, to produce a ratio as above. In the `autoscaling/v2` API
  version, this value can optionally be divided by the number of Pods before the
  comparison is made.
-->
* 如果 Pod 使用對象指標和外部指標（每個指標描述一個對象信息）。
  這個指標將直接根據目標設定值相比較，並生成一個上面提到的擴縮比例。
  在 `autoscaling/v2` 版本 API 中，這個指標也可以根據 Pod 數量平分後再計算。

<!--
The common use for HorizontalPodAutoscaler is to configure it to fetch metrics from
{{< glossary_tooltip text="aggregated APIs" term_id="aggregation-layer" >}}
(`metrics.k8s.io`, `custom.metrics.k8s.io`, or `external.metrics.k8s.io`). The `metrics.k8s.io` API is
usually provided by an add-on named Metrics Server, which needs to be launched separately.
For more information about resource metrics, see
[Metrics Server](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server).
-->
HorizontalPodAutoscaler 的常見用途是將其設定爲從{{< glossary_tooltip text="聚合 API" term_id="aggregation-layer" >}}
（`metrics.k8s.io`、`custom.metrics.k8s.io` 或 `external.metrics.k8s.io`）獲取指標。
`metrics.k8s.io` API 通常由名爲 Metrics Server 的插件提供，需要單獨啓動。有關資源指標的更多信息，
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
對 [Metrics API 的支持](#support-for-metrics-apis)解釋了這些不同 API 的穩定性保證和支持狀態。

HorizontalPodAutoscaler 控制器訪問支持擴縮的相應工作負載資源（例如：Deployment 和 StatefulSet）。
這些資源每個都有一個名爲 `scale` 的子資源，該接口允許你動態設置副本的數量並檢查它們的每個當前狀態。
有關 Kubernetes API 子資源的一般信息，
請參閱 [Kubernetes API 概念](/zh-cn/docs/reference/using-api/api-concepts/)。

<!--
### Algorithm details

From the most basic perspective, the HorizontalPodAutoscaler controller
operates on the ratio between desired metric value and current metric
value:
-->
### 算法細節   {#algorithm-details}

從最基本的角度來看，Pod 水平自動擴縮控制器根據當前指標和期望指標來計算擴縮比例。

<!--
```math
\begin{equation*}
desiredReplicas = ceil\left\lceil currentReplicas \times \frac{currentMetricValue}{desiredMetricValue} \right\rceil
\end{equation*}
```
-->
```math
\begin{equation*}
期望副本數 = ceil\left\lceil 當前副本數 \times \frac{當前指標}{期望指標} \right\rceil
\end{equation*}
```

<!--
For example, if the current metric value is `200m`, and the desired value
is `100m`, the number of replicas will be doubled, since
\\( { 200.0 \div 100.0 } = 2.0 \\).  
If the current value is instead `50m`, you'll halve the number of
replicas, since \\( { 50.0 \div 100.0 } = 0.5 \\). The control plane skips any scaling
action if the ratio is sufficiently close to 1.0 (within a
[configurable tolerance](#tolerance), 0.1 by default).
-->
例如，如果當前指標值爲 `200m`，而期望值爲 `100m`，則副本數將加倍，
因爲 \\( { 200.0 \div 100.0 } = 2.0 \\)。如果當前值爲 `50m`，則副本數將減半，
因爲  \\( { 50.0 \div 100.0 } = 0.5 \\)。如果比率足夠接近 1.0（在[可設定的容差範圍內](#tolerance)，默認爲 0.1），
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
那麼將會把指定 Pod 度量值的平均值做爲 `currentMetricValue`。

在檢查容差並決定最終值之前，控制平面還會考慮是否缺少任何指標，
以及有多少 Pod [`Ready`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)。

<!--
All Pods with a deletion timestamp set (objects with a deletion timestamp are
in the process of being shut down / removed) are ignored, and all failed Pods
are discarded.

If a particular Pod is missing metrics, it is set aside for later; Pods
with missing metrics will be used to adjust the final scaling amount.
-->
所有設置了刪除時間戳的 Pod（帶有刪除時間戳的對象正在關閉/移除的過程中）都會被忽略，
所有失敗的 Pod 都會被丟棄。

如果某個 Pod 缺失度量值，它將會被擱置，只在最終確定擴縮數量時再考慮。

<!--
When scaling on CPU, if any pod has yet to become ready (it's still
initializing, or possibly is unhealthy) _or_ the most recent metric point for
the pod was before it became ready, that pod is set aside as well.
-->
當使用 CPU 指標來擴縮時，任何還未就緒（還在初始化，或者可能是不健康的）狀態的 Pod
**或**最近的指標度量值採集於就緒狀態前的 Pod，該 Pod 也會被擱置。

<!--
Due to technical constraints, the HorizontalPodAutoscaler controller
cannot exactly determine the first time a pod becomes ready when
determining whether to set aside certain CPU metrics. Instead, it
considers a Pod "not yet ready" if it's unready and transitioned to
ready within a short, configurable window of time since it started.
This value is configured with the `--horizontal-pod-autoscaler-initial-readiness-delay`
command line option, and its default is 30 seconds.
Once a pod has become ready, it considers any transition to
ready to be the first if it occurred within a longer, configurable time
since it started. This value is configured with the
`--horizontal-pod-autoscaler-cpu-initialization-period` command line option,
and its default is 5 minutes.
-->
由於技術限制，HorizontalPodAutoscaler 控制器在確定是否保留某些 CPU 指標時無法準確確定 Pod 首次就緒的時間。
相反，如果 Pod 未準備好並在其啓動後的一個可設定的短時間窗口內轉換爲準備好，它會認爲 Pod “尚未準備好”。
此值使用 `--horizontal-pod-autoscaler-initial-readiness-delay` 命令列選項設定，默認值爲 30 秒。
一旦 Pod 準備就緒，如果它發生在自啓動後較長的、可設定的時間內，它就會認爲任何向準備就緒的轉換都是第一個。
此值由 `--horizontal-pod-autoscaler-cpu-initialization-period` 命令列選項設定，默認值爲 5 分鐘。

<!--
The \\( currentMetricValue \over desiredMetricValue \\) base scale ratio is then
calculated, using the remaining pods not set aside or discarded from above.
-->
在排除掉被擱置的 Pod 後，擴縮比例就會根據 \\( 當前指標 \over 預期指標 \\)
計算出來。

<!--
If there were any missing metrics, the control plane recomputes the average more
conservatively, assuming those pods were consuming 100% of the desired
value in case of a scale down, and 0% in case of a scale up. This dampens
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
controller recalculates the usage ratio. If the new ratio reverses the scale
direction, or is within the tolerance, the controller doesn't take any scaling
action. In other cases, the new ratio is used to decide any change to the
number of Pods.
-->
考慮到尚未準備好的 Pod 和缺失的指標後，控制器會重新計算使用率。
如果新的比率與擴縮方向相反，或者在容差範圍內，則控制器不會執行任何擴縮操作。
在其他情況下，新比率用於決定對 Pod 數量的任何更改。

<!--
Note that the _original_ value for the average utilization is reported
back via the HorizontalPodAutoscaler status, without factoring in the
not-yet-ready pods or missing metrics, even when the new usage ratio is
used.
-->
注意，平均利用率的**原始**值是通過 HorizontalPodAutoscaler 狀態體現的，
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
如果創建 HorizontalPodAutoscaler 時指定了多個指標，
那麼會按照每個指標分別計算擴縮副本數，取最大值進行擴縮。
如果任何一個指標無法順利地計算出擴縮副本數（比如，通過 API 獲取指標時出錯），
並且可獲取的指標建議縮容，那麼本次擴縮會被跳過。
這表示，如果一個或多個指標給出的 `desiredReplicas` 值大於當前值，HPA 仍然能實現擴容。

<!--
Finally, right before HPA scales the target, the scale recommendation is recorded. The
controller considers all recommendations within a configurable window choosing the
highest recommendation from within that window. You can configure this value using the
`--horizontal-pod-autoscaler-downscale-stabilization` command line option, which defaults to 5 minutes.
This means that scaledowns will occur gradually, smoothing out the impact of rapidly
fluctuating metric values.
-->
最後，在 HPA 控制器執行擴縮操作之前，會記錄擴縮建議信息。
控制器會在操作時間窗口中考慮所有的建議信息，並從中選擇得分最高的建議。
你可以使用 `--horizontal-pod-autoscaler-downscale-stabilization` 命令列選項來設定這個值，
默認值爲 5 分鐘。這個設定可以讓系統更爲平滑地進行縮容操作，從而消除短時間內指標值快速波動產生的影響。

<!--
## Pod readiness and autoscaling metrics

The HorizontalPodAutoscaler (HPA) controller includes two command line options that influence how CPU metrics are collected from Pods during startup:
-->
## Pod 準備就緒和自動伸縮指標   {#pod-readiness-and-autoscaling-metrics}

HorizontalPodAutoscaler（HPA）控制器有兩個命令列選項會影響 Pod 啓動期間如何收集其 CPU 指標：

<!--
1. `--horizontal-pod-autoscaler-cpu-initialization-period` (default: 5 minutes)

  This defines the time window after a Pod starts during which its **CPU usage is ignored** unless:
    - The Pod is in a `Ready` state **and**
    - The metric sample was taken entirely during the period it was `Ready`.
-->
1. `--horizontal-pod-autoscaler-cpu-initialization-period`（默認：5 分鐘）

   此命令列選項所定義的是 Pod 啓動後的一個時間窗口，在此期間內其 **CPU 使用率被忽略**，除非：

   - Pod 處於 `Ready` 狀態**且**
   - 指標樣本完全是在它處於 `Ready` 狀態期間採集的。

   <!--
   This command line option helps **exclude misleading high CPU usage** from initializing Pods (for example: Java apps warming up) in HPA scaling decisions.
   -->

   此命令列選項有助於**排除初始化 Pod 中的誤導性高 CPU 使用率**
   （例如，Java 應用程序預熱）對 HPA 擴縮決策的影響。

<!--
1. `--horizontal-pod-autoscaler-initial-readiness-delay` (default: 30 seconds)

  This defines a short delay period after a Pod starts during which the HPA controller treats Pods that are currently `Unready` as still initializing, **even if they have previously transitioned to `Ready` briefly**.
-->
2. `--horizontal-pod-autoscaler-initial-readiness-delay`（默認：30 秒）

   這定義了一個短暫的延遲期，在 Pod 啓動後，HPA 控制器將當前爲 `Unready`
   的 Pod 視爲仍在初始化中，**即使它們之前曾短暫轉變爲 `Ready`**。

   <!--
   It is designed to:
    - Avoid including Pods that rapidly fluctuate between `Ready` and `Unready` during startup.
    - Ensure stability in the initial readiness signal before HPA considers their metrics valid.
   -->

   其設計目的是：

   - 避免包含在啓動期間快速在 `Ready` 和 `Unready` 之間波動的 Pod。
   - 確保在 HPA 認爲它們的指標有效之前，初始就緒信號的穩定性。

<!--
You can only set these command line options cluster-wide.

### Key behaviors for pod readiness {#pod-readiness-key-behaviors}

- If a Pod is `Ready` and remains `Ready`, it can be counted as contributing metrics even within the delay.
- If a Pod rapidly toggles between `Ready` and `Unready`, metrics are ignored until it’s considered stably `Ready`.
-->
你可以在叢集範圍設置這些命令列選項。

### Pod 就緒的關鍵行爲  {#pod-readiness-key-behaviors}

- 如果一個 Pod 是 `Ready` 狀態並且保持 `Ready`，即使在延遲期間，
  它也可以被視爲貢獻指標。
- 如果一個 Pod 在 `Ready` 和 `Unready` 之間快速切換，那麼它的指標將被忽略，
  直到它被認爲穩定在 `Ready` 狀態。

<!--
### Good practice for pod readiness {#pod-readiness-good-practices}

- Configure a `startupProbe` that doesn't pass until the high CPU usage has passed, or
- Ensure your `readinessProbe` only reports `Ready` **after** the CPU spike subsides, using `initialDelaySeconds`.

And ideally also set `--horizontal-pod-autoscaler-cpu-initialization-period` to **cover the startup duration**.
-->
### Pod 就緒的良好實踐  {#pod-readiness-good-practices}

- 設定 `startupProbe`，使其在高 CPU 使用率結束之前不會傳遞，或
- 使用 `initialDelaySeconds`，確保你的 `readinessProbe` **在 CPU 峯值過後**才報告爲 `Ready`。

理想情況下，還應設置 `--horizontal-pod-autoscaler-cpu-initialization-period`，以**覆蓋啓動持續時間**。

<!--
## API object

The HorizontalPodAutoscaler is an API kind in the Kubernetes
`autoscaling` API group. The current stable version can be found in
the `autoscaling/v2` API version which includes support for scaling on
memory and custom metrics. The new fields introduced in
`autoscaling/v2` are preserved as annotations when working with
`autoscaling/v1`.
-->
## API 對象   {#api-object}

HorizontalPodAutoscaler 是 Kubernetes `autoscaling` API 組中的一個 API 類別。
當前的穩定版本可以在 `autoscaling/v2` API 版本中找到，其中包括對基於內存和自定義指標執行擴縮的支持。
在使用 `autoscaling/v1` 時，`autoscaling/v2` 中引入的新字段作爲註釋保留。

<!--
When you create a HorizontalPodAutoscaler API object, make sure the name specified is a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
More details about the API object can be found at
[HorizontalPodAutoscaler Object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#horizontalpodautoscaler-v2-autoscaling).
-->
創建 HorizontalPodAutoscaler 對象時，需要確保所給的名稱是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
有關 API 對象的更多信息，請查閱
[HorizontalPodAutoscaler 對象文檔](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#horizontalpodautoscaler-v2-autoscaling)。

<!--
## Stability of workload scale {#flapping}

When managing the scale of a group of replicas using the HorizontalPodAutoscaler,
it is possible that the number of replicas keeps fluctuating frequently due to the
dynamic nature of the metrics evaluated. This is sometimes referred to as _thrashing_,
or _flapping_. It's similar to the concept of _hysteresis_ in cybernetics.
-->
## 工作量規模的穩定性 {#flapping}

在使用 HorizontalPodAutoscaler 管理一組副本的規模時，由於評估的指標的動態特性，
副本的數量可能會經常波動。這有時被稱爲 **抖動（thrashing）** 或 **波動（flapping）**。
它類似於控制論中的 **滯後（hysteresis）** 概念。

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

Kubernetes 允許你在 Deployment 上執行滾動更新。在這種情況下，Deployment 爲你管理下層的 ReplicaSet。
當你爲一個 Deployment 設定自動擴縮時，你要爲每個 Deployment 綁定一個 HorizontalPodAutoscaler。
HorizontalPodAutoscaler 管理 Deployment 的 `replicas` 字段。
Deployment Controller 負責設置下層 ReplicaSet 的 `replicas` 字段，
以便確保在上線及後續過程副本個數合適。

<!--
If you perform a rolling update of a StatefulSet that has an autoscaled number of
replicas, the StatefulSet directly manages its set of Pods (there is no intermediate resource
similar to ReplicaSet).
-->
如果你對一個副本個數被自動擴縮的 StatefulSet 執行滾動更新，該 StatefulSet
會直接管理它的 Pod 集合（不存在類似 ReplicaSet 這樣的中間資源）。

<!--
## Support for resource metrics

Any HPA target can be scaled based on the resource usage of the pods in the scaling target.
When defining the pod specification the resource requests like `cpu` and `memory` should
be specified. This is used to determine the resource utilization and used by the HPA controller
to scale the target up or down. To use resource utilization based scaling specify a metric source
like this:
-->
## 對資源指標的支持   {#support-for-resource-metrics}

HPA 的任何目標資源都可以基於其中的 Pod 的資源用量來實現擴縮。
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
基於這一指標設定，HPA 控制器會維持擴縮目標中的 Pod 的平均資源利用率在 60%。
利用率是 Pod 的當前資源用量與其請求值之間的比值。
關於如何計算利用率以及如何計算平均值的細節可參考[算法](#algorithm-details)小節。

{{< note >}}
<!--
Since the resource usages of all the containers are summed up the total pod utilization may not
accurately represent the individual container resource usage. This could lead to situations where
a single container might be running with high usage and the HPA will not scale out because the overall
pod usage is still within acceptable limits.
-->
由於所有的容器的資源用量都會被累加起來，Pod 的總體資源用量值可能不會精確體現各個容器的資源用量。
這一現象也會導致一些問題，例如某個容器運行時的資源用量非常高，但因爲 Pod
層面的資源用量總值讓人在可接受的約束範圍內，HPA 不會執行擴大目標對象規模的操作。
{{< /note >}}

<!--
### Container resource metrics
-->
### 容器資源指標   {#container-resource-metrics}

{{< feature-state feature_gate_name="HPAContainerMetrics" >}}

<!--
The HorizontalPodAutoscaler API also supports a container metric source where the HPA can track the
resource usage of individual containers across a set of Pods, in order to scale the target resource.
This lets you configure scaling thresholds for the containers that matter most in a particular Pod.
For example, if you have a web application and a sidecar container that provides logging, you can scale based on the resource
use of the web application, ignoring the sidecar container and its resource use.
-->
HorizontalPodAutoscaler API 也支持容器指標源，這時 HPA 可以跟蹤記錄一組 Pod
中各個容器的資源用量，進而觸發擴縮目標對象的操作。
容器資源指標的支持使得你可以爲特定 Pod 中最重要的容器設定規模擴縮閾值。
例如，如果你有一個 Web 應用和一個提供記錄日誌功能的邊車容器，你可以基於 Web
應用的資源用量來執行擴縮，忽略邊車容器的存在及其資源用量。

<!--
If you revise the target resource to have a new Pod specification with a different set of containers,
you should revise the HPA spec if that newly added container should also be used for
scaling. If the specified container in the metric source is not present or only present in a subset
of the pods then those pods are ignored and the recommendation is recalculated. See [Algorithm](#algorithm-details)
for more details about the calculation. To use container resources for autoscaling define a metric
source as follows:
-->
如果你更改擴縮目標對象，令其使用新的、包含一組不同的容器的 Pod 規約，你就需要修改
HPA 的規約才能基於新添加的容器來執行規模擴縮操作。
如果指標源中指定的容器不存在或者僅存在於部分 Pod 中，那麼這些 Pod 會被忽略，
HPA 會重新計算資源用量值。參閱[算法](#algorithm-details)小節進一步瞭解計算細節。
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
在上面的例子中，HPA 控制器會對目標對象執行擴縮操作以確保所有 Pod 中
`application` 容器的平均 CPU 用量爲 60%。

{{< note >}}
<!--
If you change the name of a container that a HorizontalPodAutoscaler is tracking, you can
make that change in a specific order to ensure scaling remains available and effective
whilst the change is being applied. Before you update the resource that defines the container
(such as a Deployment), you should update the associated HPA to track both the new and
old container names. This way, the HPA is able to calculate a scaling recommendation
throughout the update process.
-->
如果你要更改 HorizontalPodAutoscaler 所跟蹤記錄的容器的名稱，你可以按一定順序來執行這一更改，
確保在應用更改的過程中用來判定擴縮行爲的容器可用。
在更新定義容器的資源（如 Deployment）之前，你需要更新相關的 HPA，
使之能夠同時跟蹤記錄新的和老的容器名稱。這樣，HPA 就能夠在整個更新過程中繼續計算並提供擴縮操作建議。

<!--
Once you have rolled out the container name change to the workload resource, tidy up by removing
the old container name from the HPA specification.
-->
一旦你已經將容器名稱變更這一操作應用到整個負載對象至上，就可以從 HPA
的規約中去掉老的容器名稱，完成清理操作。
{{< /note >}}

<!--
## Scaling on custom metrics
-->
## 擴展自定義指標 {#scaling-on-custom-metrics}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
(the `autoscaling/v2beta2` API version previously provided this ability as a beta feature)

Provided that you use the `autoscaling/v2` API version, you can configure a HorizontalPodAutoscaler
to scale based on a custom metric (that is not built in to Kubernetes or any Kubernetes component).
The HorizontalPodAutoscaler controller then queries for these custom metrics from the Kubernetes
API.

See [Support for metrics APIs](#support-for-metrics-apis) for the requirements.
-->
（之前的 `autoscaling/v2beta2` API 版本將此功能作爲 Beta 功能提供）

如果你使用 `autoscaling/v2` API 版本，則可以將 HorizontalPodAutoscaler
設定爲基於自定義指標（未內置於 Kubernetes 或任何 Kubernetes 組件）進行擴縮。
HorizontalPodAutoscaler 控制器能夠從 Kubernetes API 查詢這些自定義指標。

有關要求，請參閱對 [Metrics API 的支持](#support-for-metrics-apis)。

<!--
## Scaling on multiple metrics
-->
## 基於多個指標來執行擴縮 {#scaling-on-multiple-metrics}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
(the `autoscaling/v2beta2` API version previously provided this ability as a beta feature)

Provided that you use the `autoscaling/v2` API version, you can specify multiple metrics for a
HorizontalPodAutoscaler to scale on. Then, the HorizontalPodAutoscaler controller evaluates each metric,
and proposes a new scale based on that metric. The HorizontalPodAutoscaler takes the maximum scale
recommended for each metric and sets the workload to that size (provided that this isn't larger than the
overall maximum that you configured).
-->
（之前的 `autoscaling/v2beta2` API 版本將此功能作爲 Beta 功能提供）

如果你使用 `autoscaling/v2` API 版本，你可以爲 HorizontalPodAutoscaler 指定多個指標以進行擴縮。
HorizontalPodAutoscaler 控制器評估每個指標，並根據該指標提出一個新的比例。
HorizontalPodAutoscaler 採用爲每個指標推薦的最大比例，
並將工作負載設置爲該大小（前提是這不大於你設定的總體最大值）。

<!--
## Support for metrics APIs

By default, the HorizontalPodAutoscaler controller retrieves metrics from a series of APIs.
In order for it to access these APIs, cluster administrators must ensure that:
-->
## 對 Metrics API 的支持   {#support-for-metrics-apis}

默認情況下，HorizontalPodAutoscaler 控制器會從一系列的 API 中檢索度量值。
叢集管理員需要確保下述條件，以保證 HPA 控制器能夠訪問這些 API：

<!--
* The [API aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) is enabled.

* The corresponding APIs are registered:

   * For resource metrics, this is the `metrics.k8s.io` [API](/docs/reference/external-api/metrics.v1beta1/),
     generally provided by [metrics-server](https://github.com/kubernetes-sigs/metrics-server).
     It can be launched as a cluster add-on.

   * For custom metrics, this is the `custom.metrics.k8s.io` [API](/docs/reference/external-api/metrics.v1beta1/).
     It's provided by "adapter" API servers provided by metrics solution vendors.
     Check with your metrics pipeline to see if there is a Kubernetes metrics adapter available.

   * For external metrics, this is the `external.metrics.k8s.io` [API](/docs/reference/external-api/metrics.v1beta1/).
     It may be provided by the custom metrics adapters provided above.
-->
* 啓用了 [API 聚合層](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

* 相應的 API 已註冊：

  * 對於資源指標，將使用 `metrics.k8s.io` [API](/zh-cn/docs/reference/external-api/metrics.v1beta1/)，
    一般由 [metrics-server](https://github.com/kubernetes-incubator/metrics-server) 提供。
    它可以作爲叢集插件啓動。

  * 對於自定義指標，將使用 `custom.metrics.k8s.io` [API](/zh-cn/docs/reference/external-api/metrics.v1beta1/)。
    它由其他度量指標方案廠商的“適配器（Adapter）” API 伺服器提供。
    檢查你的指標管道以查看是否有可用的 Kubernetes 指標適配器。

  * 對於外部指標，將使用 `external.metrics.k8s.io` [API](/zh-cn/docs/reference/external-api/metrics.v1beta1/)。
    可能由上面的自定義指標適配器提供。

<!--
For more information on these different metrics paths and how they differ please see the relevant design proposals for
[the HPA V2](https://git.k8s.io/design-proposals-archive/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://git.k8s.io/design-proposals-archive/instrumentation/custom-metrics-api.md)
and [external.metrics.k8s.io](https://git.k8s.io/design-proposals-archive/instrumentation/external-metrics-api.md).
-->
關於指標來源以及其區別的更多信息，請參閱相關的設計文檔，
[HPA V2](https://git.k8s.io/design-proposals-archive/autoscaling/hpa-v2.md)，
[custom.metrics.k8s.io](https://git.k8s.io/design-proposals-archive/instrumentation/custom-metrics-api.md) 和
[external.metrics.k8s.io](https://git.k8s.io/design-proposals-archive/instrumentation/external-metrics-api.md)。

<!--
For examples of how to use them see
[the walkthrough for using custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
and [the walkthrough for using external metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects).
-->
關於如何使用它們的示例，
請參考[使用自定義指標的教程](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
和[使用外部指標的教程](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects)。

<!--
## Configurable scaling behavior
-->
## 可設定的擴縮行爲 {#configurable-scaling-behavior}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
(the `autoscaling/v2beta2` API version previously provided this ability as a beta feature)

If you use the `v2` HorizontalPodAutoscaler API, you can use the `behavior` field
(see the [API reference](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerSpec))
to configure separate scale-up and scale-down behaviors.
You specify these behaviors by setting `scaleUp` and / or `scaleDown`
under the `behavior` field.
-->
（之前的 `autoscaling/v2beta2` API 版本將此功能作爲 Beta 功能提供）

如果你使用 `v2` HorizontalPodAutoscaler API，你可以使用 `behavior` 字段
（請參閱 [API 參考](/zh-cn/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerSpec)）
來設定單獨的放大和縮小行爲。你可以通過在行爲字段下設置 `scaleUp` 和/或 `scaleDown` 來指定這些行爲。

<!--
Scaling policies let you control the rate of change of replicas while scaling.
Also two settings can be used to prevent [flapping](#flapping): you can specify a
_stabilization window_ for smoothing replica counts, and a tolerance to ignore
minor metric fluctuations below a specified threshold.
-->
擴縮策略允許你在擴縮容時控制副本數量變化的速率。
此外，還可以通過兩個設置來防止頻繁[波動](#flapping)：
你可以指定一個“穩定窗口“來平滑副本數量的變化，
也可以設置一個容差值，用於忽略低於指定閾值的小幅指標波動。

<!--
### Scaling policies

One or more scaling policies can be specified in the `behavior` section of the spec.
When multiple policies are specified the policy which allows the highest amount of
change is the policy which is selected by default. The following example shows this behavior
while scaling down:
-->
### 擴縮策略 {#scaling-policies}

可以在規約的 `behavior` 部分中指定一個或多個擴縮策略。當指定多個策略時，
允許最大更改量的策略是默認選擇的策略。以下示例顯示了縮小時的這種行爲：

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
The maximum value that you can set for `periodSeconds` is 1800 (half an hour).
The first policy _(Pods)_ allows at most 4 replicas to be scaled down in one minute. The second policy
_(Percent)_ allows at most 10% of the current replicas to be scaled down in one minute.
-->
`periodSeconds` 表示在過去的多長時間內要求策略值爲真。
你可以設置 `periodSeconds` 的最大值爲 1800（半小時）。
第一個策略（Pods）允許在一分鐘內最多縮容 4 個副本。第二個策略（Percent）
允許在一分鐘內最多縮容當前副本個數的百分之十。

<!--
Since by default the policy which allows the highest amount of change is selected, the second policy will
only be used when the number of pod replicas is more than 40. With 40 or less replicas, the first policy will be applied.
For instance if there are 80 replicas and the target has to be scaled down to 10 replicas
then during the first step 8 replicas will be reduced. In the next iteration when the number
of replicas is 72, 10% of the pods is 7.2 but the number is rounded up to 8. On each loop of
the autoscaler controller the number of pods to be change is re-calculated based on the number
of current replicas. When the number of replicas falls below 40 the first policy _(Pods)_ is applied
and 4 replicas will be reduced at a time.
-->
由於默認情況下會選擇容許更大程度作出變更的策略，只有 Pod 副本數大於 40 時，
第二個策略纔會被採用。如果副本數爲 40 或者更少，則應用第一個策略。
例如，如果有 80 個副本，並且目標必須縮小到 10 個副本，那麼在第一步中將減少 8 個副本。
在下一輪迭代中，當副本的數量爲 72 時，10% 的 Pod 數爲 7.2，但是這個數字向上取整爲 8。
在自動擴縮控制器的每個循環中，將根據當前副本的數量重新計算要更改的 Pod 數量。
當副本數量低於 40 時，應用第一個策略（Pods），一次減少 4 個副本。

<!--
The policy selection can be changed by specifying the `selectPolicy` field for a scaling
direction. By setting the value to `Min` which would select the policy which allows the
smallest change in the replica count. Setting the value to `Disabled` completely disables
scaling in that direction.
-->
可以指定擴縮方向的 `selectPolicy` 字段來更改策略選擇。
通過設置 `Min` 的值，它將選擇副本數變化最小的策略。
將該值設置爲 `Disabled` 將完全禁用該方向的擴縮。

<!--
### Stabilization window

The stabilization window is used to restrict the [flapping](#flapping) of
replica count when the metrics used for scaling keep fluctuating. The autoscaling algorithm
uses this window to infer a previous desired state and avoid unwanted changes to workload
scale.

For example, in the following example snippet, a stabilization window is specified for `scaleDown`.
-->
### 穩定窗口 {#stabilization-window}

當用於擴縮的指標不斷波動時，穩定窗口用於限制副本計數的[波動](#flapping)。
自動擴縮算法使用此窗口來推斷先前的期望狀態並避免對工作負載規模進行不必要的更改。

例如，在以下示例代碼段中，爲 `scaleDown` 指定了穩定窗口。

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
當指標顯示目標應該縮容時，自動擴縮算法查看之前計算的期望狀態，並使用指定時間間隔內的最大值。
在上面的例子中，過去 5 分鐘的所有期望狀態都會被考慮。

<!--
This approximates a rolling maximum, and avoids having the scaling algorithm frequently
remove Pods only to trigger recreating an equivalent Pod just moments later.
-->
這近似於滾動最大值，並避免了擴縮算法頻繁刪除 Pod 而又觸發重新創建等效 Pod。

<!--
### Tolerance {#tolerance}
-->
### 容忍閾值 {#tolerance}

{{< feature-state feature_gate_name="HPAConfigurableTolerance" >}}

<!--
The `tolerance` field configures a threshold for metric variations, preventing the
autoscaler from scaling for changes below that value.

This tolerance is defined as the amount of variation around the desired metric value under
which no scaling will occur. For example, consider a HorizontalPodAutoscaler configured
with a target memory consumption of 100MiB and a scale-up tolerance of 5%:
-->
`tolerance` 字段用於設定指標波動的閾值，避免自動擴縮器因小幅變化而觸發擴縮容操作。

該容忍閾值指的是在期望指標值附近的一個波動範圍，在這個範圍內不會觸發擴縮容操作。
例如，假設 HorizontalPodAutoscaler 設定了目標內存使用量爲 100MiB，並設置了 5% 的擴容容忍閾值：

<!--
```yaml
behavior:
  scaleUp:
    tolerance: 0.05 # 5% tolerance for scale up
```
-->
```yaml
behavior:
  scaleUp:
    tolerance: 0.05 # 5% 容忍度用於擴容
```

<!--
With this configuration, the HPA algorithm will only consider scaling up if the memory
consumption is higher than 105MiB (that is: 5% above the target).

If you don't set this field, the HPA applies the default cluster-wide tolerance of 10%. This
default can be updated for both scale-up and scale-down using the
[kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
`--horizontal-pod-autoscaler-tolerance` command line argument. (You can't use the Kubernetes API
to configure this default value.)
-->
在這種設定下，只有當內存使用量超過 105MiB（即比目標值高出 5%）時，HPA 算法纔會考慮進行擴容。

如果你未設置該字段，HPA 將使用叢集範圍內默認的 10% 容忍閾值。你可以通過
[kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
的 `--horizontal-pod-autoscaler-tolerance` 命令列參數，分別調整擴容和縮容的默認容忍閾值。
（注意，無法通過 Kubernetes API 來設定這個默認值。）

<!--
### Default behavior

To use the custom scaling not all fields have to be specified. Only values which need to be
customized can be specified. These custom values are merged with default values. The default values
match the existing behavior in the HPA algorithm.
-->
### 默認行爲 {#default-behavior}

要使用自定義擴縮，不必指定所有字段。只有需要自定義的字段才需要指定。
這些自定義值與默認值合併。默認值與 HPA 算法中的現有行爲匹配。

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
`--horizontal-pod-autoscaler-downscale-stabilization` command line option, if provided). There is only a single policy
for scaling down which allows a 100% of the currently running replicas to be removed which
means the scaling target can be scaled down to the minimum allowed replicas.
For scaling up there is no stabilization window. When the metrics indicate that the target should be
scaled up the target is scaled up immediately. There are 2 policies where 4 pods or a 100% of the currently
running replicas may at most be added every 15 seconds till the HPA reaches its steady state.
-->
用於縮小穩定窗口的時間爲 **300**
秒（或是 `--horizontal-pod-autoscaler-downscale-stabilization` 命令列選項設定值）。
只有一種縮容的策略，允許 100% 刪除當前運行的副本，這意味着擴縮目標可以縮小到允許的最小副本數。
對於擴容，沒有穩定窗口。當指標顯示目標應該擴容時，目標會立即擴容。
這裏有兩種策略，每 15 秒最多添加 4 個 Pod 或 100% 當前運行的副本數，直到 HPA 達到穩定狀態。

<!--
### Example: change downscale stabilization window

To provide a custom downscale stabilization window of 1 minute, the following
behavior would be added to the HPA:
-->
### 示例：更改縮容穩定窗口 {#example-change-downscale-stabilization-window}

將下面的 behavior 設定添加到 HPA 中，可提供一個 1 分鐘的自定義縮容穩定窗口：

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

將下面的 behavior 設定添加到 HPA 中，可限制 Pod 被 HPA 刪除速率爲每分鐘 10%：

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
爲了確保每分鐘刪除的 Pod 數不超過 5 個，可以添加第二個縮容策略，大小固定爲 5，並將 `selectPolicy` 設置爲最小值。
將 `selectPolicy` 設置爲 `Min` 意味着自動擴縮器會選擇影響 Pod 數量最小的策略：

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
## kubectl 對 HorizontalPodAutoscaler 的支持 {#support-for-horizontalpodautoscaler-in-kubectl}

與每個 API 資源一樣，HorizontalPodAutoscaler 都被 `kubectl` 以標準方式支持。
你可以使用 `kubectl create` 命令創建一個新的自動擴縮器。
你可以通過 `kubectl get hpa` 列出自動擴縮器或通過 `kubectl describe hpa` 獲取詳細描述。
最後，你可以使用 `kubectl delete hpa` 刪除自動擴縮器。

<!--
In addition, there is a special `kubectl autoscale` command for creating a HorizontalPodAutoscaler object.
For instance, executing `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for ReplicaSet _foo_, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
-->
此外，還有一個特殊的 `kubectl autoscale` 命令用於創建 HorizontalPodAutoscaler 對象。
例如，執行 `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`
將爲 ReplicaSet **foo** 創建一個自動擴縮器，目標 CPU 利用率設置爲 `80%`，副本數在 2 到 5 之間。

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

你可以在不必更改 HPA 設定的情況下隱式地爲某個目標禁用 HPA。
如果此目標的期望副本個數被設置爲 0，而 HPA 的最小副本個數大於 0，
則 HPA 會停止調整目標（並將其自身的 `ScalingActive` 狀況設置爲 `false`），
直到你通過手動調整目標的期望副本個數或 HPA 的最小副本個數來重新激活。

<!--
### Migrating Deployments and StatefulSets to horizontal autoscaling

When an HPA is enabled, it is recommended that the value of `spec.replicas` of
the Deployment and / or StatefulSet be removed from their
{{< glossary_tooltip text="manifest(s)" term_id="manifest" >}}. If this isn't done, any time
a change to that object is applied, for example via `kubectl apply -f
deployment.yaml`, this will instruct Kubernetes to scale the current number of Pods
to the value of the `spec.replicas` key. This may not be
desired and could be troublesome when an HPA is active, resulting in thrashing or flapping behavior.
-->
### 將 Deployment 和 StatefulSet 遷移到水平自動擴縮 {#migrating-deployments-and-statefulsets-to-horizontal-autoscaling}

當啓用 HPA 時，建議從它們的{{< glossary_tooltip text="清單" term_id="manifest" >}}中刪除
Deployment 和/或 StatefulSet 的 `spec.replicas` 的值。
如果不這樣做，則只要應用對該對象的更改，例如通過 `kubectl apply -f deployment.yaml`，
這將指示 Kubernetes 將當前 Pod 數量擴縮到 `spec.replicas` 鍵的值。這可能不是所希望的，
並且當 HPA 處於活動狀態時，可能會導致波動或反覆變化的行爲，進而帶來麻煩。

<!--
Keep in mind that the removal of `spec.replicas` may incur a one-time
degradation of Pod counts as the default value of this key is 1 (reference
[Deployment Replicas](/docs/concepts/workloads/controllers/deployment#replicas)).
Upon the update, all Pods except 1 will begin their termination procedures. Any
deployment application afterwards will behave as normal and respect a rolling
update configuration as desired. You can avoid this degradation by choosing one of the following two
methods based on how you are modifying your deployments:
-->
請記住，刪除 `spec.replicas` 可能會導致 Pod 計數一次性降級，因爲此鍵的默認值爲 1
（參考 [Deployment 副本](/zh-cn/docs/concepts/workloads/controllers/deployment#replicas)）。
更新後，除 1 之外的所有 Pod 都將開始其終止程序。之後的任何部署應用程序都將正常運行，
並根據需要遵守滾動更新設定。你可以根據修改部署的方式選擇以下兩種方法之一來避免這種降級：

{{< tabs name="fix_replicas_instructions" >}}
{{% tab name="客戶端 apply 操作（默認行爲）" %}}

<!--
1. `kubectl apply edit-last-applied deployment/<deployment_name>`
2. In the editor, remove `spec.replicas`. When you save and exit the editor, `kubectl`
   applies the update. No changes to Pod counts happen at this step.
3. You can now remove `spec.replicas` from the manifest. If you use source code management,
   also commit your changes or take whatever other steps for revising the source code
   are appropriate for how you track updates.
4. From here on out you can run `kubectl apply -f deployment.yaml`
-->
1. `kubectl apply edit-last-applied deployment/<Deployment 名稱>`
2. 在編輯器中，刪除 `spec.replicas`。當你保存並退出編輯器時，`kubectl` 會應用更新。
   在此步驟中不會更改 Pod 計數。
3. 你現在可以從清單中刪除 `spec.replicas`。如果你使用源代碼管理，
   還應提交你的更改或採取任何其他步驟來修改源代碼，以適應你如何跟蹤更新。
4. 從這裏開始，你可以運行 `kubectl apply -f deployment.yaml`

{{% /tab %}}
{{% tab name="伺服器端 apply 操作" %}}

<!--
When using the [Server-Side Apply](/docs/reference/using-api/server-side-apply/)
you can follow the [transferring ownership](/docs/reference/using-api/server-side-apply/#transferring-ownership)
guidelines, which cover this exact use case.
-->
使用[伺服器端 Apply](/zh-cn/docs/reference/using-api/server-side-apply/) 機制，
你可以遵循[交出所有權](/zh-cn/docs/reference/using-api/server-side-apply/#transferring-ownership)說明，
該指南涵蓋了這個確切的用例。

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
If you configure autoscaling in your cluster, you may also want to consider using
[node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)
to ensure you are running the right number of nodes.

For more information on HorizontalPodAutoscaler:
-->
如果你在叢集中設定自動擴縮，
你可能還需要考慮使用[節點自動擴縮](/doc/concepts/cluster-administration/node-autoscaling/)來確保所運行的節點數目合適。

有關 HorizontalPodAutoscaler 的更多信息：

<!--
* Read a [walkthrough example](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) for horizontal pod autoscaling.
* Read documentation for [`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* If you would like to write your own custom metrics adapter, check out the
  [boilerplate](https://github.com/kubernetes-sigs/custom-metrics-apiserver) to get started.
* Read the [API reference](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/) for HorizontalPodAutoscaler.
-->
* 閱讀水平 Pod 自動擴縮的[演練示例](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)。
* 閱讀 [`kubectl autoscale`](/zh-cn/docs/reference/generated/kubectl/kubectl-commands/#autoscale) 的文檔。
* 如果你想編寫自己的自定義指標適配器，
  請查看 [boilerplate](https://github.com/kubernetes-sigs/custom-metrics-apiserver) 以開始使用。
* 閱讀 [API 參考](/zh-cn/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/)。
