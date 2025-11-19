---
api_metadata:
  apiVersion: "autoscaling/v2"
  import: "k8s.io/api/autoscaling/v2"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "HorizontalPodAutoscaler 是水平 Pod 自動擴縮器的配置，它根據指定的指標自動管理實現 scale 子資源的任何資源的副本數。"
title: "HorizontalPodAutoscaler"
weight: 13
---
<!--
api_metadata:
  apiVersion: "autoscaling/v2"
  import: "k8s.io/api/autoscaling/v2"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "HorizontalPodAutoscaler is the configuration for a horizontal pod autoscaler, which automatically manages the replica count of any resource implementing the scale subresource based on the metrics specified."
title: "HorizontalPodAutoscaler"
weight: 13
auto_generated: true
-->

`apiVersion: autoscaling/v2`

`import "k8s.io/api/autoscaling/v2"`


## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

<!--
HorizontalPodAutoscaler is the configuration for a horizontal pod autoscaler, which automatically manages the replica count of any resource implementing the scale subresource based on the metrics specified.
-->
HorizontalPodAutoscaler 是水平 Pod 自動擴縮器的配置，
它根據指定的指標自動管理實現 scale 子資源的任何資源的副本數。

<hr>

- **apiVersion**: autoscaling/v2

- **kind**: HorizontalPodAutoscaler

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  metadata is the standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->

  metadata 是標準的對象元數據。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a>)

  <!--
  spec is the specification for the behaviour of the autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.
  -->

  spec 是自動擴縮器行爲的規約。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.

- **status** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a>)

  <!--
  status is the current information about the autoscaler.
  -->

  status 是自動擴縮器的當前信息。

## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

<!--
HorizontalPodAutoscalerSpec describes the desired functionality of the HorizontalPodAutoscaler.
-->
HorizontalPodAutoscalerSpec 描述了 HorizontalPodAutoscaler 預期的功能。

<hr>

<!--
- **maxReplicas** (int32), required

  maxReplicas is the upper limit for the number of replicas to which the autoscaler can scale up. It cannot be less that minReplicas.
-->

- **maxReplicas** (int32)，必需

  maxReplicas 是自動擴縮器可以擴容的副本數的上限。不能小於 minReplicas。

<!--
- **scaleTargetRef** (CrossVersionObjectReference), required

  scaleTargetRef points to the target resource to scale, and is used to the pods for which metrics should be collected, as well as to actually change the replica count.
-->

- **scaleTargetRef** (CrossVersionObjectReference)，必需

  scaleTargetRef 指向要擴縮的目標資源，用於收集 Pod 的相關指標信息以及實際更改的副本數。

  <a name="CrossVersionObjectReference"></a>

  <!--
  *CrossVersionObjectReference contains enough information to let you identify the referred resource.*

  - **scaleTargetRef.kind** (string), required

    kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  **CrossVersionObjectReference 包含足夠的信息來讓你識別出所引用的資源。**

  - **scaleTargetRef.kind** (string)，必需

    `kind` 是被引用對象的類別；更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  <!--
  - **scaleTargetRef.name** (string), required

    name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
  -->

  - **scaleTargetRef.name** (string)，必需

    `name` 是被引用對象的名稱；更多信息：https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

  <!--
  - **scaleTargetRef.apiVersion** (string)

    apiVersion is the API version of the referent

  -->

  - **scaleTargetRef.apiVersion** (string)

    `apiVersion` 是被引用對象的 API 版本。

<!--
- **minReplicas** (int32)

  minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down.  It defaults to 1 pod.  minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured.  Scaling is active as long as at least one metric value is available.
-->

- **minReplicas** (int32)

  minReplicas 是自動擴縮器可以縮減的副本數的下限。它默認爲 1 個 Pod。
  如果啓用了 Alpha 特性門控 HPAScaleToZero 並且配置了至少一個 Object 或 External 度量指標，
  則 minReplicas 允許爲 0。只要至少有一個度量值可用，擴縮就處於活動狀態。

<!--
- **behavior** (HorizontalPodAutoscalerBehavior)

  behavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively). If not set, the default HPAScalingRules for scale up and scale down are used.
-->

