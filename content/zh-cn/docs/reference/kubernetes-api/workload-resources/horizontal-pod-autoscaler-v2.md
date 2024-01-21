---
api_metadata:
  apiVersion: "autoscaling/v2"
  import: "k8s.io/api/autoscaling/v2"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "HorizontalPodAutoscaler 是水平 Pod 自动扩缩器的配置，它根据指定的指标自动管理实现 scale 子资源的任何资源的副本数。"
title: "HorizontalPodAutoscaler"
weight: 12
---
<!--
api_metadata:
  apiVersion: "autoscaling/v2"
  import: "k8s.io/api/autoscaling/v2"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "HorizontalPodAutoscaler is the configuration for a horizontal pod autoscaler, which automatically manages the replica count of any resource implementing the scale subresource based on the metrics specified."
title: "HorizontalPodAutoscaler"
weight: 12
auto_generated: true
-->

`apiVersion: autoscaling/v2`

`import "k8s.io/api/autoscaling/v2"`


## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

<!--
HorizontalPodAutoscaler is the configuration for a horizontal pod autoscaler, which automatically manages the replica count of any resource implementing the scale subresource based on the metrics specified.
-->
HorizontalPodAutoscaler 是水平 Pod 自动扩缩器的配置，
它根据指定的指标自动管理实现 scale 子资源的任何资源的副本数。

<hr>

- **apiVersion**: autoscaling/v2

- **kind**: HorizontalPodAutoscaler

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  metadata is the standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->

  metadata 是标准的对象元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a>)

  <!--
  spec is the specification for the behaviour of the autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.
  -->

  spec 是自动扩缩器行为的规约。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.

- **status** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a>)

  <!--
  status is the current information about the autoscaler.
  -->

  status 是自动扩缩器的当前信息。

## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

<!--
HorizontalPodAutoscalerSpec describes the desired functionality of the HorizontalPodAutoscaler.
-->
HorizontalPodAutoscalerSpec 描述了 HorizontalPodAutoscaler 预期的功能。

<hr>

<!--
- **maxReplicas** (int32), required

  maxReplicas is the upper limit for the number of replicas to which the autoscaler can scale up. It cannot be less that minReplicas.
-->

- **maxReplicas** (int32)，必需

  maxReplicas 是自动扩缩器可以扩容的副本数的上限。不能小于 minReplicas。

<!--
- **scaleTargetRef** (CrossVersionObjectReference), required

  scaleTargetRef points to the target resource to scale, and is used to the pods for which metrics should be collected, as well as to actually change the replica count.
-->

- **scaleTargetRef** (CrossVersionObjectReference)，必需

  scaleTargetRef 指向要扩缩的目标资源，用于收集 Pod 的相关指标信息以及实际更改的副本数。

  <a name="CrossVersionObjectReference"></a>

  <!--
  *CrossVersionObjectReference contains enough information to let you identify the referred resource.*

  - **scaleTargetRef.kind** (string), required

    kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  **CrossVersionObjectReference 包含足够的信息来让你识别出所引用的资源。**

  - **scaleTargetRef.kind** (string)，必需

    `kind` 是被引用对象的类别；更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  <!--
  - **scaleTargetRef.name** (string), required

    name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
  -->

  - **scaleTargetRef.name** (string)，必需

    `name` 是被引用对象的名称；更多信息：https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

  <!--
  - **scaleTargetRef.apiVersion** (string)

    apiVersion is the API version of the referent

  -->

  - **scaleTargetRef.apiVersion** (string)

    `apiVersion` 是被引用对象的 API 版本。

<!--
- **minReplicas** (int32)

  minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down.  It defaults to 1 pod.  minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured.  Scaling is active as long as at least one metric value is available.
-->

- **minReplicas** (int32)

  minReplicas 是自动扩缩器可以缩减的副本数的下限。它默认为 1 个 Pod。
  如果启用了 Alpha 特性门控 HPAScaleToZero 并且配置了至少一个 Object 或 External 度量指标，
  则 minReplicas 允许为 0。只要至少有一个度量值可用，扩缩就处于活动状态。

<!--
- **behavior** (HorizontalPodAutoscalerBehavior)

  behavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively). If not set, the default HPAScalingRules for scale up and scale down are used.
-->