- **behavior** (HorizontalPodAutoscalerBehavior)

  behavior 配置目標在擴容（Up）和縮容（Down）兩個方向的擴縮行爲（分別用 scaleUp 和 scaleDown 字段）。
  如果未設置，則會使用默認的 HPAScalingRules 進行擴縮容。

  <a name="HorizontalPodAutoscalerBehavior"></a>

  <!--
  *HorizontalPodAutoscalerBehavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively).*

  - **behavior.scaleDown** (HPAScalingRules)

    scaleDown is scaling policy for scaling Down. If not set, the default value is to allow to scale down to minReplicas pods, with a 300 second stabilization window (i.e., the highest recommendation for the last 300sec is used).
  -->

  **HorizontalPodAutoscalerBehavior 配置目標在擴容（Up）和縮容（Down）兩個方向的擴縮行爲
  （分別用 scaleUp 和 scaleDown 字段）。**

  - **behavior.scaleDown** (HPAScalingRules)

    scaleDown 是縮容策略。如果未設置，則默認值允許縮減到 minReplicas 數量的 Pod，
    具有 300 秒的穩定窗口（使用最近 300 秒的最高推薦值）。

    <a name="HPAScalingRules"></a>

    <!--
    *HPAScalingRules configures the scaling behavior for one direction via scaling Policy Rules and a configurable metric tolerance.

    Scaling Policy Rules are applied after calculating DesiredReplicas from metrics for the HPA. They can limit the scaling velocity by specifying scaling policies. They can prevent flapping by specifying the stabilization window, so that the number of replicas is not set instantly, instead, the safest value from the stabilization window is chosen.
    -->
  
    **HPAScalingRules** 配置一個方向上的擴縮行爲，通過擴縮策略規則和可配置的對度量值的容差。

    擴縮策略規則在根據 HPA 的度量值計算出期望的副本數後應用。它們可以通過指定擴縮策略來限制擴縮速度。
    它們可以通過指定穩定窗口防止波動，這樣不會立即設置副本數量，而是從穩定窗口中選擇最安全的值。
    
    <!--
    The tolerance is applied to the metric values and prevents scaling too eagerly for small metric variations. (Note that setting a tolerance requires enabling the alpha HPAConfigurableTolerance feature gate.)*
    -->

    容忍度應用於度量值，防止因度量的微小變化而過於急切地擴縮。
   （注意，設置容忍度需要啓用 Alpha **特性門控** HPAConfigurableTolerance。）
  
    - **behavior.scaleDown.policies** ([]HPAScalingPolicy)

      *Atomic: will be replaced during a merge*

      policies is a list of potential scaling polices which can be used during scaling. If not set, use the default values: - For scale up: allow doubling the number of pods, or an absolute change of 4 pods in a 15s window. - For scale down: allow all pods to be removed in a 15s window.
    -->

    HPAScalingRules 爲一個方向配置擴縮行爲。在根據 HPA 的指標計算 desiredReplicas 後應用這些規則。
    可以通過指定擴縮策略來限制擴縮速度。可以通過指定穩定窗口來防止抖動，
    因此不會立即設置副本數，而是選擇穩定窗口中最安全的值。

    - **behavior.scaleDown.policies** ([]HPAScalingPolicy)

      **原子性：將在合併時被替換**

      policies 是可在擴縮容過程中使用的潛在擴縮策略的列表。
      如果未設置，使用默認值：
      - 對於擴容：允許將 Pod 數量翻倍，或在 15 秒窗口內絕對增加 4 個 Pod。
      - 對於縮容：允許在 15 秒窗口內移除所有 Pod。

      <a name="HPAScalingPolicy"></a>

      <!--
      *HPAScalingPolicy is a single policy which must hold true for a specified past interval.*

      - **behavior.scaleDown.policies.type** (string), required

        type is used to specify the scaling policy.
      -->

      **HPAScalingPolicy 是一個單一的策略，它必須在指定的過去時間間隔內保持爲 true。**

      - **behavior.scaleDown.policies.type** (string)，必需

        type 用於指定擴縮策略。

      <!--
      - **behavior.scaleDown.policies.value** (int32), required

        value contains the amount of change which is permitted by the policy. It must be greater than zero
      -->

      - **behavior.scaleDown.policies.value** (int32)，必需

        value 包含策略允許的更改量。它必須大於零。

      <!--
      - **behavior.scaleDown.policies.periodSeconds** (int32), required

        periodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min).
      -->

      - **behavior.scaleDown.policies.periodSeconds** (int32)，必需

        periodSeconds 表示策略應該保持爲 true 的時間窗口長度。
        periodSeconds 必須大於零且小於或等於 1800（30 分鐘）。

    <!--
    - **behavior.scaleDown.selectPolicy** (string)

      selectPolicy is used to specify which policy should be used. If not set, the default value Max is used.
    -->

    - **behavior.scaleDown.selectPolicy** (string)

      selectPolicy 用於指定應該使用哪個策略。如果未設置，則使用默認值 Max。

    <!--
    - **behavior.scaleDown.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long).

    -->

    - **behavior.scaleDown.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds 是在擴縮容時應考慮的之前建議的秒數。stabilizationWindowSeconds
      必須大於或等於零且小於或等於 3600（一小時）。如果未設置，則使用默認值：

      - 擴容：0（不設置穩定窗口）。
      - 縮容：300（即穩定窗口爲 300 秒）。

    - **behavior.scaleDown.tolerance** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    <!--
    tolerance is the tolerance on the ratio between the current and desired metric value under which no updates are made to the desired number of replicas (e.g. 0.01 for 1%). Must be greater than or equal to zero. If not set, the default cluster-wide tolerance is applied (by default 10%).
    -->
  
    tolerance 是當前的度量值和期望的指標值之間比率的容差，在此容差範圍內，系統不會更新期望的副本數量
    （例如，0.01 爲 1%）。必須大於或等於零。如果未設置，則應用默認的集羣範圍容差
    （默認爲 10%）。
   
    <!--
    For example, if autoscaling is configured with a memory consumption target of 100Mi, and scale-down and scale-up tolerances of 5% and 1% respectively, scaling will be triggered when the actual consumption falls below 95Mi or exceeds 101Mi.
    -->

    例如，如果配置了以 100Mi 的內存消耗爲目標的自動擴縮容，
    並且擴縮容的容差分別爲 5% 和 1%，那麼當實際消耗低於 95Mi
    或超過 101Mi 時，將觸發擴縮容。

    <!--
    This is an alpha field and requires enabling the HPAConfigurableTolerance feature gate.
    -->

    這是一個 Alpha 字段，需要啓用 **HPAConfigurableTolerance** 特性門控。
  
  <!--
  - **behavior.scaleUp** (HPAScalingRules)

    scaleUp is scaling policy for scaling Up. If not set, the default value is the higher of:
      * increase no more than 4 pods per 60 seconds
      * double the number of pods per 60 seconds
    No stabilization is used.
  -->

  - **behavior.scaleUp** (HPAScalingRules)

    scaleUp 是用於擴容的擴縮策略。如果未設置，則默認值爲以下值中的較高者：

      * 每 60 秒增加不超過 4 個 Pod
      * 每 60 秒 Pod 數量翻倍

    不使用穩定窗口。

    <a name="HPAScalingRules"></a>

    <!--
    *HPAScalingRules configures the scaling behavior for one direction via scaling Policy Rules and a configurable metric tolerance.
    
    Scaling Policy Rules are applied after calculating DesiredReplicas from metrics for the HPA. They can limit the scaling velocity by specifying scaling policies. They can prevent flapping by specifying the stabilization window, so that the number of replicas is not set instantly, instead, the safest value from the stabilization window is chosen.
    -->
  
    **HPAScalingRules** 配置了一個方向上的擴縮行爲，通過擴縮策略規則和可配置的指標容忍度。

    擴縮策略規則在根據 HPA 的指標計算出期望的副本數後應用。它們可以通過指定擴縮策略來限制擴縮速度。
    它們可以通過指定穩定窗口防止波動，這樣不會立即設置副本數量，而是從穩定窗口中選擇最安全的值。

    <!--
    The tolerance is applied to the metric values and prevents scaling too eagerly for small metric variations. (Note that setting a tolerance requires enabling the alpha HPAConfigurableTolerance feature gate.)*
    -->
  
    容忍度應用於指標值，防止因小的指標變化而過於急切地擴縮。
    （注意，設置容忍度需要啓用 Alpha 特性門控 **HPAConfigurableTolerance**。）

    <!--
    - **behavior.scaleUp.policies** ([]HPAScalingPolicy)

      *Atomic: will be replaced during a merge*

      policies is a list of potential scaling polices which can be used during scaling. If not set, use the default values: - For scale up: allow doubling the number of pods, or an absolute change of 4 pods in a 15s window. - For scale down: allow all pods to be removed in a 15s window.
    -->

    - **behavior.scaleUp.policies** ([]HPAScalingPolicy)

      **原子性：將在合併時被替換**

      policies 是一個潛在的擴縮策略列表，可以在擴縮期間使用。如果未設置，則使用默認值：
      - 對於擴容：允許將 Pod 數量翻倍，或在 15 秒窗口內絕對增加 4 個 Pod。
      - 對於縮容：允許在 15 秒窗口內移除所有 Pod。

      <a name="HPAScalingPolicy"></a>

      <!--
      *HPAScalingPolicy is a single policy which must hold true for a specified past interval.*

      - **behavior.scaleUp.policies.type** (string), required

        type is used to specify the scaling policy.
      -->

      **HPAScalingPolicy 是一個單一的策略，它必須在指定的過去時間間隔內保持爲 true。**

      - **behavior.scaleUp.policies.type** (string)，必需

        type 用於指定擴縮策略。

      <!--
      - **behavior.scaleUp.policies.value** (int32), required

        value contains the amount of change which is permitted by the policy. It must be greater than zero
      -->
      - **behavior.scaleUp.policies.value** (int32)，必需

        value 包含策略允許的更改量。它必須大於零。

      <!--
      - **behavior.scaleUp.policies.periodSeconds** (int32), required

        periodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min).
      -->

      - **behavior.scaleUp.policies.periodSeconds** (int32)，必需

        periodSeconds 表示策略應該保持爲 true 的時間窗口長度。
        periodSeconds 必須大於零且小於或等於 1800（30 分鐘）。

    <!--
    - **behavior.scaleUp.selectPolicy** (string)

      selectPolicy is used to specify which policy should be used. If not set, the default value Max is used.
    -->

    - **behavior.scaleUp.selectPolicy** (string)

      selectPolicy 用於指定應該使用哪個策略。如果未設置，則使用默認值 Max。

    <!--
    - **behavior.scaleUp.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long).

    -->

    - **behavior.scaleUp.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds 是在擴縮容時應考慮的之前建議的秒數。stabilizationWindowSeconds
      必須大於或等於零且小於或等於 3600（一小時）。如果未設置，則使用默認值：

      - 擴容：0（不設置穩定窗口）。
      - 縮容：300（即穩定窗口爲 300 秒）。

    - **behavior.scaleUp.tolerance** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      <!--
      tolerance is the tolerance on the ratio between the current and desired metric value under which no updates are made to the desired number of replicas (e.g. 0.01 for 1%). Must be greater than or equal to zero. If not set, the default cluster-wide tolerance is applied (by default 10%).
      -->
  
      tolerance 是當前和期望的指標值之間比率的容差，
      在此容差下不會更新期望的副本數量（例如，1% 爲 0.01）。
      必須大於或等於零。如果未設置，則應用默認的集羣範圍容差（默認爲 10%）。
  
      <!--
      For example, if autoscaling is configured with a memory consumption target of 100Mi, and scale-down and scale-up tolerances of 5% and 1% respectively, scaling will be triggered when the actual consumption falls below 95Mi or exceeds 101Mi.
      -->
  
      例如，如果配置了以 100Mi 的內存消耗爲目標的自動擴縮容，
      並且擴縮容的容差分別爲 5% 和 1%，那麼當實際消耗低於 95Mi
      或超過 101Mi 時，將觸發擴縮容。

      <!--
      This is an alpha field and requires enabling the HPAConfigurableTolerance feature gate.
      -->
  
      這是一個 Alpha 字段，需要啓用 **HPAConfigurableTolerance** 特性門控。


<!--
- **metrics** ([]MetricSpec)

  *Atomic: will be replaced during a merge*

  metrics contains the specifications for which to use to calculate the desired replica count (the maximum replica count across all metrics will be used).  The desired replica count is calculated multiplying the ratio between the target value and the current value by the current number of pods.  Ergo, metrics used must decrease as the pod count is increased, and vice-versa.  See the individual metric source types for more information about how each type of metric must respond. If not set, the default metric will be set to 80% average CPU utilization.
-->

- **metrics** ([]MetricSpec)

  **原子性：將在合併時被替換**

  metrics 包含用於計算預期副本數的規約（將使用所有指標的最大副本數）。
  預期副本數是通過將目標值與當前值之間的比率乘以當前 Pod 數來計算的。
  因此，使用的指標必須隨着 Pod 數量的增加而減少，反之亦然。
  有關每種類別的指標必須如何響應的更多信息，請參閱各個指標源類別。
  如果未設置，默認指標將設置爲 80% 的平均 CPU 利用率。

  <a name="MetricSpec"></a>

  <!--
  *MetricSpec specifies how to scale based on a single metric (only `type` and one other matching field should be set at once).*
  
  - **metrics.type** (string), required
  
    type is the type of metric source.  It should be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each mapping to a matching field in the object.
  -->

  **MetricSpec 指定如何基於單個指標進行擴縮容（一次只能設置 `type` 和一個其他匹配字段）**

  - **metrics.type** (string)，必需

    type 是指標源的類別。它取值是 “ContainerResource”、“External”、“Object”、“Pods” 或 “Resource” 之一，
    每個類別映射到對象中的一個對應的字段。

  <!--
  - **metrics.containerResource** (ContainerResourceMetricSource)

    containerResource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod of the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.
  -->

  - **metrics.containerResource** (ContainerResourceMetricSource)

    containerResource 是指 Kubernetes 已知的資源指標（例如在請求和限制中指定的那些），
    描述當前擴縮目標中每個 Pod 中的單個容器（例如 CPU 或內存）。
    此類指標內置於 Kubernetes 中，在使用 “pods” 源的、按 Pod 計算的普通指標之外，還具有一些特殊的擴縮選項。

    <a name="ContainerResourceMetricSource"></a>

    <!--
    *ContainerResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.  Only one "target" type should be set.*

    - **metrics.containerResource.container** (string), required

      container is the name of the container in the pods of the scaling target
    -->

    ContainerResourceMetricSource 指示如何根據請求和限制中指定的 Kubernetes 已知的資源指標進行擴縮容，
    此結構描述當前擴縮目標中的每個 Pod（例如 CPU 或內存）。在與目標值比較之前，這些值先計算平均值。
    此類指標內置於 Kubernetes 中，並且在使用 “Pods” 源的、按 Pod 統計的普通指標之外支持一些特殊的擴縮選項。
    只應設置一種 “target” 類別。

    - **metrics.containerResource.container** (string)，必需

      container 是擴縮目標的 Pod 中容器的名稱。

    <!--
    - **metrics.containerResource.name** (string), required

      name is the name of the resource in question.
    -->
    - **metrics.containerResource.name** (string)，必需

      name 是相關資源的名稱。

    <!--
    - **metrics.containerResource.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.containerResource.target** (MetricTarget)，必需

      target 指定給定指標的目標值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.containerResource.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定義特定指標的目標值、平均值或平均利用率**

      - **metrics.containerResource.target.type** (string)，必需

        type 表示指標類別是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.containerResource.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.containerResource.target.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 的資源指標均值的目標值，
        表示爲 Pod 資源請求值的百分比。目前僅對 “Resource” 指標源類別有效。

      <!--
      - **metrics.containerResource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.containerResource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        是跨所有相關 Pod 的指標均值的目標值（以數量形式給出）。

      <!--
      - **metrics.containerResource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.containerResource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的目標值（以數量形式給出）。

  <!--
  - **metrics.external** (ExternalMetricSource)

    external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).
  -->

  - **metrics.external** (ExternalMetricSource)

    external 指的是不與任何 Kubernetes 對象關聯的全局指標。
    這一字段允許基於來自集羣外部運行的組件（例如雲消息服務中的隊列長度，或來自運行在集羣外部的負載均衡器的 QPS）的信息進行自動擴縮容。

    <a name="ExternalMetricSource"></a>

    <!--
    *ExternalMetricSource indicates how to scale on a metric not associated with any Kubernetes object (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).*

    - **metrics.external.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    ExternalMetricSource 指示如何基於 Kubernetes 對象無關的指標
    （例如雲消息傳遞服務中的隊列長度，或來自集羣外部運行的負載均衡器的 QPS）執行擴縮操作。

    - **metrics.external.metric** (MetricIdentifier)，必需

      metric 通過名稱和選擇算符識別目標指標。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **metrics.external.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定義指標的名稱和可選的選擇算符**

      - **metrics.external.metric.name** (string)，必需

        name 是給定指標的名稱。

      <!--
      - **metrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **metrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是給定指標的標準 Kubernetes 標籤選擇算符的字符串編碼形式。
        設置後，它作爲附加參數傳遞給指標服務器，以獲取更具體的指標範圍。
        未設置時，僅 metricName 參數將用於收集指標。

    <!--
    - **metrics.external.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.external.target** (MetricTarget)，必需

      target 指定給定指標的目標值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.external.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定義特定指標的目標值、平均值或平均利用率**

      - **metrics.external.target.type** (string)，必需

        type 表示指標類別是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.external.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.external.target.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得到的資源指標均值的目標值，
        表示爲 Pod 資源請求值的百分比。目前僅對 “Resource” 指標源類別有效。

      <!--
      - **metrics.external.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.external.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相關 Pod 得到的指標均值的目標值（以數量形式給出）。

      <!--
      - **metrics.external.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.external.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的目標值（以數量形式給出）。

  <!--
  - **metrics.object** (ObjectMetricSource)

    object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object).
  -->

  - **metrics.object** (ObjectMetricSource)

    object 是指描述單個 Kubernetes 對象的指標（例如，Ingress 對象上的 `hits-per-second`）。

    <a name="ObjectMetricSource"></a>

    <!--
    *ObjectMetricSource indicates how to scale on a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).*

    - **metrics.object.describedObject** (CrossVersionObjectReference), required

      describedObject specifies the descriptions of a object,such as kind,name apiVersion
    -->

    **ObjectMetricSource 表示如何根據描述 Kubernetes 對象的指標進行擴縮容（例如，Ingress 對象的 `hits-per-second`）**

    - **metrics.object.describedObject** (CrossVersionObjectReference)，必需

      describeObject 表示對象的描述，如對象的 `kind`、`name`、`apiVersion`。

      <a name="CrossVersionObjectReference"></a>

      <!--
      *CrossVersionObjectReference contains enough information to let you identify the referred resource.*

      - **metrics.object.describedObject.kind** (string), required

        kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->

      **CrossVersionObjectReference 包含足夠的信息來讓你識別所引用的資源。**

      - **metrics.object.describedObject.kind** (string)，必需

        被引用對象的類別；更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

      <!--
      - **metrics.object.describedObject.name** (string), required

        name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
      -->

      - **metrics.object.describedObject.name** (string)，必需

        被引用對象的名稱；更多信息： https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      <!--
      - **metrics.object.describedObject.apiVersion** (string)

        apiVersion is the API version of the referent
      -->

      - **metrics.object.describedObject.apiVersion** (string)

        被引用對象的 API 版本。

    <!--
    - **metrics.object.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    - **metrics.object.metric** (MetricIdentifier)，必需

      metric 通過名稱和選擇算符識別目標指標。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **metrics.object.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定義指標的名稱和可選的選擇算符**

      - **metrics.object.metric.name** (string)，必需

        name 是給定指標的名稱。

      <!--
      - **metrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **metrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是給定指標的標準 Kubernetes 標籤選擇算符的字符串編碼形式。
        設置後，它作爲附加參數傳遞給指標服務器，以獲取更具體的指標範圍。
        未設置時，僅 metricName 參數將用於收集指標。

    <!--
    - **metrics.object.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.object.target** (MetricTarget)，必需

      target 表示給定指標的目標值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.object.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定義特定指標的目標值、平均值或平均利用率**

      - **metrics.object.target.type** (string)，必需

        type 表示指標類別是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.object.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.object.target.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得出的資源指標均值的目標值，
        表示爲 Pod 資源請求值的百分比。目前僅對 “Resource” 指標源類別有效。

      <!--
      - **metrics.object.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.object.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有 Pod 得出的指標均值的目標值（以數量形式給出）。

      <!--
      - **metrics.object.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.object.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的目標值（以數量形式給出）。

  <!--
  - **metrics.pods** (PodsMetricSource)

    pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second).  The values will be averaged together before being compared to the target value.
  -->

  - **metrics.pods** (PodsMetricSource)

    pods 是指描述當前擴縮目標中每個 Pod 的指標（例如，`transactions-processed-per-second`）。
    在與目標值進行比較之前，這些指標值將被平均。

    <a name="PodsMetricSource"></a>

    <!--
    *PodsMetricSource indicates how to scale on a metric describing each pod in the current scale target (for example, transactions-processed-per-second). The values will be averaged together before being compared to the target value.*

    - **metrics.pods.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    PodsMetricSource 表示如何根據描述當前擴縮目標中每個 Pod 的指標進行擴縮容（例如，`transactions-processed-per-second`）。
    在與目標值進行比較之前，這些指標值將被平均。

    - **metrics.pods.metric** (MetricIdentifier)，必需

      metric 通過名稱和選擇算符識別目標指標。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **metrics.pods.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定義指標的名稱和可選的選擇算符**

      - **metrics.pods.metric.name** (string)，必需

        name 是給定指標的名稱。

      <!--
      - **metrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **metrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是給定指標的標準 Kubernetes 標籤選擇算符的字符串編碼形式。
        設置後，它作爲附加參數傳遞給指標服務器，以獲取更具體的指標範圍。
        未設置時，僅 metricName 參數將用於收集指標。

    <!--
    - **metrics.pods.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.pods.target** (MetricTarget)，必需

      target 表示給定指標的目標值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.pods.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定義特定指標的目標值、平均值或平均利用率**

      - **metrics.pods.target.type** (string)，必需

        type 表示指標類別是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.pods.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.pods.target.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得出的資源指標均值的目標值，
        表示爲 Pod 資源請求值的百分比。目前僅對 “Resource” 指標源類別有效。

      <!--
      - **metrics.pods.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.pods.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有 Pod 得出的指標均值的目標值（以數量形式給出）。

      <!--
      - **metrics.pods.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.pods.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的目標值（以數量形式給出）。

  <!--
  - **metrics.resource** (ResourceMetricSource)

    resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.
  -->

  - **metrics.resource** (ResourceMetricSource)

    resource 是指 Kubernetes 已知的資源指標（例如在請求和限制中指定的那些），
    此結構描述當前擴縮目標中的每個 Pod（例如 CPU 或內存）。此類指標內置於 Kubernetes 中，
    並且在使用 “Pods” 源的、按 Pod 統計的普通指標之外支持一些特殊的擴縮選項。

    <a name="ResourceMetricSource"></a>

    <!--
    *ResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.  Only one "target" type should be set.*

    - **metrics.resource.name** (string), required

      name is the name of the resource in question.
    -->

    ResourceMetricSource 指示如何根據請求和限制中指定的 Kubernetes 已知的資源指標進行擴縮容，
    此結構描述當前擴縮目標中的每個 Pod（例如 CPU 或內存）。在與目標值比較之前，這些指標值將被平均。
    此類指標內置於 Kubernetes 中，並且在使用 “Pods” 源的、按 Pod 統計的普通指標之外支持一些特殊的擴縮選項。
    只應設置一種 “target” 類別。

    - **metrics.resource.name** (string)，必需

      name 是相關資源的名稱。

    <!--
    - **metrics.resource.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.resource.target** (MetricTarget)，必需

      target 指定給定指標的目標值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.resource.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定義特定指標的目標值、平均值或平均利用率**

      - **metrics.resource.target.type** (string)，必需

        type 表示指標類別是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.resource.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.resource.target.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得出的資源指標均值的目標值，
        表示爲 Pod 資源請求值的百分比。目前僅對 “Resource” 指標源類別有效。

      <!--
      - **metrics.resource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.resource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有 Pod 得出的指標均值的目標值（以數量形式給出）。

      <!--
      - **metrics.resource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.resource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的目標值（以數量形式給出）。

## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

<!--
HorizontalPodAutoscalerStatus describes the current status of a horizontal pod autoscaler.
-->
HorizontalPodAutoscalerStatus 描述了水平 Pod 自動擴縮器的當前狀態。

<hr>

<!--
- **desiredReplicas** (int32), required

  desiredReplicas is the desired number of replicas of pods managed by this autoscaler, as last calculated by the autoscaler.
-->

- **desiredReplicas** (int32)，必需

  desiredReplicas 是此自動擴縮器管理的 Pod 的所期望的副本數，由自動擴縮器最後計算。

<!--
- **conditions** ([]HorizontalPodAutoscalerCondition)

  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*

  conditions is the set of conditions required for this autoscaler to scale its target, and indicates whether or not those conditions are met.
-->

- **conditions** ([]HorizontalPodAutoscalerCondition)

  **補丁策略：基於鍵 `type` 合併**

  **Map：合併時將保留 type 鍵的唯一值**

  conditions 是此自動擴縮器擴縮其目標所需的一組條件，並指示是否滿足這些條件。

  <a name="HorizontalPodAutoscalerCondition"></a>

  <!--
  *HorizontalPodAutoscalerCondition describes the state of a HorizontalPodAutoscaler at a certain point.*

  - **conditions.status** (string), required

    status is the status of the condition (True, False, Unknown)
  -->

  **HorizontalPodAutoscalerCondition 描述 HorizontalPodAutoscaler 在某一時間點的狀態。**

  - **conditions.status** (string)，必需

    status 是狀況的狀態（True、False、Unknown）。

  <!--
  - **conditions.type** (string), required

    type describes the current condition
  -->

  - **conditions.type** (string)，必需

    type 描述當前狀況。

  <!--
  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime is the last time the condition transitioned from one status to another
  -->

  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime 是狀況最近一次從一種狀態轉換到另一種狀態的時間。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    **Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。爲 time 包的許多函數方法提供了封裝器。**

  <!--
  - **conditions.message** (string)

    message is a human-readable explanation containing details about the transition
  -->

  - **conditions.message** (string)

    message 是一個包含有關轉換的可讀的詳細信息。

  <!--
  - **conditions.reason** (string)

    reason is the reason for the condition's last transition.
  -->

  - **conditions.reason** (string)

    reason 是狀況最後一次轉換的原因。