- **behavior** (HorizontalPodAutoscalerBehavior)

  behavior 配置目标在扩容（Up）和缩容（Down）两个方向的扩缩行为（分别用 scaleUp 和 scaleDown 字段）。
  如果未设置，则会使用默认的 HPAScalingRules 进行扩缩容。

  <a name="HorizontalPodAutoscalerBehavior"></a>

  <!--
  *HorizontalPodAutoscalerBehavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively).*

  - **behavior.scaleDown** (HPAScalingRules)

    scaleDown is scaling policy for scaling Down. If not set, the default value is to allow to scale down to minReplicas pods, with a 300 second stabilization window (i.e., the highest recommendation for the last 300sec is used).
  -->

  **HorizontalPodAutoscalerBehavior 配置目标在扩容（Up）和缩容（Down）两个方向的扩缩行为
  （分别用 scaleUp 和 scaleDown 字段）。**

  - **behavior.scaleDown** (HPAScalingRules)

    scaleDown 是缩容策略。如果未设置，则默认值允许缩减到 minReplicas 数量的 Pod，
    具有 300 秒的稳定窗口（使用最近 300 秒的最高推荐值）。

    <a name="HPAScalingRules"></a>

    <!--
    *HPAScalingRules configures the scaling behavior for one direction. These Rules are applied after calculating DesiredReplicas from metrics for the HPA. They can limit the scaling velocity by specifying scaling policies. They can prevent flapping by specifying the stabilization window, so that the number of replicas is not set instantly, instead, the safest value from the stabilization window is chosen.*

    - **behavior.scaleDown.policies** ([]HPAScalingPolicy)

      *Atomic: will be replaced during a merge*

      policies is a list of potential scaling polices which can be used during scaling. At least one policy must be specified, otherwise the HPAScalingRules will be discarded as invalid
    -->

    HPAScalingRules 为一个方向配置扩缩行为。在根据 HPA 的指标计算 desiredReplicas 后应用这些规则。
    可以通过指定扩缩策略来限制扩缩速度。可以通过指定稳定窗口来防止抖动，
    因此不会立即设置副本数，而是选择稳定窗口中最安全的值。

    - **behavior.scaleDown.policies** ([]HPAScalingPolicy)

      **原子性：将在合并时被替换**

      policies 是可在扩缩容过程中使用的潜在扩缩策略的列表。必须至少指定一个策略，否则 HPAScalingRules 将被视为无效而丢弃。

      <a name="HPAScalingPolicy"></a>

      <!--
      *HPAScalingPolicy is a single policy which must hold true for a specified past interval.*

      - **behavior.scaleDown.policies.type** (string), required

        type is used to specify the scaling policy.
      -->

      **HPAScalingPolicy 是一个单一的策略，它必须在指定的过去时间间隔内保持为 true。**

      - **behavior.scaleDown.policies.type** (string)，必需

        type 用于指定扩缩策略。

      <!--
      - **behavior.scaleDown.policies.value** (int32), required

        value contains the amount of change which is permitted by the policy. It must be greater than zero
      -->

      - **behavior.scaleDown.policies.value** (int32)，必需

        value 包含策略允许的更改量。它必须大于零。

      <!--
      - **behavior.scaleDown.policies.periodSeconds** (int32), required

        periodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min).
      -->

      - **behavior.scaleDown.policies.periodSeconds** (int32)，必需

        periodSeconds 表示策略应该保持为 true 的时间窗口长度。
        periodSeconds 必须大于零且小于或等于 1800（30 分钟）。

    <!--
    - **behavior.scaleDown.selectPolicy** (string)

      selectPolicy is used to specify which policy should be used. If not set, the default value Max is used.
    -->

    - **behavior.scaleDown.selectPolicy** (string)

      selectPolicy 用于指定应该使用哪个策略。如果未设置，则使用默认值 Max。

    <!--
    - **behavior.scaleDown.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long).

    -->

    - **behavior.scaleDown.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds 是在扩缩容时应考虑的之前建议的秒数。stabilizationWindowSeconds
      必须大于或等于零且小于或等于 3600（一小时）。如果未设置，则使用默认值：

      - 扩容：0（不设置稳定窗口）。
      - 缩容：300（即稳定窗口为 300 秒）。

  <!--
  - **behavior.scaleUp** (HPAScalingRules)

    scaleUp is scaling policy for scaling Up. If not set, the default value is the higher of:
      * increase no more than 4 pods per 60 seconds
      * double the number of pods per 60 seconds
    No stabilization is used.
  -->

  - **behavior.scaleUp** (HPAScalingRules)

    scaleUp 是用于扩容的扩缩策略。如果未设置，则默认值为以下值中的较高者：

      * 每 60 秒增加不超过 4 个 Pod
      * 每 60 秒 Pod 数量翻倍

    不使用稳定窗口。

    <a name="HPAScalingRules"></a>

    <!--
    *HPAScalingRules configures the scaling behavior for one direction. These Rules are applied after calculating DesiredReplicas from metrics for the HPA. They can limit the scaling velocity by specifying scaling policies. They can prevent flapping by specifying the stabilization window, so that the number of replicas is not set instantly, instead, the safest value from the stabilization window is chosen.*

    - **behavior.scaleUp.policies** ([]HPAScalingPolicy)

      *Atomic: will be replaced during a merge*

      policies is a list of potential scaling polices which can be used during scaling. At least one policy must be specified, otherwise the HPAScalingRules will be discarded as invalid
    -->

    HPAScalingRules 为一个方向配置扩缩行为。在根据 HPA 的指标计算 desiredReplicas 后应用这些规则。
    可以通过指定扩缩策略来限制扩缩速度。可以通过指定稳定窗口来防止抖动，
    因此不会立即设置副本数，而是选择稳定窗口中最安全的值。

    - **behavior.scaleUp.policies** ([]HPAScalingPolicy)

      **原子性：将在合并时被替换**

      policies 是可在扩缩容过程中使用的潜在扩缩策略的列表。必须至少指定一个策略，否则 HPAScalingRules 将被视为无效而丢弃。

      <a name="HPAScalingPolicy"></a>

      <!--
      *HPAScalingPolicy is a single policy which must hold true for a specified past interval.*

      - **behavior.scaleUp.policies.type** (string), required

        type is used to specify the scaling policy.
      -->

      **HPAScalingPolicy 是一个单一的策略，它必须在指定的过去时间间隔内保持为 true。**

      - **behavior.scaleUp.policies.type** (string)，必需

        type 用于指定扩缩策略。

      <!--
      - **behavior.scaleUp.policies.value** (int32), required

        value contains the amount of change which is permitted by the policy. It must be greater than zero
      -->
      - **behavior.scaleUp.policies.value** (int32)，必需

        value 包含策略允许的更改量。它必须大于零。

      <!--
      - **behavior.scaleUp.policies.periodSeconds** (int32), required

        periodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min).
      -->

      - **behavior.scaleUp.policies.periodSeconds** (int32)，必需

        periodSeconds 表示策略应该保持为 true 的时间窗口长度。
        periodSeconds 必须大于零且小于或等于 1800（30 分钟）。

    <!--
    - **behavior.scaleUp.selectPolicy** (string)

      selectPolicy is used to specify which policy should be used. If not set, the default value Max is used.
    -->

    - **behavior.scaleUp.selectPolicy** (string)

      selectPolicy 用于指定应该使用哪个策略。如果未设置，则使用默认值 Max。

    <!--
    - **behavior.scaleUp.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long).

    -->

    - **behavior.scaleUp.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds 是在扩缩容时应考虑的之前建议的秒数。stabilizationWindowSeconds
      必须大于或等于零且小于或等于 3600（一小时）。如果未设置，则使用默认值：

      - 扩容：0（不设置稳定窗口）。
      - 缩容：300（即稳定窗口为 300 秒）。