<!--
- **currentMetrics** ([]MetricStatus)

  *Atomic: will be replaced during a merge*

  currentMetrics is the last read state of the metrics used by this autoscaler.
-->

- **currentMetrics** ([]MetricStatus)

  **原子性：將在合併期間被替換**

  currentMetrics 是此自動擴縮器使用的指標的最後讀取狀態。

  <a name="MetricStatus"></a>

  <!--
  *MetricStatus describes the last-read state of a single metric.*

  - **currentMetrics.type** (string), required

    type is the type of metric source.  It will be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each corresponds to a matching field in the object.
  -->

  **MetricStatus 描述了單個指標的最後讀取狀態。**

  - **currentMetrics.type** (string)，必需

    type 是指標源的類別。它取值是 “ContainerResource”、“External”、“Object”、“Pods” 或 “Resource” 之一，
    每個類別映射到對象中的一個對應的字段。

  <!--
  - **currentMetrics.containerResource** (ContainerResourceMetricStatus)

    container resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.
  -->

  - **currentMetrics.containerResource** (ContainerResourceMetricStatus)

    containerResource 是指 Kubernetes 已知的一種資源指標（例如在請求和限制中指定的那些），
    描述當前擴縮目標中每個 Pod 中的單個容器（例如 CPU 或內存）。
    此類指標內置於 Kubernetes 中，並且在使用 "Pods" 源的、按 Pod 統計的普通指標之外支持一些特殊的擴縮選項。

    <a name="ContainerResourceMetricStatus"></a>

    <!--
    *ContainerResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing a single container in each pod in the current scale target (e.g. CPU or memory).  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.*

    - **currentMetrics.containerResource.container** (string), required

      container is the name of the container in the pods of the scaling target
    -->

    ContainerResourceMetricStatus 指示如何根據請求和限制中指定的 Kubernetes 已知的資源指標進行擴縮容，
    此結構描述當前擴縮目標中的每個 Pod（例如 CPU 或內存）。此類指標內置於 Kubernetes 中，
    並且在使用 “Pods” 源的、按 Pod 統計的普通指標之外支持一些特殊的擴縮選項。

    - **currentMetrics.containerResource.container** (string)，必需

      container 是擴縮目標的 Pod 中的容器名稱。

    <!--
    - **currentMetrics.containerResource.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    - **currentMetrics.containerResource.current** (MetricValueStatus)，必需

      current 包含給定指標的當前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.containerResource.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指標的當前值**

      - **currentMetrics.containerResource.current.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得出的資源指標均值的當前值，表示爲 Pod 資源請求值的百分比。

      <!--
      - **currentMetrics.containerResource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.containerResource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相關 Pod 的指標均值的當前值（以數量形式給出）。

      <!--
      - **currentMetrics.containerResource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.containerResource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的當前值（以數量形式給出）。

    <!--
    - **currentMetrics.containerResource.name** (string), required

      name is the name of the resource in question.
    -->

    - **currentMetrics.containerResource.name** (string)，必需

      name 是相關資源的名稱。

  <!--
  - **currentMetrics.external** (ExternalMetricStatus)

    external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).
  -->

  - **currentMetrics.external** (ExternalMetricStatus)

    external 指的是不與任何 Kubernetes 對象關聯的全局指標。這一字段允許基於來自集羣外部運行的組件
    （例如雲消息服務中的隊列長度，或來自集羣外部運行的負載均衡器的 QPS）的信息進行自動擴縮。

    <a name="ExternalMetricStatus"></a>

    <!--
    *ExternalMetricStatus indicates the current value of a global metric not associated with any Kubernetes object.*

    - **currentMetrics.external.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    **ExternalMetricStatus 表示與任何 Kubernetes 對象無關的全局指標的當前值。**

    - **currentMetrics.external.current** (MetricValueStatus)，必需

      current 包含給定指標的當前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.external.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指標的當前值**

      - **currentMetrics.external.current.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得出的資源指標均值的當前值，表示爲 Pod 資源請求值的百分比。

      <!--
      - **currentMetrics.external.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.external.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相關 Pod 的指標均值的當前值（以數量形式給出）。

      <!--
      - **currentMetrics.external.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.external.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的當前值（以數量形式給出）。

    <!--
    - **currentMetrics.external.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    - **currentMetrics.external.metric** (MetricIdentifier)，必需

      metric 通過名稱和選擇算符識別目標指標。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **currentMetrics.external.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定義指標的名稱和可選的選擇算符**

      - **currentMetrics.external.metric.name** (string)，必需

        name 是給定指標的名稱。

      <!--
      - **currentMetrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **currentMetrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是給定指標的標準 Kubernetes 標籤選擇算符的字符串編碼形式。
        設置後，它作爲附加參數傳遞給指標服務器，以獲取更具體的指標範圍。
        未設置時，僅 metricName 參數將用於收集指標。

  <!--
  - **currentMetrics.object** (ObjectMetricStatus)

    object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object).
  -->

  - **currentMetrics.object** (ObjectMetricStatus)

    object 是指描述單個 Kubernetes 對象的指標（例如，Ingress 對象的 `hits-per-second`）。

    <a name="ObjectMetricStatus"></a>

    <!--
    *ObjectMetricStatus indicates the current value of a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).*

    - **currentMetrics.object.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    **ObjectMetricStatus 表示描述 Kubernetes 對象的指標的當前值（例如，Ingress 對象的 `hits-per-second`）。**

    - **currentMetrics.object.current** (MetricValueStatus)，必需

      current 包含給定指標的當前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.object.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指標的當前值**

      - **currentMetrics.object.current.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得出的資源指標均值的當前值，表示爲 Pod 資源請求值的百分比。

      <!--
      - **currentMetrics.object.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.object.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相關 Pod 的指標均值的當前值（以數量形式給出）。

      <!--
      - **currentMetrics.object.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.object.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的當前值（以數量形式給出）。

    <!--
    - **currentMetrics.object.describedObject** (CrossVersionObjectReference), required

      DescribedObject specifies the descriptions of a object,such as kind,name apiVersion
    -->

    - **currentMetrics.object.describedObject** (CrossVersionObjectReference)，必需

      describeObject 表示對象的描述，如對象的 `kind`、`name`、`apiVersion`。

      <a name="CrossVersionObjectReference"></a>

      <!--
      *CrossVersionObjectReference contains enough information to let you identify the referred resource.*

      - **currentMetrics.object.describedObject.kind** (string), required

        kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->

      **CrossVersionObjectReference 包含足夠的信息來讓你識別所引用的資源。**

      - **currentMetrics.object.describedObject.kind** (string)，必需

        `kind` 是被引用對象的類別；更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

      <!--
      - **currentMetrics.object.describedObject.name** (string), required

        name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
      -->

      - **currentMetrics.object.describedObject.name** (string)，必需

        被引用對象的名稱；更多信息： https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      <!--
      - **currentMetrics.object.describedObject.apiVersion** (string)

        apiVersion is the API version of the referent
      -->

      - **currentMetrics.object.describedObject.apiVersion** (string)

        被引用對象的 API 版本。

    <!--
    - **currentMetrics.object.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    - **currentMetrics.object.metric** (MetricIdentifier)，必需

      metric 通過名稱和選擇算符識別目標指標。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **currentMetrics.object.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定義指標的名稱和可選的選擇算符**

      - **currentMetrics.object.metric.name** (string)，必需

        name 是給定指標的名稱。

      <!--
      - **currentMetrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **currentMetrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是給定指標的標準 Kubernetes 標籤選擇算符的字符串編碼形式。
        設置後，它作爲附加參數傳遞給指標服務器，以獲取更具體的指標範圍。
        未設置時，僅 metricName 參數將用於收集指標。

  <!--
  - **currentMetrics.pods** (PodsMetricStatus)

    pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second).  The values will be averaged together before being compared to the target value.
  -->

  - **currentMetrics.pods** (PodsMetricStatus)

    pods 是指描述當前擴縮目標中每個 Pod 的指標（例如，`transactions-processed-per-second`）。
    在與目標值進行比較之前，這些指標值將被平均。

    <a name="PodsMetricStatus"></a>

    <!--
    *PodsMetricStatus indicates the current value of a metric describing each pod in the current scale target (for example, transactions-processed-per-second).*

    - **currentMetrics.pods.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    **PodsMetricStatus 表示描述當前擴縮目標中每個 Pod 的指標的當前值（例如，`transactions-processed-per-second`）。**

    - **currentMetrics.pods.current** (MetricValueStatus)，必需

      current 包含給定指標的當前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.pods.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指標的當前值**

      - **currentMetrics.pods.current.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得出的資源指標均值的當前值，表示爲 Pod 資源請求值的百分比。

      <!--
      - **currentMetrics.pods.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.pods.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相關 Pod 的指標均值的當前值（以數量形式給出）。

      <!--
      - **currentMetrics.pods.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.pods.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的當前值（以數量形式給出）。

    <!--
    - **currentMetrics.pods.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    - **currentMetrics.pods.metric** (MetricIdentifier)，必需

      metric 通過名稱和選擇算符識別目標指標。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **currentMetrics.pods.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定義指標的名稱和可選的選擇算符**

      - **currentMetrics.pods.metric.name** (string)，必需

        name 是給定指標的名稱。

      <!--
      - **currentMetrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **currentMetrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是給定指標的標準 Kubernetes 標籤選擇算符的字符串編碼形式。
        設置後，它作爲附加參數傳遞給指標服務器，以獲取更具體的指標範圍。
        未設置時，僅 metricName 參數將用於收集指標。

  <!--
  - **currentMetrics.resource** (ResourceMetricStatus)

    resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.
  -->

  - **currentMetrics.resource** (ResourceMetricStatus)

    resource 是指 Kubernetes 已知的資源指標（例如在請求和限制中指定的那些），
    此結構描述當前擴縮目標中的每個 Pod（例如 CPU 或內存）。此類指標內置於 Kubernetes 中，
    並且在使用 “Pods” 源的、按 Pod 統計的普通指標之外支持一些特殊的擴縮選項。

    <a name="ResourceMetricStatus"></a>

    <!--
    *ResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.*

    - **currentMetrics.resource.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    ResourceMetricSource 指示如何根據請求和限制中指定的 Kubernetes 已知的資源指標進行擴縮容，
    此結構描述當前擴縮目標中的每個 Pod（例如 CPU 或內存）。在與目標值比較之前，這些指標值將被平均。
    此類指標內置於 Kubernetes 中，並且在使用 “Pods” 源的、按 Pod 統計的普通指標之外支持一些特殊的擴縮選項。

    - **currentMetrics.resource.current** (MetricValueStatus)，必需

      current 包含給定指標的當前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.resource.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指標的當前值**

      - **currentMetrics.resource.current.averageUtilization** (int32)

        averageUtilization 是跨所有相關 Pod 得出的資源指標均值的當前值，
        表示爲 Pod 資源請求值的百分比。

      <!--
      - **currentMetrics.resource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.resource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相關 Pod 的指標均值的當前值（以數量形式給出）。

      <!--
      - **currentMetrics.resource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.resource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指標的當前值（以數量形式給出）。

    <!--
    - **currentMetrics.resource.name** (string), required

      name is the name of the resource in question.
    -->

    - **currentMetrics.resource.name** (string)，必需

      name 是相關資源的名稱。

<!--
- **currentReplicas** (int32)

  currentReplicas is current number of replicas of pods managed by this autoscaler, as last seen by the autoscaler.
-->

- **currentReplicas** (int32)

  currentReplicas 是此自動擴縮器管理的 Pod 的當前副本數，如自動擴縮器最後一次看到的那樣。

<!--
- **lastScaleTime** (Time)

  lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods, used by the autoscaler to control how often the number of pods is changed.
-->

- **lastScaleTime** (Time)

  lastScaleTime 是 HorizontalPodAutoscaler 上次擴縮 Pod 數量的時間，自動擴縮器使用它來控制更改 Pod 數量的頻率。

  <a name="Time"></a>

  <!--
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  **Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。爲 time 包的許多函數方法提供了封裝器。**

<!--
- **observedGeneration** (int64)

  observedGeneration is the most recent generation observed by this autoscaler.
-->

- **observedGeneration** (int64)

  observedGeneration 是此自動擴縮器觀察到的最新一代。

## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

<!--
HorizontalPodAutoscalerList is a list of horizontal pod autoscaler objects.
-->
HorizontalPodAutoscalerList 是水平 Pod 自動擴縮器對象列表。

<hr>

- **apiVersion**: autoscaling/v2

- **kind**: HorizontalPodAutoscalerList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata is the standard list metadata.
-->

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata 是標準的列表元數據。