<!--
- **metrics** ([]MetricSpec)

  *Atomic: will be replaced during a merge*

  metrics contains the specifications for which to use to calculate the desired replica count (the maximum replica count across all metrics will be used).  The desired replica count is calculated multiplying the ratio between the target value and the current value by the current number of pods.  Ergo, metrics used must decrease as the pod count is increased, and vice-versa.  See the individual metric source types for more information about how each type of metric must respond. If not set, the default metric will be set to 80% average CPU utilization.
-->

- **metrics** ([]MetricSpec)

  **原子性：将在合并时被替换**

  metrics 包含用于计算预期副本数的规约（将使用所有指标的最大副本数）。
  预期副本数是通过将目标值与当前值之间的比率乘以当前 Pod 数来计算的。
  因此，使用的指标必须随着 Pod 数量的增加而减少，反之亦然。
  有关每种类别的指标必须如何响应的更多信息，请参阅各个指标源类别。
  如果未设置，默认指标将设置为 80% 的平均 CPU 利用率。

  <a name="MetricSpec"></a>

  <!--
  *MetricSpec specifies how to scale based on a single metric (only `type` and one other matching field should be set at once).*
  
  - **metrics.type** (string), required
  
    type is the type of metric source.  It should be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each mapping to a matching field in the object. Note: "ContainerResource" type is available on when the feature-gate HPAContainerMetrics is enabled
  -->

  **MetricSpec 指定如何基于单个指标进行扩缩容（一次只能设置 `type` 和一个其他匹配字段）**

  - **metrics.type** (string)，必需

    type 是指标源的类别。它取值是 “ContainerResource”、“External”、“Object”、“Pods” 或 “Resource” 之一，
    每个类别映射到对象中的一个对应的字段。注意：“ContainerResource” 类别在特性门控 HPAContainerMetrics 启用时可用。

  <!--
  - **metrics.containerResource** (ContainerResourceMetricSource)

    containerResource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod of the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. This is an alpha feature and can be enabled by the HPAContainerMetrics feature flag.
  -->

  - **metrics.containerResource** (ContainerResourceMetricSource)

    containerResource 是指 Kubernetes 已知的资源指标（例如在请求和限制中指定的那些），
    描述当前扩缩目标中每个 Pod 中的单个容器（例如 CPU 或内存）。
    此类指标内置于 Kubernetes 中，在使用 “pods” 源的、按 Pod 计算的普通指标之外，还具有一些特殊的扩缩选项。
    这是一个 Alpha 特性，可以通过 HPAContainerMetrics 特性标志启用。

    <a name="ContainerResourceMetricSource"></a>

    <!--
    *ContainerResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.  Only one "target" type should be set.*

    - **metrics.containerResource.container** (string), required

      container is the name of the container in the pods of the scaling target
    -->

    ContainerResourceMetricSource 指示如何根据请求和限制中指定的 Kubernetes 已知的资源指标进行扩缩容，
    此结构描述当前扩缩目标中的每个 Pod（例如 CPU 或内存）。在与目标值比较之前，这些值先计算平均值。
    此类指标内置于 Kubernetes 中，并且在使用 “Pods” 源的、按 Pod 统计的普通指标之外支持一些特殊的扩缩选项。
    只应设置一种 “target” 类别。

    - **metrics.containerResource.container** (string)，必需

      container 是扩缩目标的 Pod 中容器的名称。

    <!--
    - **metrics.containerResource.name** (string), required

      name is the name of the resource in question.
    -->
    - **metrics.containerResource.name** (string)，必需

      name 是相关资源的名称。

    <!--
    - **metrics.containerResource.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.containerResource.target** (MetricTarget)，必需

      target 指定给定指标的目标值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.containerResource.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定义特定指标的目标值、平均值或平均利用率**

      - **metrics.containerResource.target.type** (string)，必需

        type 表示指标类别是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.containerResource.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.containerResource.target.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 的资源指标均值的目标值，
        表示为 Pod 资源请求值的百分比。目前仅对 “Resource” 指标源类别有效。

      <!--
      - **metrics.containerResource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.containerResource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        是跨所有相关 Pod 的指标均值的目标值（以数量形式给出）。

      <!--
      - **metrics.containerResource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.containerResource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的目标值（以数量形式给出）。

  <!--
  - **metrics.external** (ExternalMetricSource)

    external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).
  -->

  - **metrics.external** (ExternalMetricSource)

    external 指的是不与任何 Kubernetes 对象关联的全局指标。
    这一字段允许基于来自集群外部运行的组件（例如云消息服务中的队列长度，或来自运行在集群外部的负载均衡器的 QPS）的信息进行自动扩缩容。

    <a name="ExternalMetricSource"></a>

    <!--
    *ExternalMetricSource indicates how to scale on a metric not associated with any Kubernetes object (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).*

    - **metrics.external.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    ExternalMetricSource 指示如何基于 Kubernetes 对象无关的指标
    （例如云消息传递服务中的队列长度，或来自集群外部运行的负载均衡器的 QPS）执行扩缩操作。

    - **metrics.external.metric** (MetricIdentifier)，必需

      metric 通过名称和选择算符识别目标指标。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **metrics.external.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定义指标的名称和可选的选择算符**

      - **metrics.external.metric.name** (string)，必需

        name 是给定指标的名称。

      <!--
      - **metrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **metrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是给定指标的标准 Kubernetes 标签选择算符的字符串编码形式。
        设置后，它作为附加参数传递给指标服务器，以获取更具体的指标范围。
        未设置时，仅 metricName 参数将用于收集指标。

    <!--
    - **metrics.external.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.external.target** (MetricTarget)，必需

      target 指定给定指标的目标值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.external.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定义特定指标的目标值、平均值或平均利用率**

      - **metrics.external.target.type** (string)，必需

        type 表示指标类别是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.external.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.external.target.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得到的资源指标均值的目标值，
        表示为 Pod 资源请求值的百分比。目前仅对 “Resource” 指标源类别有效。

      <!--
      - **metrics.external.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.external.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相关 Pod 得到的指标均值的目标值（以数量形式给出）。

      <!--
      - **metrics.external.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.external.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的目标值（以数量形式给出）。

  <!--
  - **metrics.object** (ObjectMetricSource)

    object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object).
  -->

  - **metrics.object** (ObjectMetricSource)

    object 是指描述单个 Kubernetes 对象的指标（例如，Ingress 对象上的 `hits-per-second`）。

    <a name="ObjectMetricSource"></a>

    <!--
    *ObjectMetricSource indicates how to scale on a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).*

    - **metrics.object.describedObject** (CrossVersionObjectReference), required

      describedObject specifies the descriptions of a object,such as kind,name apiVersion
    -->

    **ObjectMetricSource 表示如何根据描述 Kubernetes 对象的指标进行扩缩容（例如，Ingress 对象的 `hits-per-second`）**

    - **metrics.object.describedObject** (CrossVersionObjectReference)，必需

      describeObject 表示对象的描述，如对象的 `kind`、`name`、`apiVersion`。

      <a name="CrossVersionObjectReference"></a>

      <!--
      *CrossVersionObjectReference contains enough information to let you identify the referred resource.*

      - **metrics.object.describedObject.kind** (string), required

        kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->

      **CrossVersionObjectReference 包含足够的信息来让你识别所引用的资源。**

      - **metrics.object.describedObject.kind** (string)，必需

        被引用对象的类别；更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

      <!--
      - **metrics.object.describedObject.name** (string), required

        name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
      -->

      - **metrics.object.describedObject.name** (string)，必需

        被引用对象的名称；更多信息： https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      <!--
      - **metrics.object.describedObject.apiVersion** (string)

        apiVersion is the API version of the referent
      -->

      - **metrics.object.describedObject.apiVersion** (string)

        被引用对象的 API 版本。

    <!--
    - **metrics.object.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    - **metrics.object.metric** (MetricIdentifier)，必需

      metric 通过名称和选择算符识别目标指标。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **metrics.object.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定义指标的名称和可选的选择算符**

      - **metrics.object.metric.name** (string)，必需

        name 是给定指标的名称。

      <!--
      - **metrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **metrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是给定指标的标准 Kubernetes 标签选择算符的字符串编码形式。
        设置后，它作为附加参数传递给指标服务器，以获取更具体的指标范围。
        未设置时，仅 metricName 参数将用于收集指标。

    <!--
    - **metrics.object.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.object.target** (MetricTarget)，必需

      target 表示给定指标的目标值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.object.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定义特定指标的目标值、平均值或平均利用率**

      - **metrics.object.target.type** (string)，必需

        type 表示指标类别是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.object.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.object.target.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得出的资源指标均值的目标值，
        表示为 Pod 资源请求值的百分比。目前仅对 “Resource” 指标源类别有效。

      <!--
      - **metrics.object.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.object.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有 Pod 得出的指标均值的目标值（以数量形式给出）。

      <!--
      - **metrics.object.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.object.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的目标值（以数量形式给出）。

  <!--
  - **metrics.pods** (PodsMetricSource)

    pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second).  The values will be averaged together before being compared to the target value.
  -->

  - **metrics.pods** (PodsMetricSource)

    pods 是指描述当前扩缩目标中每个 Pod 的指标（例如，`transactions-processed-per-second`）。
    在与目标值进行比较之前，这些指标值将被平均。

    <a name="PodsMetricSource"></a>

    <!--
    *PodsMetricSource indicates how to scale on a metric describing each pod in the current scale target (for example, transactions-processed-per-second). The values will be averaged together before being compared to the target value.*

    - **metrics.pods.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    PodsMetricSource 表示如何根据描述当前扩缩目标中每个 Pod 的指标进行扩缩容（例如，`transactions-processed-per-second`）。
    在与目标值进行比较之前，这些指标值将被平均。

    - **metrics.pods.metric** (MetricIdentifier)，必需

      metric 通过名称和选择算符识别目标指标。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **metrics.pods.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定义指标的名称和可选的选择算符**

      - **metrics.pods.metric.name** (string)，必需

        name 是给定指标的名称。

      <!--
      - **metrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **metrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是给定指标的标准 Kubernetes 标签选择算符的字符串编码形式。
        设置后，它作为附加参数传递给指标服务器，以获取更具体的指标范围。
        未设置时，仅 metricName 参数将用于收集指标。

    <!--
    - **metrics.pods.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.pods.target** (MetricTarget)，必需

      target 表示给定指标的目标值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.pods.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定义特定指标的目标值、平均值或平均利用率**

      - **metrics.pods.target.type** (string)，必需

        type 表示指标类别是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.pods.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.pods.target.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得出的资源指标均值的目标值，
        表示为 Pod 资源请求值的百分比。目前仅对 “Resource” 指标源类别有效。

      <!--
      - **metrics.pods.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.pods.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有 Pod 得出的指标均值的目标值（以数量形式给出）。

      <!--
      - **metrics.pods.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.pods.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的目标值（以数量形式给出）。

  <!--
  - **metrics.resource** (ResourceMetricSource)

    resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.
  -->

  - **metrics.resource** (ResourceMetricSource)

    resource 是指 Kubernetes 已知的资源指标（例如在请求和限制中指定的那些），
    此结构描述当前扩缩目标中的每个 Pod（例如 CPU 或内存）。此类指标内置于 Kubernetes 中，
    并且在使用 “Pods” 源的、按 Pod 统计的普通指标之外支持一些特殊的扩缩选项。

    <a name="ResourceMetricSource"></a>

    <!--
    *ResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.  Only one "target" type should be set.*

    - **metrics.resource.name** (string), required

      name is the name of the resource in question.
    -->

    ResourceMetricSource 指示如何根据请求和限制中指定的 Kubernetes 已知的资源指标进行扩缩容，
    此结构描述当前扩缩目标中的每个 Pod（例如 CPU 或内存）。在与目标值比较之前，这些指标值将被平均。
    此类指标内置于 Kubernetes 中，并且在使用 “Pods” 源的、按 Pod 统计的普通指标之外支持一些特殊的扩缩选项。
    只应设置一种 “target” 类别。

    - **metrics.resource.name** (string)，必需

      name 是相关资源的名称。

    <!--
    - **metrics.resource.target** (MetricTarget), required

      target specifies the target value for the given metric
    -->

    - **metrics.resource.target** (MetricTarget)，必需

      target 指定给定指标的目标值。

      <a name="MetricTarget"></a>

      <!--
      *MetricTarget defines the target value, average value, or average utilization of a specific metric*

      - **metrics.resource.target.type** (string), required

        type represents whether the metric type is Utilization, Value, or AverageValue
      -->

      **MetricTarget 定义特定指标的目标值、平均值或平均利用率**

      - **metrics.resource.target.type** (string)，必需

        type 表示指标类别是 `Utilization`、`Value` 或 `AverageValue`。

      <!--
      - **metrics.resource.target.averageUtilization** (int32)

        averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type
      -->

      - **metrics.resource.target.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得出的资源指标均值的目标值，
        表示为 Pod 资源请求值的百分比。目前仅对 “Resource” 指标源类别有效。

      <!--
      - **metrics.resource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the target value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **metrics.resource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有 Pod 得出的指标均值的目标值（以数量形式给出）。

      <!--
      - **metrics.resource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the target value of the metric (as a quantity).
      -->

      - **metrics.resource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的目标值（以数量形式给出）。

## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

<!--
HorizontalPodAutoscalerStatus describes the current status of a horizontal pod autoscaler.
-->
HorizontalPodAutoscalerStatus 描述了水平 Pod 自动扩缩器的当前状态。

<hr>

<!--
- **desiredReplicas** (int32), required

  desiredReplicas is the desired number of replicas of pods managed by this autoscaler, as last calculated by the autoscaler.
-->

- **desiredReplicas** (int32)，必需

  desiredReplicas 是此自动扩缩器管理的 Pod 的所期望的副本数，由自动扩缩器最后计算。

<!--
- **conditions** ([]HorizontalPodAutoscalerCondition)

  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*

  conditions is the set of conditions required for this autoscaler to scale its target, and indicates whether or not those conditions are met.
-->

- **conditions** ([]HorizontalPodAutoscalerCondition)

  **补丁策略：基于键 `type` 合并**

  **Map：合并时将保留 type 键的唯一值**

  conditions 是此自动扩缩器扩缩其目标所需的一组条件，并指示是否满足这些条件。

  <a name="HorizontalPodAutoscalerCondition"></a>

  <!--
  *HorizontalPodAutoscalerCondition describes the state of a HorizontalPodAutoscaler at a certain point.*

  - **conditions.status** (string), required

    status is the status of the condition (True, False, Unknown)
  -->

  **HorizontalPodAutoscalerCondition 描述 HorizontalPodAutoscaler 在某一时间点的状态。**

  - **conditions.status** (string)，必需

    status 是状况的状态（True、False、Unknown）。

  <!--
  - **conditions.type** (string), required

    type describes the current condition
  -->

  - **conditions.type** (string)，必需

    type 描述当前状况。

  <!--
  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime is the last time the condition transitioned from one status to another
  -->

  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime 是状况最近一次从一种状态转换到另一种状态的时间。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    **Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。为 time 包的许多函数方法提供了封装器。**

  <!--
  - **conditions.message** (string)

    message is a human-readable explanation containing details about the transition
  -->

  - **conditions.message** (string)

    message 是一个包含有关转换的可读的详细信息。

  <!--
  - **conditions.reason** (string)

    reason is the reason for the condition's last transition.
  -->

  - **conditions.reason** (string)

    reason 是状况最后一次转换的原因。

<!--
- **currentMetrics** ([]MetricStatus)

  *Atomic: will be replaced during a merge*

  currentMetrics is the last read state of the metrics used by this autoscaler.
-->

- **currentMetrics** ([]MetricStatus)

  **原子性：将在合并期间被替换**

  currentMetrics 是此自动扩缩器使用的指标的最后读取状态。

  <a name="MetricStatus"></a>

  <!--
  *MetricStatus describes the last-read state of a single metric.*

  - **currentMetrics.type** (string), required

    type is the type of metric source.  It will be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each corresponds to a matching field in the object. Note: "ContainerResource" type is available on when the feature-gate HPAContainerMetrics is enabled
  -->

  **MetricStatus 描述了单个指标的最后读取状态。**

  - **currentMetrics.type** (string)，必需

    type 是指标源的类别。它取值是 “ContainerResource”、“External”、“Object”、“Pods” 或 “Resource” 之一，
    每个类别映射到对象中的一个对应的字段。注意：“ContainerResource” 类别在特性门控 HPAContainerMetrics 启用时可用。

  <!--
  - **currentMetrics.containerResource** (ContainerResourceMetricStatus)

    container resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.
  -->

  - **currentMetrics.containerResource** (ContainerResourceMetricStatus)

    containerResource 是指 Kubernetes 已知的一种资源指标（例如在请求和限制中指定的那些），
    描述当前扩缩目标中每个 Pod 中的单个容器（例如 CPU 或内存）。
    此类指标内置于 Kubernetes 中，并且在使用 "Pods" 源的、按 Pod 统计的普通指标之外支持一些特殊的扩缩选项。

    <a name="ContainerResourceMetricStatus"></a>

    <!--
    *ContainerResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing a single container in each pod in the current scale target (e.g. CPU or memory).  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.*

    - **currentMetrics.containerResource.container** (string), required

      container is the name of the container in the pods of the scaling target
    -->

    ContainerResourceMetricStatus 指示如何根据请求和限制中指定的 Kubernetes 已知的资源指标进行扩缩容，
    此结构描述当前扩缩目标中的每个 Pod（例如 CPU 或内存）。此类指标内置于 Kubernetes 中，
    并且在使用 “Pods” 源的、按 Pod 统计的普通指标之外支持一些特殊的扩缩选项。

    - **currentMetrics.containerResource.container** (string)，必需

      container 是扩缩目标的 Pod 中的容器名称。

    <!--
    - **currentMetrics.containerResource.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    - **currentMetrics.containerResource.current** (MetricValueStatus)，必需

      current 包含给定指标的当前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.containerResource.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指标的当前值**

      - **currentMetrics.containerResource.current.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得出的资源指标均值的当前值，表示为 Pod 资源请求值的百分比。

      <!--
      - **currentMetrics.containerResource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.containerResource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相关 Pod 的指标均值的当前值（以数量形式给出）。

      <!--
      - **currentMetrics.containerResource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.containerResource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的当前值（以数量形式给出）。

    <!--
    - **currentMetrics.containerResource.name** (string), required

      name is the name of the resource in question.
    -->

    - **currentMetrics.containerResource.name** (string)，必需

      name 是相关资源的名称。

  <!--
  - **currentMetrics.external** (ExternalMetricStatus)

    external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).
  -->

  - **currentMetrics.external** (ExternalMetricStatus)

    external 指的是不与任何 Kubernetes 对象关联的全局指标。这一字段允许基于来自集群外部运行的组件
    （例如云消息服务中的队列长度，或来自集群外部运行的负载均衡器的 QPS）的信息进行自动扩缩。

    <a name="ExternalMetricStatus"></a>

    <!--
    *ExternalMetricStatus indicates the current value of a global metric not associated with any Kubernetes object.*

    - **currentMetrics.external.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    **ExternalMetricStatus 表示与任何 Kubernetes 对象无关的全局指标的当前值。**

    - **currentMetrics.external.current** (MetricValueStatus)，必需

      current 包含给定指标的当前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.external.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指标的当前值**

      - **currentMetrics.external.current.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得出的资源指标均值的当前值，表示为 Pod 资源请求值的百分比。

      <!--
      - **currentMetrics.external.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.external.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相关 Pod 的指标均值的当前值（以数量形式给出）。

      <!--
      - **currentMetrics.external.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.external.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的当前值（以数量形式给出）。

    <!--
    - **currentMetrics.external.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    - **currentMetrics.external.metric** (MetricIdentifier)，必需

      metric 通过名称和选择算符识别目标指标。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **currentMetrics.external.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定义指标的名称和可选的选择算符**

      - **currentMetrics.external.metric.name** (string)，必需

        name 是给定指标的名称。

      <!--
      - **currentMetrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **currentMetrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是给定指标的标准 Kubernetes 标签选择算符的字符串编码形式。
        设置后，它作为附加参数传递给指标服务器，以获取更具体的指标范围。
        未设置时，仅 metricName 参数将用于收集指标。

  <!--
  - **currentMetrics.object** (ObjectMetricStatus)

    object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object).
  -->

  - **currentMetrics.object** (ObjectMetricStatus)

    object 是指描述单个 Kubernetes 对象的指标（例如，Ingress 对象的 `hits-per-second`）。

    <a name="ObjectMetricStatus"></a>

    <!--
    *ObjectMetricStatus indicates the current value of a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).*

    - **currentMetrics.object.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    **ObjectMetricStatus 表示描述 Kubernetes 对象的指标的当前值（例如，Ingress 对象的 `hits-per-second`）。**

    - **currentMetrics.object.current** (MetricValueStatus)，必需

      current 包含给定指标的当前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.object.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指标的当前值**

      - **currentMetrics.object.current.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得出的资源指标均值的当前值，表示为 Pod 资源请求值的百分比。

      <!--
      - **currentMetrics.object.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.object.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相关 Pod 的指标均值的当前值（以数量形式给出）。

      <!--
      - **currentMetrics.object.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.object.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的当前值（以数量形式给出）。

    <!--
    - **currentMetrics.object.describedObject** (CrossVersionObjectReference), required

      DescribedObject specifies the descriptions of a object,such as kind,name apiVersion
    -->

    - **currentMetrics.object.describedObject** (CrossVersionObjectReference)，必需

      describeObject 表示对象的描述，如对象的 `kind`、`name`、`apiVersion`。

      <a name="CrossVersionObjectReference"></a>

      <!--
      *CrossVersionObjectReference contains enough information to let you identify the referred resource.*

      - **currentMetrics.object.describedObject.kind** (string), required

        kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->

      **CrossVersionObjectReference 包含足够的信息来让你识别所引用的资源。**

      - **currentMetrics.object.describedObject.kind** (string)，必需

        `kind` 是被引用对象的类别；更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

      <!--
      - **currentMetrics.object.describedObject.name** (string), required

        name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
      -->

      - **currentMetrics.object.describedObject.name** (string)，必需

        被引用对象的名称；更多信息： https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      <!--
      - **currentMetrics.object.describedObject.apiVersion** (string)

        apiVersion is the API version of the referent
      -->

      - **currentMetrics.object.describedObject.apiVersion** (string)

        被引用对象的 API 版本。

    <!--
    - **currentMetrics.object.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    - **currentMetrics.object.metric** (MetricIdentifier)，必需

      metric 通过名称和选择算符识别目标指标。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **currentMetrics.object.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定义指标的名称和可选的选择算符**

      - **currentMetrics.object.metric.name** (string)，必需

        name 是给定指标的名称。

      <!--
      - **currentMetrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **currentMetrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是给定指标的标准 Kubernetes 标签选择算符的字符串编码形式。
        设置后，它作为附加参数传递给指标服务器，以获取更具体的指标范围。
        未设置时，仅 metricName 参数将用于收集指标。

  <!--
  - **currentMetrics.pods** (PodsMetricStatus)

    pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second).  The values will be averaged together before being compared to the target value.
  -->

  - **currentMetrics.pods** (PodsMetricStatus)

    pods 是指描述当前扩缩目标中每个 Pod 的指标（例如，`transactions-processed-per-second`）。
    在与目标值进行比较之前，这些指标值将被平均。

    <a name="PodsMetricStatus"></a>

    <!--
    *PodsMetricStatus indicates the current value of a metric describing each pod in the current scale target (for example, transactions-processed-per-second).*

    - **currentMetrics.pods.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    **PodsMetricStatus 表示描述当前扩缩目标中每个 Pod 的指标的当前值（例如，`transactions-processed-per-second`）。**

    - **currentMetrics.pods.current** (MetricValueStatus)，必需

      current 包含给定指标的当前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.pods.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指标的当前值**

      - **currentMetrics.pods.current.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得出的资源指标均值的当前值，表示为 Pod 资源请求值的百分比。

      <!--
      - **currentMetrics.pods.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.pods.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相关 Pod 的指标均值的当前值（以数量形式给出）。

      <!--
      - **currentMetrics.pods.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.pods.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的当前值（以数量形式给出）。

    <!--
    - **currentMetrics.pods.metric** (MetricIdentifier), required

      metric identifies the target metric by name and selector
    -->

    - **currentMetrics.pods.metric** (MetricIdentifier)，必需

      metric 通过名称和选择算符识别目标指标。

      <a name="MetricIdentifier"></a>

      <!--
      *MetricIdentifier defines the name and optionally selector for a metric*

      - **currentMetrics.pods.metric.name** (string), required

        name is the name of the given metric
      -->

      **MetricIdentifier 定义指标的名称和可选的选择算符**

      - **currentMetrics.pods.metric.name** (string)，必需

        name 是给定指标的名称。

      <!--
      - **currentMetrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.
      -->

      - **currentMetrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector 是给定指标的标准 Kubernetes 标签选择算符的字符串编码形式。
        设置后，它作为附加参数传递给指标服务器，以获取更具体的指标范围。
        未设置时，仅 metricName 参数将用于收集指标。

  <!--
  - **currentMetrics.resource** (ResourceMetricStatus)

    resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.
  -->

  - **currentMetrics.resource** (ResourceMetricStatus)

    resource 是指 Kubernetes 已知的资源指标（例如在请求和限制中指定的那些），
    此结构描述当前扩缩目标中的每个 Pod（例如 CPU 或内存）。此类指标内置于 Kubernetes 中，
    并且在使用 “Pods” 源的、按 Pod 统计的普通指标之外支持一些特殊的扩缩选项。

    <a name="ResourceMetricStatus"></a>

    <!--
    *ResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.*

    - **currentMetrics.resource.current** (MetricValueStatus), required

      current contains the current value for the given metric
    -->

    ResourceMetricSource 指示如何根据请求和限制中指定的 Kubernetes 已知的资源指标进行扩缩容，
    此结构描述当前扩缩目标中的每个 Pod（例如 CPU 或内存）。在与目标值比较之前，这些指标值将被平均。
    此类指标内置于 Kubernetes 中，并且在使用 “Pods” 源的、按 Pod 统计的普通指标之外支持一些特殊的扩缩选项。

    - **currentMetrics.resource.current** (MetricValueStatus)，必需

      current 包含给定指标的当前值。

      <a name="MetricValueStatus"></a>

      <!--
      *MetricValueStatus holds the current value for a metric*

      - **currentMetrics.resource.current.averageUtilization** (int32)

        currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.
      -->

      **MetricValueStatus 保存指标的当前值**

      - **currentMetrics.resource.current.averageUtilization** (int32)

        averageUtilization 是跨所有相关 Pod 得出的资源指标均值的当前值，
        表示为 Pod 资源请求值的百分比。

      <!--
      - **currentMetrics.resource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue is the current value of the average of the metric across all relevant pods (as a quantity)
      -->

      - **currentMetrics.resource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue 是跨所有相关 Pod 的指标均值的当前值（以数量形式给出）。

      <!--
      - **currentMetrics.resource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value is the current value of the metric (as a quantity).
      -->

      - **currentMetrics.resource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value 是指标的当前值（以数量形式给出）。

    <!--
    - **currentMetrics.resource.name** (string), required

      name is the name of the resource in question.
    -->

    - **currentMetrics.resource.name** (string)，必需

      name 是相关资源的名称。