<!--
- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>), required

  items is the list of horizontal pod autoscaler objects.
-->

- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>)，必需

  items 是水平 Pod 自動擴縮器對象的列表。

## Operations {#Operations}

<hr>

<!--
### `get` read the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `get` 讀取指定的 HorizontalPodAutoscaler

#### HTTP 請求

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 參數

- **name** （**路徑參數**）: string，必需

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `get` 讀取指定 HorizontalPodAutoscaler 的狀態

#### HTTP 請求

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 參數

- **name** （**路徑參數**）: string，必需

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind HorizontalPodAutoscaler

#### HTTP Request
-->
### `list` 列出或觀察 HorizontalPodAutoscaler 類別的對象

#### HTTP 請求

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
#### 參數

- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*)-->（**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*)-->（**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind HorizontalPodAutoscaler

#### HTTP Request
-->
### `list` 列出或觀察 HorizontalPodAutoscaler 類別的對象

#### HTTP 請求

GET /apis/autoscaling/v2/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 參數

- **allowWatchBookmarks** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*)-->（**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*)-->（**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

<!--
### `create` create a HorizontalPodAutoscaler

#### HTTP Request
-->
### `create` 創建一個 HorizontalPodAutoscaler

#### HTTP 請求

POST /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
#### 參數

- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必需

- **dryRun** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

202 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `update` 替換指定的 HorizontalPodAutoscaler

#### HTTP 請求

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 參數

- **name** （**路徑參數**）: string，必需

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必需

- **dryRun** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `update` 替換指定 HorizontalPodAutoscaler 的狀態

#### HTTP 請求

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 參數

- **name** （**路徑參數**）: string，必需

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必需

- **dryRun** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `patch` 部分更新指定的 HorizontalPodAutoscaler

#### HTTP 請求

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 參數

- **name** （**路徑參數**）: string，必需

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `patch` 部分更新指定 HorizontalPodAutoscaler 的狀態

#### HTTP 請求

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 參數

- **name** （**路徑參數**）: string，必需

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `delete` delete a HorizontalPodAutoscaler

#### HTTP Request
-->
### `delete` 刪除一個 HorizontalPodAutoscaler

#### HTTP 請求

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 參數

- **name** （**路徑參數**）: string，必需

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** <!--(*in query*)-->（**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of HorizontalPodAutoscaler

#### HTTP Request
-->
### `deletecollection` 刪除 HorizontalPodAutoscaler 的集合

#### HTTP 請求

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
#### 參數

- **namespace** （**路徑參數**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** <!--(*in query*)-->（**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*)-->（**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*)-->（**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*)-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*)-->（**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