<!--
- **currentReplicas** (int32)

  currentReplicas is current number of replicas of pods managed by this autoscaler, as last seen by the autoscaler.
-->

- **currentReplicas** (int32)

  currentReplicas 是此自动扩缩器管理的 Pod 的当前副本数，如自动扩缩器最后一次看到的那样。

<!--
- **lastScaleTime** (Time)

  lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods, used by the autoscaler to control how often the number of pods is changed.
-->

- **lastScaleTime** (Time)

  lastScaleTime 是 HorizontalPodAutoscaler 上次扩缩 Pod 数量的时间，自动扩缩器使用它来控制更改 Pod 数量的频率。

  <a name="Time"></a>

  <!--
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  **Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。为 time 包的许多函数方法提供了封装器。**

<!--
- **observedGeneration** (int64)

  observedGeneration is the most recent generation observed by this autoscaler.
-->

- **observedGeneration** (int64)

  observedGeneration 是此自动扩缩器观察到的最新一代。

## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

<!--
HorizontalPodAutoscalerList is a list of horizontal pod autoscaler objects.
-->
HorizontalPodAutoscalerList 是水平 Pod 自动扩缩器对象列表。

<hr>

- **apiVersion**: autoscaling/v2

- **kind**: HorizontalPodAutoscalerList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata is the standard list metadata.
-->

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata 是标准的列表元数据。

<!--
- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>), required

  items is the list of horizontal pod autoscaler objects.
-->

- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>)，必需

  items 是水平 Pod 自动扩缩器对象的列表。

## Operations {#Operations}

<hr>

<!--
### `get` read the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `get` 读取指定的 HorizontalPodAutoscaler

#### HTTP 请求

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 参数

- **name** （**路径参数**）: string，必需

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `get` 读取指定 HorizontalPodAutoscaler 的状态

#### HTTP 请求

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 参数

- **name** （**路径参数**）: string，必需

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind HorizontalPodAutoscaler

#### HTTP Request
-->
### `list` 列出或观察 HorizontalPodAutoscaler 类别的对象

#### HTTP 请求

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
#### 参数

- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*)-->（**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*)-->（**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind HorizontalPodAutoscaler

#### HTTP Request
-->
### `list` 列出或观察 HorizontalPodAutoscaler 类别的对象

#### HTTP 请求

GET /apis/autoscaling/v2/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 参数

- **allowWatchBookmarks** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*)-->（**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*)-->（**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

<!--
### `create` create a HorizontalPodAutoscaler

#### HTTP Request
-->
### `create` 创建一个 HorizontalPodAutoscaler

#### HTTP 请求

POST /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
#### 参数

- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必需

- **dryRun** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

202 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `update` 替换指定的 HorizontalPodAutoscaler

#### HTTP 请求

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 参数

- **name** （**路径参数**）: string，必需

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必需

- **dryRun** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `update` 替换指定 HorizontalPodAutoscaler 的状态

#### HTTP 请求

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 参数

- **name** （**路径参数**）: string，必需

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必需

- **dryRun** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `patch` 部分更新指定的 HorizontalPodAutoscaler

#### HTTP 请求

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 参数

- **name** （**路径参数**）: string，必需

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `patch` 部分更新指定 HorizontalPodAutoscaler 的状态

#### HTTP 请求

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 参数

- **name** （**路径参数**）: string，必需

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `delete` delete a HorizontalPodAutoscaler

#### HTTP Request
-->
### `delete` 删除一个 HorizontalPodAutoscaler

#### HTTP 请求

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
#### 参数

- **name** （**路径参数**）: string，必需

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** <!--(*in query*)-->（**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of HorizontalPodAutoscaler

#### HTTP Request
-->
### `deletecollection` 删除 HorizontalPodAutoscaler 的集合

#### HTTP 请求

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
#### 参数

- **namespace** （**路径参数**）: string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** <!--(*in query*)-->（**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*)-->（**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*)-->（**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*)-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*)-->（**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

